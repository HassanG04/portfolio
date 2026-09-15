"""Read public review-branch CI status; no tokens, reruns or repository mutations."""

from __future__ import annotations

import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
BRANCH = "codex/portfolio-overhaul"


def verified_runs(runs, expected_head):
    """A green run is evidence only for the exact reviewed commit."""
    return bool(runs) and all(
        run["head_sha"] == expected_head
        and run["status"] == "completed"
        and run["conclusion"] == "success"
        for run in runs
    )


def get(path):
    headers = {
        "User-Agent": "portfolio-verification",
        "Accept": "application/vnd.github+json",
    }
    if token := os.environ.get("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {token}"
    request = Request(
        "https://api.github.com/" + path,
        headers=headers,
    )
    with urlopen(request, timeout=20) as response:
        return json.load(response)


def main():
    scan = json.loads((ROOT / "docs/repository-scan.json").read_text(encoding="utf-8"))
    records = []
    for repository in scan["repositories"]:
        name = repository["repository"]
        if name in {"fares", "Machine_Learning_Intern_Summer_2025", "HassanG04"}:
            continue
        try:
            directory = (
                ROOT if name == "portfolio" else ROOT / ".portfolio-repos" / name
            )
            expected_head = subprocess.check_output(
                [
                    "git",
                    "-c",
                    f"safe.directory={directory.as_posix()}",
                    "rev-parse",
                    "HEAD",
                ],
                cwd=directory,
                text=True,
            ).strip()
            result = get(
                f"repos/HassanG04/{name}/actions/runs?branch={quote(BRANCH, safe='')}&per_page=1"
            )
            runs = [
                {
                    key: run[key]
                    for key in [
                        "id",
                        "name",
                        "html_url",
                        "head_sha",
                        "status",
                        "conclusion",
                        "created_at",
                    ]
                }
                for run in result["workflow_runs"]
            ]
            for run in runs:
                if run["conclusion"] == "failure":
                    jobs = get(
                        f"repos/HassanG04/{name}/actions/runs/{run['id']}/jobs?per_page=50"
                    )
                    run["jobs"] = [
                        {
                            "name": job["name"],
                            "conclusion": job["conclusion"],
                            "failed_steps": [
                                step["name"]
                                for step in job["steps"]
                                if step["conclusion"] == "failure"
                            ],
                        }
                        for job in jobs["jobs"]
                    ]
            records.append(
                {
                    "repository": name,
                    "expected_head": expected_head,
                    "runs": runs,
                    "verified": verified_runs(runs, expected_head),
                }
            )
            print(
                name, [(run["status"], run["conclusion"]) for run in runs], flush=True
            )
        except (HTTPError, URLError, subprocess.CalledProcessError) as exc:
            records.append({"repository": name, "error": str(exc)})
            print(name, "unavailable", flush=True)
    (ROOT / "docs/remote-ci-results.json").write_text(
        json.dumps(
            {
                "checked_at_utc": datetime.now(timezone.utc).isoformat(),
                "branch": BRANCH,
                "repositories": records,
            },
            indent=2,
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
