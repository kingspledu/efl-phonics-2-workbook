from pathlib import Path
import json

import cv2
import easyocr
import fitz
import numpy as np
from PIL import Image

SOURCE = Path(__file__).resolve().parent.parent / 'EFL PHONICS 2-workbook.pdf'
ROOT = Path(__file__).resolve().parent
PAGES = ROOT / 'pages'
THUMBS = ROOT / 'thumbs'
PAGES.mkdir(exist_ok=True)
THUMBS.mkdir(exist_ok=True)

reader = easyocr.Reader(['en'], gpu=False, download_enabled=False)
document = fitz.open(SOURCE)
manifest = []

for index, page in enumerate(document, 1):
    pix = page.get_pixmap(matrix=fitz.Matrix(1.55, 1.55), alpha=False)
    image = Image.frombytes('RGB', [pix.width, pix.height], pix.samples)
    image.save(PAGES / f'{index:02}.webp', 'WEBP', quality=84, method=5)
    thumb = image.copy()
    thumb.thumbnail((130, 170))
    thumb.save(THUMBS / f'{index:02}.webp', 'WEBP', quality=76)
    rgb = np.asarray(image)
    results = reader.readtext(rgb, detail=1, paragraph=False)
    segments = []
    for points, text, confidence in results:
        text = text.strip()
        if len(text) < 2 or confidence < 0.22:
            continue
        xs = [point[0] for point in points]
        ys = [point[1] for point in points]
        left, top = max(0, min(xs)), max(0, min(ys))
        width, height = max(xs) - min(xs), max(ys) - min(ys)
        segments.append({
            'text': text,
            'x': round(left / pix.width, 5),
            'y': round(top / pix.height, 5),
            'w': round(width / pix.width, 5),
            'h': round(height / pix.height, 5),
        })
    manifest.append({'page': index, 'width': pix.width, 'height': pix.height, 'segments': segments})
    (ROOT / 'pages.json').write_text(json.dumps(manifest, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f'page {index}/{len(document)}: {len(segments)} text regions', flush=True)
