"""Record original Git trees and scan current tracked source without exposing secret values."""

from __future__ import annotations

import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATTERNS = {
    "provider_token": r"(?:sk-(?:proj-)?[A-Za-z0-9_-]{24,}|AIza[A-Za-z0-9_-]{30,}|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})",
    "credentialed_mongodb_url": r"mongodb\+srv://[^:\s/]+:[^@\s]+@",
    "hardcoded_django_secret": r"SECRET_KEY\s*=\s*['\"]django-insecure-",
    "private_key": r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
}


def git(directory, *arguments):
    result = subprocess.run(
        ["git", "-C", str(directory), *arguments],
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=False,
    )
    return result.stdout.strip() if result.returncode == 0 else None


def main():
    output = ROOT / "docs/repository-scan.json"
    previous = json.loads(output.read_text(encoding="utf-8")) if output.exists() else {}
    original = {
        record["repository"]: record for record in previous.get("repositories", [])
    }
    repositories = [ROOT] + sorted(
        path
        for path in (ROOT / ".portfolio-repos").iterdir()
        if (path / ".git").exists()
    )
    records, findings = [], []
    for directory in repositories:
        name = "portfolio" if directory == ROOT else directory.name
        files = (
            git(directory, "ls-tree", "-r", "--name-only", "HEAD") or ""
        ).splitlines()
        records.append(
            {
                "repository": name,
                "original_head": git(directory, "rev-parse", "HEAD"),
                "remote": git(directory, "remote", "get-url", "origin"),
                "original_files": files,
                "original_notebooks": sum(file.endswith(".ipynb") for file in files),
                "original_workflows": [
                    file for file in files if file.startswith(".github/workflows/")
                ],
                "original_tests": [
                    file for file in files if "test" in Path(file).name.lower()
                ],
                "large_original_files": [
                    file
                    for file in files
                    if (directory / file).is_file()
                    and (directory / file).stat().st_size > 10_000_000
                ],
            }
        )
        current = (
            git(directory, "ls-files", "--cached", "--others", "--exclude-standard")
            or ""
        ).splitlines()
        for relative in set(current):
            path = directory / relative
            if (
                path.suffix.lower()
                not in {
                    ".py",
                    ".js",
                    ".ts",
                    ".tsx",
                    ".json",
                    ".yml",
                    ".yaml",
                    ".ipynb",
                    ".md",
                    ".html",
                    ".cpp",
                    ".h",
                }
                or not path.is_file()
            ):
                continue
            content = path.read_text(encoding="utf-8", errors="replace")
            for category, pattern in PATTERNS.items():
                if re.search(pattern, content):
                    findings.append(
                        {"repository": name, "file": relative, "category": category}
                    )
    records = [original.get(record["repository"], record) for record in records]
    output.parent.mkdir(exist_ok=True)
    output.write_text(
        json.dumps(
            {
                "scanned_at_utc": datetime.now(timezone.utc).isoformat(),
                "repositories": records,
                "secret_like_findings": findings,
                "limits": "Pattern scan of current tracked/unignored source; not a full history or security audit.",
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(
        json.dumps(
            {"repositories": len(records), "secret_like_findings": findings}, indent=2
        )
    )


if __name__ == "__main__":
    main()
