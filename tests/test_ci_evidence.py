"""Prevent stale, failed or unfinished remote runs from becoming portfolio evidence."""

import unittest

from scripts.check_remote_ci import verified_runs


class CIEvidenceTests(unittest.TestCase):
    def test_completed_success_matches_reviewed_commit(self):
        self.assertTrue(
            verified_runs(
                [
                    {
                        "head_sha": "reviewed",
                        "status": "completed",
                        "conclusion": "success",
                    }
                ],
                "reviewed",
            )
        )

    def test_green_run_for_old_commit_is_not_evidence(self):
        self.assertFalse(
            verified_runs(
                [{"head_sha": "old", "status": "completed", "conclusion": "success"}],
                "reviewed",
            )
        )

    def test_missing_pending_and_failed_runs_are_not_evidence(self):
        self.assertFalse(verified_runs([], "reviewed"))
        for status, conclusion in [("in_progress", None), ("completed", "failure")]:
            with self.subTest(status=status, conclusion=conclusion):
                self.assertFalse(
                    verified_runs(
                        [
                            {
                                "head_sha": "reviewed",
                                "status": status,
                                "conclusion": conclusion,
                            }
                        ],
                        "reviewed",
                    )
                )
