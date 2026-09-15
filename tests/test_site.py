import unittest
from pathlib import Path

from scripts.validate_site import ROOT, PageParser, reference_error, validate


class SiteTests(unittest.TestCase):
    def test_reference_failures_and_external_links(self):
        page = ROOT / "index.html"
        self.assertIsNone(reference_error(ROOT, page, "#about", ["about"]))
        self.assertIn("anchor", reference_error(ROOT, page, "#absent", []))
        self.assertIn("missing", reference_error(ROOT, page, "missing.png", []))
        self.assertIn("leaves", reference_error(ROOT, page, "../outside.png", []))
        self.assertIsNone(reference_error(ROOT, page, "https://example.com/", []))
        self.assertIsNone(reference_error(ROOT, page, "AI/", []))

    def test_parser_collects_real_references_and_ids(self):
        parser = PageParser()
        parser.feed(
            '<title>Test</title><a id="work" href="#work">Work</a><img src="image.png">'
        )
        self.assertEqual(parser.ids, ["work"])
        self.assertEqual(parser.references, ["#work", "image.png"])
        self.assertTrue(parser.title)

    def test_actual_site(self):
        self.assertEqual(validate(Path(ROOT)), [])
