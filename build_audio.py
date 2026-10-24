from pathlib import Path
import json
import re
import win32com.client

ROOT = Path(__file__).resolve().parent
AUDIO = ROOT / 'audio'
AUDIO.mkdir(exist_ok=True)
pages = json.loads((ROOT / 'pages.json').read_text(encoding='utf-8'))
speaker = win32com.client.Dispatch('SAPI.SpVoice')
speaker.Voice = speaker.GetVoices().Item(1)
stream = win32com.client.Dispatch('SAPI.SpFileStream')
for page in pages:
    for index, segment in enumerate(page['segments']):
        text = segment['text']
        if not re.search(r'[A-Za-z]', text):
            continue
        path = AUDIO / f"{page['page']:02}-{index:03}.wav"
        if path.exists():
            continue
        stream.Open(str(path), 3)
        speaker.AudioOutputStream = stream
        speaker.Speak(text)
        stream.Close()
    print(f"audio {page['page']}/{len(pages)}", flush=True)
