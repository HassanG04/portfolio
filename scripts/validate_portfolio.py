"""Local portfolio-wide verification. Repository clones and the test runtime are explicit."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPECS = {
    "DEPI_TASKS": ("src tests", "pytest"),
    "words_combination_generator": ("GC.py tests", "pytest"),
    "RAG_Cellula_Week_3": ("src tests", "pytest"),
    "Hotel-Cancellation-Prediciton": ("backend tests alembic scripts", "pytest"),
    "Cellula_LSTM_Week1": ("src tests", "pytest"),
    "heart-detection-model": ("src tests scripts", "pytest"),
    "yet_another_heart_disease_application": (
        "medical_project/predictor medical_project/medical_project training.py tests",
        "heart-web",
    ),
    "Cellula_NLP_Week4": ("assistants.py Task0.py Task1.py Task2.py tests", "pytest"),
    "cellula_NLP_week6_and_week7": ("agent tools app.py main.py tests", "pytest"),
    "cellula_NLP_week5": (
        "assistant smart_assistant_project task0.py scripts",
        "django",
    ),
    "Emoji_Recognition": (
        "tweet_emotion_django_app/predictor tweet_emotion_django_app/tweet_emotion_site",
        "emoji",
    ),
    "River-Flood-Prediction": ("src tests app.py", "pytest"),
    "ShopLifting_Detection": ("src tests ucf_png_to_mp4.py", "pytest"),
    "Quantization_Cellula_Week_2": ("src tests", "pytest"),
}


def run(command, directory):
    result = subprocess.run(
        command,
        cwd=directory,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=300,
        check=False,
    )
    return {
        "command": command,
        "exit_code": result.returncode,
        "output": (result.stdout + result.stderr)[-10000:],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repos", type=Path, default=ROOT / ".portfolio-repos")
    parser.add_argument("--python", type=Path, default=Path(sys.executable))
    parser.add_argument(
        "--output", type=Path, default=ROOT / "docs/validation-results.json"
    )
    args = parser.parse_args()
    executable = str(args.python.resolve())
    results = {
        "verified_at_utc": datetime.now(timezone.utc).isoformat(),
        "python": executable,
        "repositories": {},
    }
    for name, (targets, mode) in SPECS.items():
        directory = args.repos / name
        if not directory.is_dir():
            raise SystemExit(f"Repository unavailable: {directory}")
        commands = [
            [executable, "-m", "ruff", "check", *targets.split()],
            [executable, "-m", "ruff", "format", "--check", *targets.split()],
        ]
        if mode == "pytest":
            commands.append([executable, "-m", "pytest", "-q"])
        elif mode == "django":
            commands.extend(
                [
                    [executable, "manage.py", "check"],
                    [executable, "manage.py", "test", "assistant"],
                ]
            )
        elif mode == "emoji":
            commands.extend(
                [
                    [executable, "tweet_emotion_django_app/manage.py", "check"],
                    [
                        executable,
                        "tweet_emotion_django_app/manage.py",
                        "test",
                        "predictor",
                    ],
                ]
            )
        else:
            commands.extend(
                [
                    [executable, "-m", "unittest", "discover", "-s", "tests"],
                    [executable, "medical_project/manage.py", "test", "predictor"],
                ]
            )
        checks = [run(command, directory) for command in commands]
        results["repositories"][name] = checks
        print(
            name,
            "PASS" if all(check["exit_code"] == 0 for check in checks) else "FAIL",
            flush=True,
        )
    results["repositories"]["portfolio"] = [
        run([executable, "-m", "unittest", "discover", "-s", "tests"], ROOT),
        run(["node", "--check", "js/script.js"], ROOT),
        run(["node", "--check", "js/role-page.js"], ROOT),
    ]
    args.output.parent.mkdir(exist_ok=True)
    args.output.write_text(json.dumps(results, indent=2), encoding="utf-8")
    raise SystemExit(
        int(
            any(
                check["exit_code"] != 0
                for checks in results["repositories"].values()
                for check in checks
            )
        )
    )


if __name__ == "__main__":
    main()
