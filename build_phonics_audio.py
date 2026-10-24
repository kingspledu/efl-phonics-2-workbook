"""Create isolated phonics sounds so browsers do not read letters by name."""
from pathlib import Path
import win32com.client

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / 'audio' / 'phonics'
OUTPUT.mkdir(parents=True, exist_ok=True)

# SAPI American English phonemes; short vowels are used throughout this workbook.
PHONEMES = {
    'a': 'ae', 'b': 'b', 'c': 'k', 'd': 'd', 'e': 'eh', 'f': 'f',
    'g': 'g', 'h': 'h', 'i': 'ih', 'j': 'jh', 'k': 'k', 'l': 'l',
    'm': 'm', 'n': 'n', 'o': 'ao', 'p': 'p', 'q': 'k', 'r': 'r',
    's': 's', 't': 't', 'u': 'ah', 'v': 'v', 'w': 'w', 'x': 'k s',
    'y': 'y', 'z': 'z',
    'an': 'ae n', 'at': 'ae t', 'ap': 'ae p', 'ad': 'ae d', 'am': 'ae m',
    'ip': 'ih p', 'it': 'ih t', 'ix': 'ih k s', 'ib': 'ih b',
    'id': 'ih d', 'ig': 'ih g', 'in': 'ih n',
    'et': 'eh t', 'ed': 'eh d', 'en': 'eh n',
    'ot': 'ao t', 'op': 'ao p', 'ox': 'ao k s',
    'ug': 'ah g', 'ub': 'ah b', 'up': 'ah p',
    'un': 'ah n', 'ud': 'ah d', 'ut': 'ah t',
}

voice = win32com.client.Dispatch('SAPI.SpVoice')
voice.Voice = voice.GetVoices().Item(1)  # Microsoft Zira, en-US
stream = win32com.client.Dispatch('SAPI.SpFileStream')
for key, phones in PHONEMES.items():
    target = OUTPUT / f'{key}.wav'
    stream.Open(str(target), 3)
    voice.AudioOutputStream = stream
    voice.Speak(f'<pron sym="{phones}"/>', 8)  # SVSFIsXML
    stream.Close()

# The requested label is pronounced exactly as Korean “오그”, never O-G.
voice.Voice = voice.GetVoices().Item(0)  # Microsoft Heami, ko-KR
target = OUTPUT / 'og.wav'
stream.Open(str(target), 3)
voice.AudioOutputStream = stream
voice.Speak('오그')
stream.Close()
print(f'Created {len(PHONEMES) + 1} phonics clips in {OUTPUT}')
