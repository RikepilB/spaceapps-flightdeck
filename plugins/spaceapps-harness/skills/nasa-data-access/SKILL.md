---
name: nasa-data-access
description: >
  This skill should be used when the user needs actual NASA or partner-agency data -
  "how do I get NASA data", "Earthdata login", "which dataset for X", "download
  satellite imagery", "exoplanet dataset", "air quality data", "precipitation data",
  "NASA API key", "earthaccess", "OPeNDAP", "GIBS", "AppEEARS", "Giovanni", "CMR" -
  or is building anything on Earth observation, heliophysics, planetary or space biology
  data.
metadata:
  version: "0.1.0"
---

Read [shared evidence and authority contract](../../SAFETY.md) before applying this role or workflow.


# Getting NASA data, fast

The full catalogue with per-challenge mappings is in `references/data-catalogue.md`.
This file is the decision procedure.

## Do this before the hackathon

1. **Earthdata Login** at `urs.earthdata.nasa.gov`. Free, instant, and required by most
   Earth-science data. Creating it on the day costs an hour you cannot spare.
2. **api.nasa.gov key.** Free, instant. `DEMO_KEY` is throttled to roughly 30 requests
   per hour and will fail mid-demo.
3. `pip install earthaccess xarray netCDF4 h5py rasterio` and confirm the imports work
   on the machine you will actually use.

## Choosing an access path

| You need | Use | Auth |
|---|---|---|
| A picture on screen in five minutes | GIBS / Worldview | none |
| To find which dataset exists at all | Earthdata Search (CMR) | none to search |
| A time series at one point | Giovanni (verify current service availability) | Earthdata Login |
| A spatial subset of a gridded product | AppEEARS or Harmony | Earthdata Login |
| Bulk granules in Python | `earthaccess` | Earthdata Login |
| A slice of a huge file without downloading it | OPeNDAP | Earthdata Login |
| Asteroids, NEOs, APOD, EPIC | api.nasa.gov | API key |
| Exoplanet tables | Exoplanet Archive (CSV) | none |
| Space biology experiments | OSDR | none |
| Orbital debris models | Orbital Debris Program Office | none |

## Check latency before anything else

Ask one question before choosing any dataset: **is this project a forecast, a nowcast, or a
hindcast?** Most NASA science products are calibrated for research, not for real time, and
the research version is often months behind:

| Product family | Real-time version | Research version | Gap |
|---|---|---|---|
| IMERG precipitation | `GPM_3IMERGDE` (Early), `GPM_3IMERGDL` (Late) | `GPM_3IMERGDF` (Final) | hours vs ~3.5 months |
| MODIS / VIIRS imagery | LANCE near-real-time | standard collection | ~3 hours vs days |
| Reanalysis (MERRA-2) | none - it is reanalysis | `M2T1NXSLV` etc. | ~3 weeks behind, always |
| Forecast | GEOS-5 FP forecast (see catalogue) | n/a | ~16 days ahead |

A team that builds an "early warning" tool on a Final Run or a reanalysis ships something
that looks live and is silently months stale. Nothing errors. It is the worst class of bug
because a judge cannot see it and a user would act on it.

## The rule that saves the weekend

**Subset server-side. Never download a full granule you only need a corner of.**
AppEEARS, Harmony, OPeNDAP and Giovanni all do this. A team that downloads whole MODIS
granules to a laptop will spend the hackathon watching a progress bar.

## Minimal working patterns

Earthdata, Python:

```python
import earthaccess  # handles the Earthdata Login token dance

earthaccess.login()  # reads ~/.netrc, or prompts once

results = earthaccess.search_data(
    short_name="GPM_3IMERGDE",      # IMERG *Early* Run - hours behind real time
    #          "GPM_3IMERGDF"        # Final Run - better calibrated, ~3.5 MONTHS behind
    temporal=("2025-01-01", "2025-01-31"),
    bounding_box=(-80, -10, -60, 10),  # W, S, E, N
)
files = earthaccess.open(results)   # lazy file objects, no full download

import xarray as xr
ds = xr.open_mfdataset(files)       # now slice it
```

api.nasa.gov, any language:

```
https://api.nasa.gov/neo/rest/v1/feed?start_date=2026-11-14&api_key=YOUR_KEY
```

GIBS imagery with no auth, straight into a Leaflet or MapLibre layer:

```
https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/
  {LAYER}/default/{TIME}/{TileMatrixSet}/{z}/{y}/{x}.png
```

## Before you trust a dataset

- Read the fill value. `-9999`, `-999` and `32767` are common and are not measurements.
- Read the quality flags. Cloud-masked pixels are not zeros.
- Confirm the units in the metadata rather than inferring them from magnitude.
- Confirm lat/lon ordering and the projection.
- Check whether it is a swath (Level 2) or a grid (Level 3). Mixing them silently is a
  standard source of wrong maps.

## Caching, always

Pull once, write to disk, read from disk everywhere else. A live API call inside a demo
is a dependency on someone else's uptime during the only ten minutes that matter.

## Attribution

Name the specific instrument, mission and product in the submission - "TEMPO
tropospheric NO2, Level 3" rather than "NASA data". Relevance and Validity both reward
specificity, and the challenge's own Resources list tells you which sources the judges
expect to see.

## Verification boundary

Product examples and delays above are historical references, not a live inventory.
Check current documentation, issue time and lead time before use. Near-real-time
observations cannot supply future forecasts. A successful HTML landing page or an
auth redirect is not proof that a data payload can be fetched and parsed.
