# MMS Frame Logic — Quick Reference

**Full documentation**: `download/tgs-logic/mms-frame-logic.md`
**Layout data**: `download/tgs-logic/mms-frame-layouts.json`

## Key Rules Summary

1. **Plate count**: 1-3 plates per frame (NEVER more, NEVER blank slots)
2. **Speed step sequence**: Posted → 80 → 60 → 40 (each step = separate frame)
3. **First frame**: 80 | ROAD WORK AHEAD | DRIVE SLOWLY
4. **Subsequent frames**: Speed | Symbolic | REDUCE SPEED
5. **Traffic control frames**: PREPARE TO STOP | BAT MAN | DO NOT OVERTAKE (triple) + STOP HERE WHEN DIRECTED (single)
6. **Departure**: Only on reverse of lowest speed frame — Posted speed | END ROAD WORK | DRIVE SAFELY
7. **Spacing**: ≥100 km/h = 300m first gap; ≥80 km/h = 200m first gap; else D-spacing per Table 2.2
8. **XX AHEAD signs**: Only required on posted ≥100 km/h

## Frame Templates

### RF-046 (40 km/h worksite, <1.2m)
F1(80) → F2(60) → F3(40,departure) → F4(PREPARE TO STOP) → F5(STOP HERE)

### RF-047 (60 km/h worksite, 1.2-3.0m)
F1(80) → F2(60,departure) → F3(PREPARE TO STOP) → F4(STOP HERE)

## MMS Codes
- REG-1: Speed sign | ADV-11: Road work ahead | ADV-28: Reduce speed
- ADV-47: Bat man/traffic controller | ADV-82: Prepare to stop
- TER-1: End road work | TER-4: End speed zone

## Common Mistakes
- Don't split "ROAD WORK AHEAD" into two plates
- Don't put departure messaging on multiple frames
- Don't leave blank plate slots
- Advisory "XX AHEAD" comes BEFORE regulatory speed sign
