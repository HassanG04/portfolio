"""Validate the actual static Pages artifact without scanning local project clones."""

from __future__ import annotations

import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    "index.html",
    "home.html",
    "AI/index.html",
    "ML/index.html",
    "DS/index.html",
    "DA/index.html",
    "DE/index.html",
]


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.references = [], []
        self.title = False

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        if "id" in attributes:
            self.ids.append(attributes["id"])
        if tag == "title":
            self.title = True
        for key in ("href", "src"):
            if attributes.get(key):
                self.references.append(attributes[key])


def reference_error(
    root: Path, page: Path, reference: str, ids: list[str]
) -> str | None:
    parsed = urlsplit(reference)
    if parsed.scheme or parsed.netloc:
        return (
            None  # External availability is not silently claimed by this offline check.
        )
    if not parsed.path:
        if parsed.fragment and parsed.fragment not in ids:
            return f"missing local anchor {reference}"
        return None
    relative = unquote(parsed.path)
    if relative.startswith("/portfolio/"):
        target = root / relative.removeprefix("/portfolio/")
    elif relative.startswith("/"):
        target = root / relative.lstrip("/")
    else:
        target = page.parent / relative
    target = target.resolve()
    if not target.is_relative_to(root.resolve()):
        return f"reference leaves site root: {reference}"
    if target.is_dir():
        target = target / "index.html"
    if not target.is_file():
        return f"missing local file {reference}"
    return None


def validate(root=ROOT):
    errors = []
    for name in PAGES:
        page = root / name
        if not page.is_file():
            errors.append(f"missing page {name}")
            continue
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8"))
        if "rolePageRoot" in parser.ids:
            script = (root / "js/role-page.js").read_text(encoding="utf-8")
            parser.ids.extend(re.findall(r'\bid="([^"$]+)"', script))
        if not parser.title:
            errors.append(f"{name}: missing title")
        if len(parser.ids) != len(set(parser.ids)):
            errors.append(f"{name}: duplicate element IDs")
        for reference in parser.references:
            error = reference_error(root, page, reference, parser.ids)
            if error:
                errors.append(f"{name}: {error}")
    # Role-page images are inserted dynamically rather than being HTML attributes.
    for image in re.findall(
        r"image: '([^']+)'", (root / "js/role-page.js").read_text(encoding="utf-8")
    ):
        if not (root / "images" / image).is_file():
            errors.append(f"missing dynamic project image {image}")
    return errors


if __name__ == "__main__":
    issues = validate()
    if issues:
        raise SystemExit("\n".join(issues))
    print(
        f"Validated {len(PAGES)} pages, local files/anchors, IDs and dynamic project images."
    )
