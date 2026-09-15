"""Generate review links and exact commit/CI evidence without mutating remote repositories."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
BRANCH = "codex/portfolio-overhaul"
EXCLUDED = {"fares", "Machine_Learning_Intern_Summer_2025"}


def git(directory, *arguments):
    return subprocess.check_output(
        ["git", "-c", f"safe.directory={directory.as_posix()}", *arguments],
        cwd=directory,
        text=True,
    ).strip()


def main():
    scan = json.loads((ROOT / "docs/repository-scan.json").read_text(encoding="utf-8"))
    evidence = json.loads(
        (ROOT / "docs/remote-ci-results.json").read_text(encoding="utf-8")
    )
    checks = {record["repository"]: record for record in evidence["repositories"]}
    lines = [
        "# Publication and verification evidence",
        "",
        "All eighteen changed repositories have a `codex/portfolio-overhaul` review branch.",
        "Default branches are unchanged. Merging the portfolio branch will trigger its existing",
        "Pages deployment; no new live site or cloud deployment is claimed here.",
        "",
        f"Remote evidence checked at {evidence['checked_at_utc']}. CI links identify exact tested",
        "commits. Documentation-only follow-ups may have later commits; this is a dated snapshot,",
        "not a permanent promise of green builds. The portfolio report cannot include its own",
        "eventual commit hash before it is committed.",
        "",
        "| Repository | Review comparison | Published head at snapshot | CI evidence |",
        "|---|---|---|---|",
    ]
    for record in scan["repositories"]:
        name = record["repository"]
        if name in EXCLUDED:
            continue
        directory = ROOT if name == "portfolio" else ROOT / ".portfolio-repos" / name
        head = git(directory, "rev-parse", "HEAD")
        default = git(
            directory, "symbolic-ref", "--short", "refs/remotes/origin/HEAD"
        ).removeprefix("origin/")
        remote = git(
            directory,
            "ls-remote",
            "origin",
            f"refs/heads/{BRANCH}",
            f"refs/heads/{default}",
        )
        remote_refs = {line.split()[1]: line.split()[0] for line in remote.splitlines()}
        if head != remote_refs.get(f"refs/heads/{BRANCH}"):
            raise SystemExit(f"Local and actual published heads differ: {name}")
        if record["original_head"] != remote_refs.get(f"refs/heads/{default}"):
            raise SystemExit(f"Default branch changed since original scan: {name}")
        compare = f"https://github.com/HassanG04/{name}/compare/{quote(default, safe='')}...{quote(BRANCH, safe='')}"
        check = checks.get(name, {})
        runs = check.get("runs", [])
        ci = "N/A — profile documentation"
        if runs:
            run = runs[0]
            outcome = run["conclusion"] or run["status"]
            ci = f"[{outcome} @ {run['head_sha'][:7]}]({run['html_url']})"
        elif name != "HassanG04":
            ci = "Unavailable — not claimed verified"
        lines.append(f"| {name} | [Review changes]({compare}) | `{head[:7]}` | {ci} |")
    lines.extend(
        [
            "",
            "`fares` remains empty because its purpose is unavailable. The internship fork remains",
            "read-only because its current checkout has no owner-authored project source.",
            "The user's pre-existing `images/portfolio.png` edit is not staged or published.",
            "Expanded toxic-content CSV/pickle data was excluded from publication; its redistribution",
            "permission is unknown. Existing history was not rewritten.",
            "",
        ]
    )
    (ROOT / "docs/publication-status.md").write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    main()
