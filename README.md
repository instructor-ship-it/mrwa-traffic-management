# MRWA Traffic Management Reference Library

A structured collection of Main Roads Western Australia (MRWA) traffic management references, including TGS diagram logic, GIS datasets, and EQSafe banner alert incident library.

## Repository Structure

```
.
├── .ai-context/                  # AI session context files (read START_HERE.md first)
│   ├── START_HERE.md             # Master context — read this first in new sessions
│   ├── mms-frame-logic.md        # MMS frame logic quick reference
│   ├── mrwa-gis-datasets.md      # MRWA GIS REST endpoints reference
│   └── banner-alert-workflow.md  # How to process/index banner alert PDFs
├── download/
│   └── tgs-logic/                # TGS/MMS frame logic documentation
│       ├── mms-frame-logic.md    # Full MMS frame logic rules (14 sections)
│       └── mms-frame-layouts.json # Machine-readable layout data (RF-046, RF-047)
├── scripts/
│   └── process_banner_alerts.py  # PDF processing & indexing script
└── upload/                       # Banner alert PDFs
    ├── red/                      # 🔴 Red Banner — Preliminary Notice (severe)
    ├── amber/                    # 🟡 Amber Banner — (intermediate)
    ├── grey/                     # ⚪ Grey Banner — Final Notice (moderate)
    ├── banner_alerts_index.json  # Full structured index
    ├── banner_alerts_index.csv   # Flat table index
    └── README.md                 # Alert library documentation
```

## Key Topics

### Multi-Message Sign (MMS) Frames
Rules for laying out modular sign frames on TGS (Traffic Guidance Scheme) diagrams, based on AGTTM Part 3 and MRWA TMP. Covers plate composition, speed reduction sequences, traffic control frames, departure messaging, and sign spacing.

### Banner Alerts (EQSafe)
Workplace safety incident notifications from MRWA's EQSafe system. Colour-coded by severity:
- **Red** — Preliminary Notice: severe incidents and near-misses with ICAM investigation
- **Grey** — Final Notice: moderate incidents with investigation completed
- **Amber** — Intermediate severity

### MRWA GIS
ArcGIS REST endpoints for drainage infrastructure (pipes, pits, sumps, headwalls) and road network data.

## Quick Start

1. New AI session? Read `.ai-context/START_HERE.md`
2. Working with TGS diagrams? Read `download/tgs-logic/mms-frame-logic.md`
3. Adding banner alerts? Place PDFs in `upload/` and run `python3 scripts/process_banner_alerts.py`
4. Querying GIS data? See `.ai-context/mrwa-gis-datasets.md`

## Traffic Control Related Alerts

3 of 7 current alerts directly relate to traffic control operations:

| EQSafe # | Severity | Description | TC Relation |
|----------|----------|-------------|-------------|
| 57801 | Red | Chain snaps during truck recovery | Road maintenance activity |
| 57872 | Red | TC shoulder injury on roadside batter | **Direct** — TC deploying signage |
| 57937 | Red | Truck rollover | TC deployed as incident response |
