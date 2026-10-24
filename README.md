# EFL Phonics 2 Workbook web reader

The 37 scanned pages are presented as WebP images with OCR-assisted clickable English text regions. Selecting a region plays a prerecorded English voice at 0.8× speed through a 1.2× Web Audio gain stage. Corrected text uses browser speech synthesis at 0.8×, for which browsers cap volume at 1.0×.

Open the published GitHub Pages URL. For local testing, run `python -m http.server` in this folder, then open the printed localhost URL. The source scan is not required at runtime. `build_assets.py` regenerates page images and OCR data from the PDF in the parent directory; `build_audio.py` regenerates WAV files on Windows with the installed English SAPI voice.
