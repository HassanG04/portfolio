"""Compare the frozen overhaul contract with the branch's starting commit.

This is a source check, not a substitute for the computed-token and screenshot
comparison. CSS rules retain their order and media context in the comparison.
"""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "658dea7941962c1321fb2837b1ca3bbec2ad58df"
FROZEN = re.compile(r"\.(?:flip-card|ecpc-|depi-visual-flip|soft-skills)")


def original(path):
    return subprocess.check_output(
        ["git", "show", f"{BASE}:{path}"], cwd=ROOT
    ).decode("utf-8").replace("\r\n", "\n")


def current(path):
    return (ROOT / path).read_text(encoding="utf-8")


def css_rules(source, context=()):
    """Read ordinary CSS blocks while retaining nested at-rule context."""
    source = re.sub(r"/\*[\s\S]*?\*/", "", source)
    source = re.sub(r"@import[^\n]+", "", source)
    start = 0
    while start < len(source):
        opening = source.find("{", start)
        if opening < 0:
            return
        selector = source[start:opening].strip()
        depth, end, quote = 1, opening + 1, None
        while end < len(source) and depth:
            char = source[end]
            if quote:
                if char == "\\":
                    end += 1
                elif char == quote:
                    quote = None
            elif char in "\"'":
                quote = char
            elif char == "{":
                depth += 1
            elif char == "}":
                depth -= 1
            end += 1
        if depth:
            raise ValueError("Unbalanced CSS")
        body = source[opening + 1:end - 1]
        if re.match(r"@(media|supports|layer)\b", selector):
            yield from css_rules(body, (*context, selector))
        else:
            yield context, selector, body.strip()
        start = end


def section(source, beginning, end):
    return source[source.index(beginning):source.index(end)].strip()


def verify():
    results = {}
    for path in ("css/style.css", "css/design-system.css"):
        before, after = list(css_rules(original(path))), list(css_rules(current(path)))
        def protected(rules):
            result = []
            for context, selector, body in rules:
                if not FROZEN.search(selector):
                    continue
                # Follow-ups authorize intrinsic front/back sizing without a
                # scrollbar, while preserving the flip and carousel mechanics.
                if selector in (
                    '.profile-flip.is-flipped > .flip-card-inner',
                    '.profile-flip > .flip-card-inner',
                    '.profile-flip > .flip-card-inner::before',
                ):
                    continue
                if selector == '.profile-id-back.flip-card-back':
                    if not context:
                        body = re.sub(r'\s*grid-area:1 / 1;', '', body)
                        body = re.sub(r'\s*position:relative;', '', body)
                        body = re.sub(r'\s*inset:auto;', '', body)
                        body = body.replace('gap:16px;', 'gap:20px;')
                    else:
                        body = body.replace('padding:20px 16px;', 'padding:20px 14px;')
                result.append((context, selector, body.strip()))
            return result
        tokens = lambda rules: [
            (context, selector, re.findall(r"(--[\w-]+)\s*:\s*([^;]+)", body))
            for context, selector, body in rules
            if selector == ":root" or selector == 'html[data-theme="light"]'
        ]
        results[f"{path}: protected rules"] = protected(before) == protected(after)
        results[f"{path}: root/theme token declarations"] = tokens(before) == tokens(after)

    before, after = original("js/script.js"), current("js/script.js")
    # The required ambience-label change is the only permitted edit within the
    # broad shared-activity block, which also contains the independent audio UI.
    before = before.replace("'Disable Ambience'", "'Mute background ambience'")
    before = before.replace("'Enable Ambience'", "'Unmute background ambience'")
    start, end = "SHARED ACTIVITY FLIP CARDS", "CERTIFICATE IMAGE VIEWER"
    results["shared activity, carousel and audio (except requested labels)"] = (
        section(before, start, end) == section(after, start, end)
    )
    results["frozen Activity renderers"] = section(
        original("js/portfolio-components.js"), "  function renderEcpc(", "  function renderActivity("
    ) == section(
        current("js/portfolio-components.js"), "  function renderEcpc(", "  function renderActivity("
    )
    return results


if __name__ == "__main__":
    checks = verify()
    print(json.dumps(checks, indent=2))
    raise SystemExit(0 if all(checks.values()) else 1)
