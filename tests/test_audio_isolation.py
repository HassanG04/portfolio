"""Source-level guard for the independent ambience and interface-cue channels.

These checks do not claim that a browser granted autoplay permission or that a
speaker produced sound. The listening/interaction check remains a preview gate.
"""

import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = (ROOT / "js/script.js").read_text(encoding="utf-8")
PAGES = [ROOT / "index.html"] + [
    ROOT / role / "index.html" for role in ("AI", "ML", "DS", "DA", "DE")
]


def function_source(name):
    """Read a top-level function in this DOMContentLoaded callback."""
    match = re.search(
        rf"^  (?:async )?function {re.escape(name)}\([^\n]*\n.*?^  }}$",
        SOURCE,
        flags=re.MULTILINE | re.DOTALL,
    )
    if match is None:
        raise AssertionError(f"Missing audio function: {name}")
    return match.group()


class AudioIsolationTests(unittest.TestCase):
    def test_interface_and_activity_cues_never_read_ambience_state(self):
        for name in (
            "playInterfaceSound", "playInterfaceSoundFallback",
            "playActivitySounds", "playActivitySoundFallback", "stopActivitySounds",
        ):
            with self.subTest(function=name):
                self.assertNotRegex(function_source(name), r"\b\w*[Aa]mbience\w*\b")

    def test_ambience_mutations_do_not_stop_or_adjust_cue_channels(self):
        cue_identifier = r"\b(?:activityAudioContext|activitySound\w*|activeActivity\w*|activeInterface\w*|bootAudio|stopActivitySounds|playInterfaceSound)\b"
        for name in ("setAmbienceEnabled", "fadeAmbienceTo", "stopAmbience"):
            with self.subTest(function=name):
                self.assertNotRegex(function_source(name), cue_identifier)
        for element, event in (
            ("ambienceToggle", "click"), ("ambienceVolumeSlider", "input"),
            ("ambienceVolumeSlider", "change"),
        ):
            handler = re.search(
                rf"^  {element}\?\.addEventListener\('{event}',.*?^  }}\);",
                SOURCE, flags=re.MULTILINE | re.DOTALL,
            )
            self.assertIsNotNone(handler)
            self.assertNotRegex(handler.group(), cue_identifier)

    def test_saved_preferences_and_accessible_state_contract_remain(self):
        self.assertIn("'portfolio_ambience_enabled_v2'", SOURCE)
        self.assertIn("'portfolio_ambience_volume'", SOURCE)
        toggle = function_source("updateAmbienceToggle")
        self.assertIn("'Mute background ambience'", toggle)
        self.assertIn("'Unmute background ambience'", toggle)
        self.assertIn("setAttribute('aria-pressed', String(ambienceEnabled))", toggle)
        self.assertIn("!ambienceEnabled || ambienceVolume === 0", toggle)
        self.assertIn("'fas fa-volume-xmark'", toggle)
        self.assertIn("ambienceTooltip.textContent = label", toggle)
        for page in PAGES:
            with self.subTest(page=page.relative_to(ROOT)):
                html = page.read_text(encoding="utf-8")
                self.assertIn('aria-label="Background ambience volume"', html)
                self.assertIn('aria-label="Mute background ambience"', html)

    def test_page_loader_is_gone_but_boot_cue_remains(self):
        for path in [*PAGES, ROOT / "js/role-page.js", *(ROOT / "css").glob("*.css")]:
            with self.subTest(path=path.relative_to(ROOT)):
                self.assertNotRegex(
                    path.read_text(encoding="utf-8"),
                    r"page-loader|loader-inner|loader-ring|loader-logo",
                )
        self.assertNotIn("PAGE LOADER", SOURCE)
        self.assertIn("sounds/boot.mp3", SOURCE)
        self.assertIn("bootAudio.play()", function_source("tryBootCue"))


if __name__ == "__main__":
    unittest.main()
