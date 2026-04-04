# DA42 LMS — Content Pipeline

## Source Document

- **File**: `Embry Riddle DA42.pdf`
- **Pages**: 131 (6 front matter + 124 content + 1 blank)
- **Author**: Robert L. Thomas & ERAU Aviation Learning Center
- **Copyright**: 2017 Embry-Riddle Aeronautical University

## Extraction Process

**Script**: `scripts/extract-pdf.py`
**Tool**: pdfplumber (Python)
**Command**: `python scripts/extract-pdf.py`

The script:
1. Opens the PDF with pdfplumber
2. Extracts text from each page
3. Splits into 20 modules based on hardcoded page ranges
4. Cleans text (removes headers, page numbers, fixes unicode)
5. Identifies subsections by text patterns
6. Writes JSON files to `content/modules/`
7. Creates `content/modules/index.json`

## The 20 Modules

| # | Module | Pages | Est. Minutes |
|---|--------|-------|-------------|
| 01 | Introduction to Multi-Engine Aircraft | 1 | 5 |
| 02 | V-Speeds | 2-3 | 6 |
| 03 | Performance and Limitations | 4-5 | 6 |
| 04 | Multi-Engine Aerodynamics | 6-8 | 9 |
| 05 | Engine Failures | 9-15 | 21 |
| 06 | VMC | 16-35 | 60 |
| 07 | DA42-VI Systems Overview | 37-38 | 6 |
| 08 | Limitations | 39-42 | 12 |
| 09 | Airframe | 43-47 | 15 |
| 10 | Flight Controls | 48-66 | 57 |
| 11 | Landing Gear | 67-85 | 57 |
| 12 | Brakes | 86-87 | 6 |
| 13 | Environmental Systems | 88-94 | 21 |
| 14 | Powerplant | 95-109 | 48 |
| 15 | Fuel System | 111-115 | 15 |
| 16 | Propeller | 116-117 | 6 |
| 17 | Electrical System | 118 | 5 |
| 18 | Pitot-Static & Stall Warning | 119 | 5 |
| 19 | Autopilot | 120-123 | 12 |
| 20 | Flight Director & ESP | 123-124 | 6 |

## Text Cleaning Applied

- Removed "ERAU Multi-Engine Airplane Guide" header from every page
- Removed standalone page numbers
- Removed "(This page intentionally left blank)" markers
- Fixed unicode: smart quotes → straight, em dashes → hyphens, degree symbols
- Collapsed excessive blank lines
- Marked diagram locations with `[FIGURE: description]` placeholders

## Known Issues

- Some pages have OCR-quality text where characters are jumbled (text wraps around figures in the original PDF)
- Subsection detection is heuristic — some subsections may be merged or split incorrectly
- All figures are text-only placeholders; actual images are not extracted
- Page ranges in subsections are approximate (module-level, not subsection-level)

## Re-extraction

If the PDF is updated:
```bash
python scripts/extract-pdf.py
```
This regenerates all 20 JSON files and index.json. Review output for quality.
