"""The audit must count CSS rules, not lines or keyframe percentages."""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('css_audit', Path(__file__).resolve().parents[1] / 'scripts/css-audit.py')
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)

class CSSAuditTests(unittest.TestCase):
    def test_nested_conditions_and_multiline_selectors(self):
        css = '@media (max-width:40px) {.a,\n.b:hover {color:red} @supports (display:grid) {.a {display:grid}}} .a {color:blue}'
        rows = list(audit.rules(css))
        self.assertEqual([r[1] for r in rows], ['.a', '.b:hover', '.a', '.a'])
        self.assertEqual(len(rows[2][0]), 2)
        self.assertEqual(rows[-1][0], ())

    def test_keyframes_comments_strings_and_selector_functions(self):
        css = '/* .ghost {} */ @keyframes test {from {opacity:0} to {opacity:1}} .x:is(.a,.b), .c {content:"}";color:red}'
        rows = list(audit.rules(css))
        self.assertEqual([r[1] for r in rows], ['.x:is(.a,.b)', '.c'])

    def test_structure_gate(self):
        result = audit.audit()
        self.assertEqual(result['duplicate_pairs'], 0)
        self.assertEqual(result['cross_file_duplicates'], 0)
        self.assertLessEqual(result['important'], 15)
        self.assertEqual(result['unreferenced_classes'], 0)
