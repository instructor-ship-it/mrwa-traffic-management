# MRWA Traffic Management AI Context System

**Read this file first when starting a new AI session.**

This project contains reference materials for Main Roads Western Australia (MRWA) traffic management, including TGS diagram logic, GIS datasets, and safety alert libraries.

## Quick Navigation

| Topic | File | Description |
|-------|------|-------------|
| MMS Frame Logic | `mms-frame-logic.md` | Rules for Multi-Message Sign layouts on TGS diagrams |
| MRWA GIS Datasets | `mrwa-gis-datasets.md` | REST endpoints for MRWA drainage/road GIS data |
| Banner Alert Workflow | `banner-alert-workflow.md` | How to process and index EQSafe banner alerts |
| TGS Diagrams | `../download/tgs-logic/` | MMS frame logic docs + JSON layout data |

## Key Concepts

### MMS (Multi-Message Sign) Frames
- Modular sign frames holding 1-3 plates stacked vertically
- Used on approach and departure sides of roadworks
- Governed by AGTTM Part 3 and MRWA Traffic Management Planning (TMP)
- Key references: RF-046 (40 km/h worksite), RF-047 (60 km/h worksite)

### Banner Alerts
- EQSafe system workplace safety incident notifications
- Three severity levels: Red (Preliminary/ICAM), Amber, Grey (Final)
- Stored in `upload/{red,amber,grey}/` with index in `upload/banner_alerts_index.json`

### MRWA GIS
- ArcGIS REST services for drainage infrastructure (pipes, pits, sumps, headwalls)
- Road network and culvert data also available
- Base URL: `https://gis-mainroads.wa.gov.au/arcgis/rest/services`

## Current State

- **Banner Alerts**: 7 indexed (4 Red, 3 Grey, 0 Amber)
- **Traffic Control Related**: 3 of 7 alerts
- **MMS Layouts**: RF-046 and RF-047 fully documented
- **GIS Datasets**: 4 core drainage layers + road/culvert layers identified
