#!/usr/bin/env python3
"""
MRWA Banner Alert PDF Processor
Processes banner alert PDFs from the upload/ directory, extracts metadata,
organises them into colour-coded folders, and updates the index.

Usage:
    python3 process_banner_alerts.py              # Process all unsorted PDFs
    python3 process_banner_alerts.py --reindex    # Re-index all PDFs from scratch
    python3 process_banner_alerts.py --add <pdf>  # Add a specific PDF

Requirements: pip install pdfplumber
"""

import os
import sys
import json
import csv
import shutil
import re
from datetime import datetime

try:
    import pdfplumber
except ImportError:
    print("ERROR: pdfplumber is required. Install with: pip install pdfplumber")
    sys.exit(1)

# --- Configuration ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "upload")
INDEX_JSON = os.path.join(UPLOAD_DIR, "banner_alerts_index.json")
INDEX_CSV = os.path.join(UPLOAD_DIR, "banner_alerts_index.csv")

COLOUR_DIRS = {
    "red": os.path.join(UPLOAD_DIR, "red"),
    "amber": os.path.join(UPLOAD_DIR, "amber"),
    "grey": os.path.join(UPLOAD_DIR, "grey"),
}

TC_KEYWORDS = [
    "traffic controller", "traffic control", "traffic management",
    " TC ", "TC sustained", "TC was", "signage setup",
    "bat man", "stop/slow", "prepare to stop"
]


def ensure_dirs():
    """Create colour-coded directories if they don't exist."""
    for d in COLOUR_DIRS.values():
        os.makedirs(d, exist_ok=True)


def classify_banner(filename):
    """Determine banner colour from filename."""
    fn_lower = filename.lower()
    if "red banner" in fn_lower:
        return "red"
    elif "amber banner" in fn_lower:
        return "amber"
    elif "grey banner" in fn_lower:
        return "grey"
    return None


def classify_banner_from_text(text):
    """Determine banner colour/type from PDF content."""
    text_lower = text.lower()
    if "preliminary notice" in text_lower:
        return "red"
    elif "final notice" in text_lower:
        return "grey"
    return None


def extract_metadata(pdf_path, filename):
    """Extract all metadata from a banner alert PDF."""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    text += t + "\n"
    except Exception as e:
        print(f"  WARNING: Could not read {filename}: {e}")
        return None

    alert = {
        "banner_colour": classify_banner(filename) or classify_banner_from_text(text) or "unknown",
        "banner_type": "",
        "eqsafe_number": "",
        "date_of_incident": "",
        "time_of_incident": "",
        "directorate_region": "",
        "main_roads_or_contractor": "",
        "eqsafe_event_type": "",
        "actual_consequence": "",
        "potential_consequence": "",
        "incident_short_description": "",
        "executive_summary": "",
        "contributing_factors": [],
        "corrective_actions": [],
        "icam_investigation": False,
        "traffic_control_related": False,
        "traffic_control_notes": "",
        "critical_risk_profile": "",
        "filename": filename,
        "filepath": "",
        "file_size_bytes": os.path.getsize(pdf_path) if os.path.exists(pdf_path) else 0,
        "indexed_at": datetime.now().isoformat()
    }

    # Banner type
    if "Preliminary Notice" in filename or "Preliminary Notice" in text:
        alert["banner_type"] = "Preliminary Notice"
    elif "Final Notice" in filename or "Final Notice" in text:
        alert["banner_type"] = "Final Notice"

    # EQSafe number - try regex on text
    eqsafe_match = re.search(r'EQSafe\s*(?:Incident\s*)?Number\s*(\d{5})', text)
    if eqsafe_match:
        alert["eqsafe_number"] = eqsafe_match.group(1)
    else:
        # Try from filename
        fn_match = re.search(r'(\d{5})', filename)
        if fn_match:
            alert["eqsafe_number"] = fn_match.group(1)

    # Date of incident
    date_match = re.search(r'Date of Incident\s+(.+?)(?:\s+Time|$)', text)
    if date_match:
        alert["date_of_incident"] = date_match.group(1).strip()

    # Time of incident
    time_match = re.search(r'Time of Incident\s+(.+?)(?:\s+\n|\s+[A-Z])', text)
    if time_match:
        alert["time_of_incident"] = time_match.group(1).strip()

    # Event type
    event_match = re.search(r'EQSafe Event Type\s+(.+?)(?:\s+EQSafe|\s*$)', text)
    if event_match:
        alert["eqsafe_event_type"] = event_match.group(1).strip()

    # Consequences
    actual_match = re.search(r'Actual Consequence\s+(.+?)(?:\s+Potential)', text)
    if actual_match:
        alert["actual_consequence"] = actual_match.group(1).strip()
    potential_match = re.search(r'Potential Consequence\s+(.+?)(?:\s+Incident|\s*\n)', text)
    if potential_match:
        alert["potential_consequence"] = potential_match.group(1).strip()

    # Short description from filename
    parts = filename.replace(".pdf", "").split(" - ")
    if len(parts) >= 4:
        desc_parts = parts[3:-1]
        alert["incident_short_description"] = " - ".join(desc_parts).strip()

    # Executive summary
    exec_match = re.search(r'Executive Summary\s*\n(.+?)(?:Contributing Factors|Corrective Actions|Incident Photos|D26#|What Happened)', text, re.DOTALL)
    if exec_match:
        alert["executive_summary"] = " ".join(exec_match.group(1).split()).strip()

    # Contributing factors
    factors_match = re.search(r'Contributing Factors\s*\n(.+?)(?:Corrective Actions|Incident Photos|D26#)', text, re.DOTALL)
    if factors_match:
        factors_text = factors_match.group(1)
        factors = [f.strip().lstrip("•-* ") for f in factors_text.split("\n") if f.strip().startswith(("•", "-", "*"))]
        alert["contributing_factors"] = [f for f in factors if f]

    # Corrective actions
    actions_match = re.search(r'Corrective Actions\s*\n(.+?)(?:D26#|Distribution|A formal ICAM)', text, re.DOTALL)
    if actions_match:
        actions_text = actions_match.group(1)
        actions = [a.strip().lstrip("•-* ") for a in actions_text.split("\n") if a.strip().startswith(("•", "-", "*"))]
        alert["corrective_actions"] = [a for a in actions if a]

    # ICAM investigation
    alert["icam_investigation"] = bool(re.search(r'ICAM', text))

    # Traffic control related
    text_lower = text.lower()
    alert["traffic_control_related"] = any(kw.lower() in text_lower for kw in TC_KEYWORDS)
    
    if alert["traffic_control_related"]:
        if "traffic controller" in text_lower or " tc " in text_lower or "tc sustained" in text_lower:
            alert["traffic_control_notes"] = "TC directly involved in traffic management activity"
        elif "traffic management" in text_lower or "traffic control" in text_lower:
            alert["traffic_control_notes"] = "Traffic management/control referenced in incident"
        elif "traffic control was established" in text_lower:
            alert["traffic_control_notes"] = "TC deployed as incident response"

    # Critical risk profile
    risk_match = re.search(r'Critical Risk profile relating to\s+(.+?)(?:\s*\n|\s*Distribution)', text)
    if risk_match:
        alert["critical_risk_profile"] = risk_match.group(1).strip()

    # Directorate/Region
    dir_match = re.search(r'Directorate\s*/\s*Region\s+(.+?)(?:\s+Main Roads)', text)
    if dir_match:
        alert["directorate_region"] = dir_match.group(1).strip()

    # Main Roads or Contractor
    if re.search(r'Main Roads or Contractor\s+Main Roads\b', text):
        alert["main_roads_or_contractor"] = "Main Roads"
    elif re.search(r'Main Roads or Contractor\s+Contractor\b', text):
        alert["main_roads_or_contractor"] = "Contractor"

    return alert


def organise_pdf(pdf_path, filename, colour):
    """Move PDF to the correct colour-coded directory."""
    target_dir = COLOUR_DIRS.get(colour)
    if not target_dir:
        print(f"  WARNING: Unknown banner colour '{colour}' for {filename}")
        return pdf_path
    
    target_path = os.path.join(target_dir, filename)
    if pdf_path != target_path:
        shutil.move(pdf_path, target_path)
        print(f"  Moved: {filename} -> {colour}/")
    return target_path


def build_index(alerts):
    """Build JSON and CSV index files from alerts list."""
    alerts.sort(key=lambda x: int(x.get("eqsafe_number", "0")))
    
    # Update filepaths
    for alert in alerts:
        colour = alert["banner_colour"]
        alert["filepath"] = f"upload/{colour}/{alert['filename']}"

    # JSON
    index_data = {
        "_meta": {
            "title": "MRWA Banner Alert Index",
            "version": "2.0.0",
            "generated": datetime.now().isoformat(),
            "description": "Index of all MRWA EQSafe Banner Alert PDFs with extracted metadata",
            "total_alerts": len(alerts),
            "red_count": len([a for a in alerts if a["banner_colour"] == "red"]),
            "grey_count": len([a for a in alerts if a["banner_colour"] == "grey"]),
            "amber_count": len([a for a in alerts if a["banner_colour"] == "amber"]),
            "traffic_control_related_count": len([a for a in alerts if a["traffic_control_related"]]),
            "icam_investigation_count": len([a for a in alerts if a["icam_investigation"]]),
            "folder_structure": {
                "red/": "Red Banner - Preliminary Notice (severe/near-miss, ICAM investigation started)",
                "amber/": "Amber Banner - (intermediate severity)",
                "grey/": "Grey Banner - Final Notice (moderate, investigation complete)"
            }
        },
        "alerts": alerts
    }

    with open(INDEX_JSON, "w") as f:
        json.dump(index_data, f, indent=2)
    print(f"\nJSON index: {INDEX_JSON}")

    # CSV
    csv_fields = [
        "eqsafe_number", "banner_colour", "banner_type", "date_of_incident",
        "time_of_incident", "directorate_region", "main_roads_or_contractor",
        "eqsafe_event_type", "actual_consequence", "potential_consequence",
        "incident_short_description", "traffic_control_related", "traffic_control_notes",
        "icam_investigation", "critical_risk_profile", "filepath"
    ]
    with open(INDEX_CSV, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=csv_fields, extrasaction="ignore")
        writer.writeheader()
        for alert in alerts:
            row = {k: alert.get(k, "") for k in csv_fields}
            row["traffic_control_related"] = "Yes" if alert["traffic_control_related"] else "No"
            row["icam_investigation"] = "Yes" if alert["icam_investigation"] else "No"
            writer.writerow(row)
    print(f"CSV index:  {INDEX_CSV}")


def scan_for_pdfs(directory):
    """Find all PDFs in a directory (non-recursive)."""
    pdfs = []
    for f in os.listdir(directory):
        if f.lower().endswith(".pdf"):
            pdfs.append(os.path.join(directory, f))
    return pdfs


def scan_all_pdfs():
    """Find all PDFs in the colour-coded subdirectories."""
    pdfs = []
    for colour, dir_path in COLOUR_DIRS.items():
        if os.path.isdir(dir_path):
            for f in os.listdir(dir_path):
                if f.lower().endswith(".pdf"):
                    pdfs.append(os.path.join(dir_path, f))
    return pdfs


def main():
    ensure_dirs()

    reindex = "--reindex" in sys.argv
    add_file = None
    if "--add" in sys.argv:
        idx = sys.argv.index("--add")
        if idx + 1 < len(sys.argv):
            add_file = sys.argv[idx + 1]

    if add_file:
        # Add a specific PDF
        if not os.path.exists(add_file):
            print(f"ERROR: File not found: {add_file}")
            sys.exit(1)
        filename = os.path.basename(add_file)
        print(f"Processing: {filename}")
        alert = extract_metadata(add_file, filename)
        if alert:
            target_path = organise_pdf(add_file, filename, alert["banner_colour"])
            alert["filepath"] = f"upload/{alert['banner_colour']}/{filename}"
            # Load existing index, add, save
            existing = []
            if os.path.exists(INDEX_JSON):
                with open(INDEX_JSON) as f:
                    data = json.load(f)
                    existing = data.get("alerts", [])
            # Remove duplicate by EQSafe number
            existing = [a for a in existing if a.get("eqsafe_number") != alert["eqsafe_number"]]
            existing.append(alert)
            build_index(existing)
        return

    if reindex:
        # Re-index everything from scratch
        print("Re-indexing all PDFs from colour-coded directories...")
        alerts = []
        for colour, dir_path in COLOUR_DIRS.items():
            if not os.path.isdir(dir_path):
                continue
            for filename in sorted(os.listdir(dir_path)):
                if not filename.lower().endswith(".pdf"):
                    continue
                fpath = os.path.join(dir_path, filename)
                print(f"  Processing: {filename}")
                alert = extract_metadata(fpath, filename)
                if alert:
                    alerts.append(alert)
        build_index(alerts)
        print(f"\nTotal alerts indexed: {len(alerts)}")
        return

    # Default: process unsorted PDFs in upload root
    unsorted = scan_for_pdfs(UPLOAD_DIR)
    if not unsorted:
        print("No unsorted PDFs found in upload/. Use --reindex to rebuild the index.")
        return

    print(f"Found {len(unsorted)} unsorted PDF(s) in upload/")
    alerts = []
    
    # Load existing index
    existing = []
    if os.path.exists(INDEX_JSON):
        with open(INDEX_JSON) as f:
            data = json.load(f)
            existing = data.get("alerts", [])

    for pdf_path in unsorted:
        filename = os.path.basename(pdf_path)
        print(f"  Processing: {filename}")
        alert = extract_metadata(pdf_path, filename)
        if alert:
            target_path = organise_pdf(pdf_path, filename, alert["banner_colour"])
            alert["filepath"] = f"upload/{alert['banner_colour']}/{filename}"
            alerts.append(alert)
            # Remove duplicate from existing
            existing = [a for a in existing if a.get("eqsafe_number") != alert["eqsafe_number"]]

    existing.extend(alerts)
    build_index(existing)
    print(f"\nProcessed {len(alerts)} new alert(s). Total indexed: {len(existing)}")


if __name__ == "__main__":
    main()
