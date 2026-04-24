# MRWA Banner Alert Library

Workplace safety incident alerts from Main Roads Western Australia (MRWA) EQSafe system.

## Folder Structure

| Folder | Banner Colour | Meaning |
|--------|--------------|---------|
| `red/` | 🔴 Red Banner | Preliminary Notice — severe/near-miss incident, ICAM investigation commenced |
| `amber/` | 🟡 Amber Banner | Intermediate severity alert |
| `grey/` | ⚪ Grey Banner | Final Notice — moderate incident, investigation complete |

## Index Files

- `banner_alerts_index.json` — Full structured index with all extracted metadata
- `banner_alerts_index.csv` — Flat table index for spreadsheet import

## Traffic Control Related Alerts

3 of 7 alerts in the current collection relate to traffic control:

| EQSafe # | Banner | Description | TC Relation |
|----------|--------|-------------|-------------|
| 57801 | Red | Chain snaps during truck recovery | Road maintenance activity (pothole repair) |
| 57872 | Red | TC shoulder injury on roadside batter | **Direct** — TC deploying traffic management signage |
| 57937 | Red | Truck rollover | TC deployed as incident response |

## Adding New Alerts

1. Save the PDF to the appropriate colour folder (`red/`, `amber/`, or `grey/`)
2. Run the processing script: `python3 scripts/process_banner_alerts.py`
3. The index files will be automatically updated

## Source

Alerts are sourced from the MRWA EQSafe system and distributed under Main Roads' safety communication protocols.
