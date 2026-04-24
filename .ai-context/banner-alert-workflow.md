# MRWA Banner Alert Processing Workflow

## Overview
Banner alerts are MRWA EQSafe workplace safety incident notifications, colour-coded by severity.

## Banner Types
| Colour | Type | Meaning | ICAM? |
|--------|------|---------|-------|
| 🔴 Red | Preliminary Notice | Severe/near-miss, investigation started | Yes |
| 🟡 Amber | Notice | Intermediate severity | Varies |
| ⚪ Grey | Final Notice | Moderate, investigation complete | No (completed) |

## Processing New Alerts

### Manual Method
1. Save PDF to `upload/` (root)
2. Run: `python3 scripts/process_banner_alerts.py`
3. Script will:
   - Extract metadata from PDF
   - Classify banner colour
   - Move PDF to `upload/{red,amber,grey}/`
   - Update `banner_alerts_index.json` and `banner_alerts_index.csv`

### Adding a Single File
```bash
python3 scripts/process_banner_alerts.py --add /path/to/alert.pdf
```

### Re-indexing Everything
```bash
python3 scripts/process_banner_alerts.py --reindex
```

## Index Files
- `upload/banner_alerts_index.json` — Full structured index with metadata, contributing factors, corrective actions
- `upload/banner_alerts_index.csv` — Flat table for spreadsheet import

## Metadata Extracted
- EQSafe number, date/time, directorate/region
- Event type, actual/potential consequence
- Executive summary, contributing factors, corrective actions
- ICAM investigation status
- Traffic control related flag (keyword matching)
- Critical risk profile

## Traffic Control Keywords
The script flags alerts as traffic-control-related if they contain:
- "traffic controller", "traffic control", "traffic management"
- " TC " (standalone), "TC sustained", "TC was"
- "signage setup", "bat man", "stop/slow", "prepare to stop"

## Current Alerts (7 total)
| EQSafe # | Colour | TC? | Short Description |
|----------|--------|-----|-------------------|
| 56820 | Grey | No | Quick-Cut Saw Strikes Worker in Face |
| 57148 | Grey | No | Shoulder injury resulting in LTI |
| 57539 | Grey | No | Worker tripped over parking bay wheel stop bar |
| 57801 | Red | Yes | Chain snaps during truck recovery (road maintenance) |
| 57872 | Red | Yes | TC shoulder injury on roadside batter (direct) |
| 57935 | Red | No | Worker struck on shin with sledgehammer |
| 57937 | Red | Yes | Truck rollover (TC deployed as response) |
