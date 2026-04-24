# MRWA GIS Dataset Reference

## Base URL
`https://gis-mainroads.wa.gov.au/arcgis/rest/services`

## Core Drainage Layers

| Layer | Service | Endpoint |
|-------|---------|----------|
| Pipes | MRWA_Drainage | `/MRWA_Drainage/MapServer/0` |
| Pits | MRWA_Drainage | `/MRWA_Drainage/MapServer/1` |
| Sumps | MRWA_Drainage | `/MRWA_Drainage/MapServer/2` |
| Headwalls | MRWA_Drainage | `/MRWA_Drainage/MapServer/3` |

## Related Layers

| Layer | Service | Description |
|-------|---------|-------------|
| Culverts | MRWA_Road_Network | Culvert structures under roads |
| Floodways | MRWA_Drainage | Floodway crossing points |
| Kerb Lines | MRWA_Road_Network | Kerb and channel data |

## Query Format
```
{base_url}/{service}/MapServer/{layer_id}/query?
  where=1%3D1
  &outFields=*
  &f=json
  &resultRecordCount=10
```

## Useful Fields
- Drainage pipes: PIPE_TYPE, DIAMETER, MATERIAL, UPSTREAM_IL, DOWNSTREAM_IL
- Pits: PIT_TYPE, PIT_DEPTH, COVER_LEVEL
- Road network: ROAD_NUMBER, ROAD_NAME, HECTAREAGE

## Notes
- Some layers require authentication for full attribute access
- Default result limit is 1000 records; use `resultRecordCount` for pagination
- Spatial queries support `geometry`, `geometryType`, and `spatialRel` parameters
