"""Guard the fixed Activity photo frame against content-driven flip resizing."""

import re
import unittest
from pathlib import Path


class FlipFrameTests(unittest.TestCase):
    def test_back_content_cannot_resize_the_photo_frame(self):
        css = (Path(__file__).resolve().parents[1] / "css/activity.css").read_text(encoding="utf-8")
        self.assertNotRegex(css, r"\.profile-flip\.is-flipped[^{}]*\{[^}]*height\s*:\s*auto")
        self.assertNotRegex(css, r"\.profile-flip\.is-flipped[^{}]*\{[^}]*position\s*:\s*relative")
        back = re.search(r"\.profile-id-back\.flip-card-back\s*\{([^}]+)", css).group(1)
        self.assertRegex(back, r"overflow:\s*visible")
        self.assertRegex(back, r"position:\s*absolute")
        self.assertRegex(css, r"aspect-ratio:\s*var\(--activity-photo-ratio,\s*var\(--ecpc-photo-ratio,\s*3 / 2\)\)")
        inner = re.search(r"\.profile-flip > \.flip-card-inner\s*\{([^}]+)", css).group(1)
        for property, value in {"position":"absolute", "inset":"0px", "width":"100%", "height":"100%", "min-height":"0px"}.items():
            self.assertRegex(inner, rf"{property}:\s*{value}")
        self.assertNotIn(".profile-flip > .flip-card-inner::before", css)
        self.assertIn(".profile-id-card:not(.is-current-profile)", css)


if __name__ == "__main__":
    unittest.main()
