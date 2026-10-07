"""Source regressions for slide ownership and compact activity layout."""
from html.parser import HTMLParser
import importlib.util
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('css_audit', ROOT / 'scripts/css-audit.py')
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}


class ActivityParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack, self.errors, self.slides = [], [], []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'data-ecpc-slide' in attrs:
            ancestors = [attributes.get('class', '').split() for _, attributes in self.stack]
            if not ancestors or 'ecpc-slider-track' not in ancestors[-1]:
                self.errors.append('ECPC slide is outside the slider track')
            self.slides.append(attrs['data-ecpc-slide'])
        if tag not in VOID:
            self.stack.append((tag, attrs))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack or self.stack[-1][0] != tag:
            self.errors.append(f'Unexpected closing {tag}, inside {self.stack[-1][0] if self.stack else "nothing"}')
        else:
            self.stack.pop()


class ActivityLayoutTests(unittest.TestCase):
    def test_activity_markup_keeps_all_four_slides_in_the_track(self):
        source = "const fs=require('fs'),vm=require('vm'),c={window:{}};for(const f of ['portfolio-data','portfolio-components'])vm.runInNewContext(fs.readFileSync('js/'+f+'.js','utf8'),c);process.stdout.write(c.window.PORTFOLIO_COMPONENTS.renderActivity());"
        markup = subprocess.check_output(['node', '-e', source], cwd=ROOT).decode('utf-8')
        parser = ActivityParser()
        parser.feed(markup)
        self.assertEqual(parser.errors, [])
        self.assertEqual(parser.stack, [])
        self.assertEqual(parser.slides, ['0', '1', '2', '3'])

    def test_activity_stylesheet_blocks_are_balanced(self):
        css = (ROOT / 'css/activity.css').read_text(encoding='utf-8')
        depth = 0
        for token in audit.TOKEN.finditer(css):
            depth += (token.group() == '{') - (token.group() == '}')
            self.assertGreaterEqual(depth, 0, f'Unmatched closing brace at line {css[:token.start()].count(chr(10)) + 1}')
        self.assertEqual(depth, 0)

    def test_base_flip_sizing_is_not_accidentally_inside_a_media_query(self):
        rules = list(audit.rules((ROOT / 'css/activity.css').read_text(encoding='utf-8')))
        for selector in ['.profile-flip[data-flip-card]', '.profile-id-back.flip-card-back', '.profile-id-card']:
            self.assertTrue(any(not condition and name == selector for condition, name, _ in rules), selector)

    def test_depi_has_a_compact_visual_and_a_phone_stack(self):
        rules = list(audit.rules((ROOT / 'css/activity.css').read_text(encoding='utf-8')))
        visual = next(body for condition, name, body in rules if not condition and name == '.depi-visual-flip')
        self.assertIn('max-width: 340px', visual)
        phone = next(body for condition, name, body in rules if condition == ('@media (max-width: 991.98px)',) and name == '.depi-progress-card')
        self.assertIn('grid-template-columns: 1fr', phone)

    def test_future_logo_and_caption_use_separate_layout_rows(self):
        rules = list(audit.rules((ROOT / 'css/activity.css').read_text(encoding='utf-8')))
        face = next(body for condition, name, body in rules if not condition and name == '.ecpc-future-card')
        logo = next(body for condition, name, body in rules if not condition and name == '.ecpc-future-card > .ecpc-future-logo')
        self.assertIn('grid-template-rows: minmax(0px, 1fr) auto', face)
        self.assertIn('position: relative', logo)
        self.assertIn('object-fit: contain', logo)
        self.assertNotIn('translate(-50%', logo)


if __name__ == '__main__':
    unittest.main()
