# NASA and partner data catalogue

Harvested from the curated Resources lists NASA attached to the 2025 challenges, plus
the general-purpose portals. When a challenge publishes its own Resources tab, that list
takes priority - those are the sources judges expect to see used.

## Tier 0 - the entry points

| Resource | URL | Auth | What it is |
|---|---|---|---|
| Earthdata Login | https://urs.earthdata.nasa.gov/ | account | The credential nearly everything else needs |
| Earthdata Search | https://search.earthdata.nasa.gov/ | none to search | Catalogue over every NASA Earth-science collection (CMR) |
| NASA Open Data Portal | https://data.nasa.gov/ | none | General dataset repository across all directorates |
| api.nasa.gov | https://api.nasa.gov/ | free key | One key, many APIs: NEO, APOD, EPIC, Earth imagery |
| Worldview | https://worldview.earthdata.nasa.gov/ | none | Interactive near-real-time imagery browser |
| GIBS | https://earthdata.nasa.gov/gibs | none | The tile service behind Worldview. WMTS/WMS, drop straight into a map |
| Earth Observatory | https://earthobservatory.nasa.gov/ | none | Captioned imagery and animations, good for narrative projects |
| Earth.gov | https://earth.gov/ | none | Earth Information Center |
| Scientific Visualization Studio | https://svs.gsfc.nasa.gov/ | none | Broadcast-quality animations, free to use with credit |
| NASA Image and Video Library | https://images.nasa.gov/ | none | Media assets |

## Tier 1 - tools that subset for you

| Tool | URL | Use it for |
|---|---|---|
| Giovanni | https://giovanni.gsfc.nasa.gov/giovanni/ | Time series, maps and comparisons without writing code |
| AppEEARS | https://appeears.earthdatacloud.nasa.gov/ | Point and area extraction from many products; has a REST API |
| Harmony | https://harmony.earthdata.nasa.gov/ | Server-side transformation and subsetting; `harmony-py` client |
| OPeNDAP | https://opendap.earthdata.nasa.gov/ | Read a slice of a remote file without downloading it |
| earthaccess | https://github.com/nsidc/earthaccess | Python: auth, search and open in three calls |
| Earthdata GIS | https://gis.earthdata.nasa.gov/ | OGC services for GIS stacks |
| Earthdata Cloud Cookbook | https://nasa-openscapes.github.io/earthdata-cloud-cookbook/ | Worked notebooks for all of the above |
| LANCE near-real-time | https://www.earthdata.nasa.gov/learn/find-data/near-real-time | Data within ~3 hours of observation |

## By domain

### Exoplanets and astronomy
- Kepler Objects of Interest (KOI) - `exoplanetarchive.ipac.caltech.edu` table `cumulative`. Labelled: confirmed / candidate / false positive. Classification column: "Disposition Using Kepler Data". Plain CSV, no auth.
- TESS Objects of Interest (TOI) - same archive, config `TOI`. Classification column: "TFOWPG Disposition".
- K2 Planets and Candidates - same archive, config `k2pandc`. Column: "Archive Disposition".
- TESS data products - https://heasarc.gsfc.nasa.gov/docs/tess/data-products.html
- NEOSSat astronomy data (CSA) - https://donnees-data.asc-csa.gc.ca/en/dataset/9ae3e718-8b6d-40b7-8aa4-858f00e84b30

Leakage warning: several columns in KOI/TOI encode the disposition or are computed from
it. Drop identifier and post-hoc columns before training or the accuracy is fiction.

### Asteroids, impacts, orbits
- NEO Web Service - via api.nasa.gov
- JPL Small-Body Database query tool - https://ssd.jpl.nasa.gov/tools/sbdb_query.html
- Approximate positions of the planets - https://ssd.jpl.nasa.gov/planets/approx_pos.html
- Near-Earth Comets orbital elements API - https://data.nasa.gov/dataset/near-earth-comets-orbital-elements-api
- Eyes on Asteroids - https://eyes.nasa.gov/apps/asteroids/
- USGS earthquake catalog - https://earthquake.usgs.gov/earthquakes/search/
- USGS National Map elevation - https://www.usgs.gov/programs/national-geospatial-program/national-map

### Forecast data (no authentication)

The catalogue below is dominated by observation and reanalysis products. If the project
needs to predict rather than describe, start here instead.

- **GEOS-5 Forward Processing forecast**, NASA GMAO via the NCCS GrADS/OPeNDAP server.
  Verified open, no Earthdata Login, no key.
  - Single-level: `https://opendap.nccs.nasa.gov/dods/GEOS-5/fp/0.25_deg/fcast/tavg1_2d_slv_Nx.latest`
    carries `t2m` (2 m air temperature), `qv2m` (2 m specific humidity), `ps`, `slp`,
    `u10m`, `v10m` and ~38 more.
  - Land surface: `.../fcast/tavg1_2d_lnd_Nx.latest` carries `gwettop` soil wetness,
    `tsoil1`, `prectot`.
  - 0.25 degree, hourly, roughly 16 days ahead. Open with `xarray.open_dataset(url)` and
    subset server-side with `.sel()` before `.load()`.
  - Gotchas: variable names are lowercase on the GrADS server; a trailing slash on a
    directory URL returns a GrADS error, not a 404; and 0.25 degree orography does not
    resolve mountain valleys, so any mountain application needs an elevation correction
    against a DEM.
  - `.../0.25_deg/assim` is the analysis (nowcast) equivalent.

### Weather, precipitation, atmosphere
- IMERG (GPM precipitation) - https://gpm.nasa.gov/gpm/imerg-global-image
  - `GPM_3IMERGDE` Early Run, hours behind. Use for anything real time.
  - `GPM_3IMERGDL` Late Run.
  - `GPM_3IMERGDF` Final Run, best calibrated, roughly 3.5 months behind. Research only.
  - Known weak over high, cold, complex terrain: passive microwave retrieval over snow and
    ice is a documented hard case. Treat as context there, not as a precision input.
- TMPA (TRMM legacy precipitation) - search `TMPA`
- Daymet (daily surface weather, model) - https://daymet.ornl.gov/getdata
- MERRA-2 reanalysis (wind, humidity, PBL height) - search `merra-2` in Earthdata Search
- AIRS (temperature, relative humidity) - Earthdata Search
- GES DISC OPeNDAP (Hyrax) - https://disc.gsfc.nasa.gov/information/tools?title=OPeNDAP%20and%20GDS
- GES DISC tools index (point time series, subsetters) - https://disc.gsfc.nasa.gov/information/tools
  (the old Hydrology Data Rods deep link is dead; NASA retired that service)
- CYGNSS / DDMI ocean winds - Earthdata Search
- AMSR2 surface winds - Earthdata Search
- Cloud products - https://satcorps.larc.nasa.gov/

### Air quality
- TEMPO (hourly North American air quality) - https://www.earthdata.nasa.gov/data/instruments/tempo
- TEMPO near-real-time viewer - https://weather.ndc.nasa.gov/sport/viewer/
- Atmospheric Science Data Center - https://asdc.larc.nasa.gov/ and tutorials at https://nasa.github.io/ASDC_Data_and_User_Services/
- Pandora / Pandonia ground network - https://pandora.gsfc.nasa.gov/ , data at http://data.pandonia-global-network.org/
- TOLNet ozone lidar - https://tolnet.larc.nasa.gov/
- AirNow - https://www.airnow.gov/
- OpenAQ (global ground stations) - https://openaq.org/
- MOPITT carbon monoxide - https://www2.acom.ucar.edu/facility/mopitt

Ground stations plus satellite is the validation story judges reward. Satellite alone
invites "how do you know it's right".

### Agriculture and vegetation
- Agriculture and Water Management Pathfinder - https://www.earthdata.nasa.gov/learn/pathfinders/agricultural-and-water-resources-data-pathfinder
- NASA Acres - https://www.nasaacres.org/ , NASA Harvest - https://www.nasaharvest.org/
- GLAM global agriculture monitoring - https://glam1.gsfc.nasa.gov/
- Crop-CASMA (crop condition + soil moisture) - https://nassgeo.csiss.gmu.edu/CropCASMA/
- GFSAD croplands - https://croplands.org/app/map
- US Drought Monitor - https://droughtmonitor.unl.edu/
- GLOBE Observer (citizen ground truth, incl. wildflower blooms) - https://observer.globe.gov/
- VEDA dashboard - https://www.earthdata.nasa.gov/dashboard/

### Ocean and water
- PACE (phytoplankton, aerosols, clouds) - https://pace.gsfc.nasa.gov/
- MODIS-Aqua - https://modis.gsfc.nasa.gov/data/
- SWOT (surface water and ocean topography) - https://podaac.jpl.nasa.gov/SWOT
- Earthdata ocean topic - https://www.earthdata.nasa.gov/topics/ocean

### Radar / SAR
- Alaska Satellite Facility Vertex - https://search.asf.alaska.edu/
- SAR primer - https://www.earthdata.nasa.gov/learn/earth-observation-data-basics/sar
- NISAR applications - https://nisar.jpl.nasa.gov/applications/societal-benefit/
- UAVSAR - https://uavsar.jpl.nasa.gov/
- RADARSAT Constellation Mission (CSA) - https://donnees-data.asc-csa.gc.ca/
- SAOCOM (CONAE, Argentina) - https://catalogos.conae.gov.ar/catalogo/catalogoSaocom.html

### Space weather and heliophysics
- NASA space weather - https://science.nasa.gov/heliophysics/focus-areas/space-weather/
- NOAA Space Weather Prediction Center - https://www.swpc.noaa.gov/
- Heliophysics fleet chart - https://science.nasa.gov/wp-content/uploads/2020/01/hpd-fleet-chart-jan-2024.jpg
- Space Weather Canada - https://www.spaceweather.gc.ca/
- EMBRACE (INPE, Brazil) - https://www2.inpe.br/climaespacial/portal/pt/

### Space biology and human health
- Open Science Data Repository (OSDR) - https://www.nasa.gov/osdr/ . 500+ biological experiments flown or flight-supporting
- 608 open-access space biology publications - https://github.com/jgalazka/SB_publications
- NASA Space Life Sciences Library - https://public.ksc.nasa.gov/nslsl/
- NASA Task Book - https://taskbook.nasaprs.com/tbp/welcome.cfm

### Habitats, Mars, in-space manufacturing
- NTRS (NASA Technical Reports Server) - https://ntrs.nasa.gov/ . The habitat, waste and construction literature lives here
- Moon to Mars Architecture Definition Document - https://www.nasa.gov/wp-content/uploads/2024/01/rev-a-acr23-esdmd-001-m2madd.pdf
- MGS-1 Mars Global Simulant - https://sciences.ucf.edu/class/simulant_marsglobal/
- Mars facts - https://science.nasa.gov/mars/facts/

### Orbital debris and LEO commercialization
- Orbital Debris Program Office - https://orbitaldebris.jsc.nasa.gov/ . Hosts ORDEM and the Debris Assessment Software (DAS)
- NASA space commercialization bibliography - https://www.nasa.gov/headquarters/library/find/bibliographies/space-commercialization/

### Cities, population, human settlement
- SEDAC socioeconomic data - https://search.earthdata.nasa.gov/search?q=CIESIN%20ESDIS
- Copernicus Global Human Settlement Layer - https://human-settlement.emergency.copernicus.eu/
- UN-Habitat Earth Observations Toolkit - http://eotoolkit.unhabitat.org/
- WorldPop - https://www.worldpop.org/
- WRI Data Explorer - https://datasets.wri.org/

### Planetary and high-resolution imagery
- Solar System Treks - https://trek.nasa.gov/
- Lunar Reconnaissance Orbiter data products - https://science.nasa.gov/mission/lro/data-products/
- Mars Reconnaissance Orbiter volumes - https://pds-imaging.jpl.nasa.gov/volumes/mro.html
- ASTER data hub - https://asterweb.jpl.nasa.gov/data.asp
- FIRMS active fire - https://firms.modaps.eosdis.nasa.gov/
- POWER (solar and meteorological energy fluxes) - https://power.larc.nasa.gov/data-access-viewer/
- USGS EarthExplorer (Landsat archive) - https://earthexplorer.usgs.gov/

## Partner-agency sources

Mixing one of these with a NASA source is the mechanical route to the Global Connection
angle, and it is over-represented among winners.

| Agency | Portal |
|---|---|
| CSA (Canada) | https://donnees-data.asc-csa.gc.ca/ - RADARSAT, RCM, SWOT, NEOSSat, MOPITT, SCISAT/ACE, OSIRIS |
| ESA / EU | https://dataspace.copernicus.eu/ - Sentinel archive, free and open |
| CONAE (Argentina) | https://catalogos.conae.gov.ar/ - SAOCOM, spectral signature library |
| INPE (Brazil) | https://www.dgi.inpe.br/catalogo/explore - 16+ satellites; CPTEC weather at https://satelite.cptec.inpe.br/ |
| Brazil INDE | https://visualizador.inde.gov.br/ |
| Canada geospatial | http://geo.ca/ , wildfire at https://cwfis.cfs.nrcan.gc.ca/ |
| Japan (ASTER search) | http://gbank.gsj.jp/madas/map/index.html |

## Training material worth an hour before the event

- ARSET applied remote sensing training - https://appliedsciences.nasa.gov/get-involved/training
  (verify before relying on it: this page has moved at least once and may redirect)
- Earth Science Data Systems backgrounders - https://www.earthdata.nasa.gov/learn/backgrounders
- Earthdata Forum (ask questions, answered by DAAC staff) - https://forum.earthdata.nasa.gov/
