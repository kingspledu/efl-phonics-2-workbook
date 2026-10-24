"""Pre-record picture/answer words at full volume for offline GitHub Pages playback."""
from pathlib import Path
import json
import subprocess
import win32com.client

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / 'audio' / 'words'
OUTPUT.mkdir(parents=True, exist_ok=True)
javascript = """
const fs = require('fs');
const vm = require('vm');
const source = fs.readFileSync('reading-map.js', 'utf8');
const words = vm.runInNewContext(source + '; [...new Set(Object.values(READING_REGIONS).flat().map(x => x.text))]', {});
console.log(JSON.stringify(words));
"""
words = json.loads(subprocess.check_output(['node', '-e', javascript], cwd=ROOT, text=True))
voice = win32com.client.Dispatch('SAPI.SpVoice')
voice.Voice = voice.GetVoices().Item(1)  # Microsoft Zira, en-US
stream = win32com.client.Dispatch('SAPI.SpFileStream')
for word in words:
    if not word.isalpha():
        continue
    path = OUTPUT / f'{word.lower()}.wav'
    if path.exists():
        continue
    stream.Open(str(path), 3)
    voice.AudioOutputStream = stream
    voice.Speak(word)
    stream.Close()
print(f'Prepared {len(words)} picture/answer words')
