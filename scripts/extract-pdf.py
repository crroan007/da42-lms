"""
Extract content from Embry-Riddle DA42 Multi-Engine Training PDF
and create structured JSON files for each module.
"""
import json
import os
import re
import sys
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = "D:/Homebrew Apps/DA42 LMS/Embry Riddle DA42.pdf"
OUTPUT_DIR = "D:/Homebrew Apps/DA42 LMS/content/modules"

# Module definitions: (slug, title, start_page_idx, end_page_idx_inclusive, orderIndex)
# PDF has 6 front-matter pages (idx 0-5), so content page 1 = idx 6
MODULES = [
    ("01-introduction", "Introduction to Multi-Engine Aircraft", 6, 6, 1),
    ("02-v-speeds", "V-Speeds", 7, 8, 2),
    ("03-performance-and-limitations", "Performance and Limitations", 9, 10, 3),
    ("04-multi-engine-aerodynamics", "Multi-Engine Aerodynamics", 11, 13, 4),
    ("05-engine-failures", "Engine Failures", 14, 20, 5),
    ("06-vmc", "VMC", 21, 40, 6),
    ("07-da42-vi-systems-overview", "DA42-VI Systems Overview", 42, 43, 7),
    ("08-limitations", "Limitations", 44, 47, 8),
    ("09-airframe", "Airframe", 48, 52, 9),
    ("10-flight-controls", "Flight Controls", 53, 67, 10),
    ("11-landing-gear", "Landing Gear", 68, 90, 11),
    ("12-brakes", "Brakes", 91, 92, 12),
    ("13-environmental-systems", "Environmental Systems", 93, 99, 13),
    ("14-powerplant", "Powerplant", 100, 115, 14),
    ("15-fuel-system", "Fuel System", 116, 120, 15),
    ("16-propeller", "Propeller", 121, 122, 16),
    ("17-electrical-system", "Electrical System", 123, 123, 17),
    ("18-pitot-static-and-stall-warning", "Pitot-Static and Stall Warning", 124, 124, 18),
    ("19-autopilot", "Autopilot", 125, 127, 19),
    ("20-flight-director-and-esp", "Flight Director and ESP", 128, 129, 20),
]

DESCRIPTIONS = {
    1: "Overview of multi-engine aircraft characteristics and differences from single-engine operations.",
    2: "V-speeds specific to multi-engine operations including VMC, VYSE, VXSE, and VSSE.",
    3: "Accelerate-stop and accelerate-go distances, and single-engine climb performance requirements.",
    4: "Induced flow, P-factor, accelerated slipstream, and asymmetric thrust effects.",
    5: "What happens when an engine fails: yaw, roll, drag effects, and the critical engine concept.",
    6: "Minimum controllable airspeed (VMC), factors affecting VMC, and demonstration procedures.",
    7: "DA42-VI dimensions, V-speeds reference, and general aircraft specifications.",
    8: "Operating limitations including V-speeds, weight limits, CG limits, and engine limitations.",
    9: "Carbon fiber and glass fiber airframe construction, fuselage, wings, and empennage.",
    10: "Primary and secondary flight controls including ailerons, elevator, rudder, trim, and flaps.",
    11: "Retractable tricycle landing gear system, hydraulic operation, indicators, and emergency extension.",
    12: "Hydraulic brake system with disk brakes, toe-brake operation, and parking brake.",
    13: "Cabin heating, defrost, and the Recirculating Air Cabin Cooling (RACC) system.",
    14: "Austro AE300 turbocharged diesel engines, ECU, power management, and cooling systems.",
    15: "Fuel tanks, fuel transfer, common rail injection system, and fuel system operation.",
    16: "MT constant-speed feathering propeller, governor operation, and unfeathering accumulator.",
    17: "28V DC dual-generator electrical system, buses, and circuit protection.",
    18: "Pitot-static system and electrically-powered stall warning system.",
    19: "Three-axis autopilot integrated with the Garmin G1000, modes, and operation.",
    20: "Flight Director pitch and roll guidance, and Electronic Stability and Protection (ESP) system.",
}


def estimate_minutes(num_pages):
    return max(5, num_pages * 3)


def clean_page_text(text):
    """Clean a single page's extracted text."""
    if not text:
        return ""

    lines = text.split("\n")
    cleaned = []

    for line in lines:
        stripped = line.strip()

        # Remove the standard header
        if stripped == "ERAU Multi-Engine Airplane Guide":
            continue

        # Remove standalone page numbers at end of page
        if re.match(r"^\d{1,3}$", stripped):
            continue

        # Remove Roman numeral page numbers
        if re.match(r"^[ivxlc]+$", stripped, re.IGNORECASE) and len(stripped) <= 4:
            continue

        # Skip blank-page markers
        if "page intentionally left blank" in stripped.lower():
            continue

        cleaned.append(stripped)

    return "\n".join(cleaned)


def clean_unicode(text):
    """Fix unicode and OCR artifacts."""
    replacements = {
        "\u2212": "-",
        "\u2013": "-",
        "\u2014": " - ",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2026": "...",
        "\u00b0": " degrees ",
        "\u00a9": "(c)",
        "\ufb01": "fi",
        "\ufb02": "fl",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def is_section_header(line, module_title):
    """
    Determine if a line is a genuine section/subsection header.
    Real headers in this PDF are ALL-CAPS, standalone lines that name a topic.
    They are NOT:
    - Sentence fragments that happen to be uppercase
    - Single words or abbreviations
    - Bullet points or numbered items
    - The module title itself repeated
    """
    stripped = line.strip()
    if not stripped:
        return False

    # Must be all uppercase
    if stripped != stripped.upper():
        return False

    # Must have at least some alphabetic characters
    alpha_chars = sum(1 for c in stripped if c.isalpha())
    if alpha_chars < 4:
        return False

    # Skip if it starts with bullet/number markers
    if re.match(r"^[\d]+\.", stripped):
        return False
    if stripped.startswith(("- ", "* ", "• ")):
        return False

    # Skip if it's the module title
    if stripped == module_title.upper():
        return False

    # Must have at least 2 words (with some exceptions for known single-word headers)
    words = stripped.split()
    known_single_headers = {"BRAKES", "AIRFRAME", "POWERPLANT", "PROPELLER", "AUTOPILOT",
                            "ENVIRONMENTAL", "DIMENSIONS", "LIMITATIONS", "YAW", "ROLL"}
    if len(words) < 2 and stripped not in known_single_headers:
        return False

    # Must be relatively short (headers aren't usually super long)
    if len(stripped) > 80:
        return False

    # Should not end with common sentence-ending patterns that indicate it's a wrapped line
    if stripped.endswith((",", ".", ":", ";", "AND", "OR", "THE", "A", "TO", "OF", "IN", "FOR", "WITH", "IS", "ARE", "BY", "AT", "ON", "AN")):
        return False

    # Should not start with common continuation words
    if stripped.startswith(("AND ", "OR ", "THE ", "TO ", "OF ", "IN ", "FOR ", "WITH ", "IS ", "ARE ", "BY ", "AT ", "IF ")):
        return False

    return True


def detect_figure_lines(text):
    """Mark lines that appear to be figure/diagram captions."""
    lines = text.split("\n")
    result = []
    for line in lines:
        stripped = line.strip()
        # Check for diagram/figure references
        if re.match(r"(?i)^(diagram of .+)", stripped):
            result.append(f"[FIGURE: {stripped}]")
        elif re.match(r"(?i)^(figure \d+)", stripped):
            result.append(f"[FIGURE: {stripped}]")
        elif re.match(r"(?i)^.+ diagram$", stripped) and len(stripped) < 60:
            result.append(f"[FIGURE: {stripped}]")
        else:
            result.append(line)
    return "\n".join(result)


def build_subsections(pages_text, module_title):
    """
    Build subsections from the combined text of all pages in a module.
    Strategy: Scan for ALL-CAPS header lines that represent genuine topic headings.
    Everything between two headers becomes one subsection.
    """
    # Combine all page texts
    full_text = "\n\n".join(pages_text)
    full_text = clean_unicode(full_text)
    full_text = detect_figure_lines(full_text)

    lines = full_text.split("\n")

    # Find header positions
    headers = []  # (line_index, title)
    for i, line in enumerate(lines):
        if is_section_header(line, module_title):
            headers.append((i, line.strip().title()))

    # If no headers found, return everything as one subsection
    if not headers:
        content = full_text.strip()
        # Collapse excessive blank lines
        content = re.sub(r"\n{3,}", "\n\n", content)
        return [{"title": module_title, "content": content}]

    subsections = []

    # Content before first header (if any)
    if headers[0][0] > 0:
        pre_content = "\n".join(lines[:headers[0][0]]).strip()
        pre_content = re.sub(r"\n{3,}", "\n\n", pre_content)
        if pre_content and len(pre_content) > 20:
            subsections.append({"title": module_title, "content": pre_content})

    # Content for each header section
    for idx, (line_idx, title) in enumerate(headers):
        # Content runs from this header to the next header (or end)
        start = line_idx + 1
        end = headers[idx + 1][0] if idx + 1 < len(headers) else len(lines)
        content = "\n".join(lines[start:end]).strip()
        content = re.sub(r"\n{3,}", "\n\n", content)

        if content:
            subsections.append({"title": title, "content": content})
        else:
            # Header with no content - merge with previous or next
            subsections.append({"title": title, "content": f"See {title} section in the PDF."})

    # Merge very small subsections (less than 50 chars) into the previous one
    merged = []
    for sub in subsections:
        if merged and len(sub["content"]) < 50 and not sub["content"].startswith("[FIGURE"):
            merged[-1]["content"] += "\n\n" + sub["title"].upper() + "\n" + sub["content"]
        else:
            merged.append(sub)

    return merged if merged else [{"title": module_title, "content": full_text.strip()}]


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"Opening PDF: {PDF_PATH}")
    pdf = pdfplumber.open(PDF_PATH)
    total_pages = len(pdf.pages)
    print(f"Total pages in PDF: {total_pages}")

    index_modules = []

    for slug, title, start_idx, end_idx, order in MODULES:
        print(f"\nProcessing Module {order}: {title} (pages idx {start_idx}-{end_idx})")

        # Extract and clean text from each page
        page_texts = []
        for page_idx in range(start_idx, min(end_idx + 1, total_pages)):
            raw = pdf.pages[page_idx].extract_text() or ""
            cleaned = clean_page_text(raw)
            if cleaned.strip():
                page_texts.append(cleaned)

        if not page_texts:
            print(f"  WARNING: No text extracted for module {order}")
            page_texts = [f"Content for {title} - refer to the PDF."]

        # Build subsections
        subsections = build_subsections(page_texts, title)

        # Calculate page range
        pdf_start = start_idx - 5
        pdf_end = end_idx - 5
        num_pages = end_idx - start_idx + 1

        # Add page range to subsections
        subsection_data = []
        for sub in subsections:
            subsection_data.append({
                "title": sub["title"],
                "content": sub["content"],
                "pageRange": f"{pdf_start}-{pdf_end}"
            })

        description = DESCRIPTIONS.get(order, f"Content covering {title}.")

        module_data = {
            "slug": slug,
            "title": title,
            "orderIndex": order,
            "description": description,
            "estimatedMinutes": estimate_minutes(num_pages),
            "subsections": subsection_data
        }

        output_path = os.path.join(OUTPUT_DIR, f"{slug}.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(module_data, f, indent=2, ensure_ascii=False)
        print(f"  Written: {output_path} ({len(subsection_data)} subsections, {num_pages} pages)")

        index_modules.append({
            "slug": slug,
            "title": title,
            "orderIndex": order,
            "estimatedMinutes": estimate_minutes(num_pages),
            "pageCount": num_pages
        })

    # Write index.json
    index_data = {
        "totalModules": len(index_modules),
        "modules": index_modules
    }
    index_path = os.path.join(OUTPUT_DIR, "index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index_data, f, indent=2, ensure_ascii=False)
    print(f"\nWritten index: {index_path}")

    pdf.close()
    print("\nExtraction complete!")


if __name__ == "__main__":
    main()
