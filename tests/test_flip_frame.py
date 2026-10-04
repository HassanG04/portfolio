"""Guard the fixed Activity photo frame against content-driven flip resizing."""

import re
import unittest
from pathlib import Path


class FlipFrameTests(unittest.TestCase):
    def test_back_content_cannot_resize_the_photo_frame(self):
        css = (Path(__file__).resolve().parents[1] / "css/design-system.css").read_text(encoding="utf-8")
        self.assertNotRegex(css, r"\.profile-flip\.is-flipped[^{}]*\{[^}]*height\s*:\s*auto")
        self.assertNotRegex(css, r"\.profile-flip\.is-flipped[^{}]*\{[^}]*position\s*:\s*relative")
        back = re.search(r"\.profile-id-back\.flip-card-back\s*\{([^}]+)", css).group(1)
        self.assertIn("overflow:visible", back)
        self.assertIn("position:relative", back)
        self.assertIn(".profile-flip[data-flip-card] { display:grid; grid-template-columns:minmax(0,1fr); aspect-ratio:auto; min-height:min-content; max-height:none; }", css)
        self.assertIn(".profile-flip > .flip-card-inner { display:grid; grid-template-columns:minmax(0,1fr); height:auto; min-height:min-content; }", css)


if __name__ == "__main__":
    unittest.main()
