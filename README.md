# Restoration Map
Interactive geospatial planning and vegetation-growth modeling for ecological restoration.

Restoration Map is a full-stack prototype for mapping restoration sites, recording native and invasive plant locations, and visualizing how vegetation biomass may change over time. Its React interface provides map-based site planning, while a Django REST backend runs a numerical vegetation-growth simulation and returns a spatial overlay for visualization.

## Highlights

- Interactive restoration mapping: draw polygon boundaries around restoration areas using Leaflet drawing tools.
- Plant mapping: place map markers for native or invasive plant species within a selected restoration area.
- Site subdivision: draw smaller polygons inside a restoration area and assign plant counts to visualize planting density.
- Biomass simulation: submit boundary and plant-coordinate data to a Python backend that numerically evolves a coupled spatial growth model using NumPy and SciPy sparse matrices.
- Spatial overlays: render a generated biomass heatmap over the mapped restoration area.
- Restoration dashboard: review saved mapped areas and their details through a React interface.
- Browser-side persistence: store map data in localStorage for local exploration.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, React Router, React Leaflet, Leaflet Draw, Tailwind CSS, DaisyUI |
| Maps | Leaflet, Mapbox map tiles |
| Backend | Python, Django, Django REST Framework |
| Modeling | NumPy, SciPy, Matplotlib |
| Local storage | Browser localStorage; Django SQLite development database |


## How it works

1. Draw a restoration-site boundary on the interactive map.
2. Add plant markers or subdivide the restoration site into smaller planting zones.
3. Submit site boundaries, initial plant coordinates, and simulation parameters to the backend.
4. The backend rasterizes the input into a grid, applies a numerical biomass-growth model with spatial diffusion/advection, and generates a heatmap.
5. The frontend overlays the resulting image onto the mapped region.

The simulation implementation is in [`myproject/maps/views.py`](myproject/maps/views.py). It uses sparse matrix operations for spatial terms and an explicit time-stepping procedure for coupled model variables. This is a modeling prototype, not a calibrated ecological prediction service.

## Repository structure

```text
restoration_map/
├── my-react-app/
│   ├── public/                 # Frontend assets
│   ├── src/
│   │   ├── App.js              # App routing
│   │   ├── MapView.js          # Interactive boundary drawing
│   │   ├── SmallMap.js         # Plant markers and map preview
│   │   ├── PolygonPlotPage.js  # Subregion drawing and plant counts
│   │   ├── SmallMapPage.js     # Simulation API request
│   │   ├── BiomassOverlayPage.js # Heatmap overlay
│   │   ├── Impact.js           # Restoration dashboard
│   │   └── PlantDatabase.js    # Native/invasive plant catalog
│   └── package.json
├── myproject/
│   ├── manage.py
│   ├── maps/
│   │   ├── views.py            # REST endpoint + numerical model
│   │   └── models.py
│   └── myproject/
│       ├── settings.py
│       └── urls.py
└── README.md
```

## Run locally

Before running: configure a new Django secret through environment variables and use a restricted public Mapbox token (pk.) in the browser. The original source includes historical hardcoded credentials; do not reuse them. See the configuration notes below.

### 1. Backend

Use Python 3.11, then create a fresh environment rather than using one checked into the repository.
```bash
cd myproject
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install "Django>=5.1,<5.2" djangorestframework django-cors-headers numpy scipy matplotlib
```
The Django settings load `SECRET_KEY` from `DJANGO_SECRET_KEY`. Generate a new local value and set the variable:
```bash
export DJANGO_SECRET_KEY="$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"
export DJANGO_DEBUG=true
```
On Windows PowerShell, set `$env:DJANGO_SECRET_KEY` and `$env:DJANGO_DEBUG` before starting Django.

Then run:
```bash
python manage.py migrate
python manage.py runserver
```
The local API is available at http://localhost:8000/.

### 2. Frontend

In a second terminal, from the repository root:
```bash
cd my-react-app
npm install
npm install axios leaflet mapbox-gl
```
In a local .env file inside my-react-app/, add a restricted public Mapbox token:
```dotenv
REACT_APP_MAPBOX_PUBLIC_TOKEN=pk.your_restricted_public_token_here
```
The map components read `process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN`. Copy `.env.example` to `.env` and replace the placeholder. React environment variables are included in the browser bundle: never put a Mapbox sk. token or any other secret in a REACT_APP_ variable.

Start the frontend:
```bash
npm start
```
Open http://localhost:3000.

## API

POST /api/predict-plant-growth/
The simulation endpoint accepts a JSON object containing a boundaries polygon, plants coordinates, and numerical parameters.
```json
{
  "boundaries": [[34.4269, -118.5754], [34.4271, -118.5754], [34.4271, -118.5751]],
  "plants": [[34.4270, -118.5753]],
  "save": true,
  "interpolation": true,
  "time": 70,
  "epsilon": 0.01,
  "kappa": 1,
  "D": 1.2
}
```
The response includes overlayImageURL, a relative path to a generated image. The current frontend assumes the backend is running on localhost:8000.

## Current limitations

This repository contains an experimental prototype, not a production deployment. In particular:

- Dashboard impact percentages are currently randomly generated placeholders, not measured environmental outcomes.
- The plant catalog is a static demonstration dataset, not a validated regional species database.
- The login screen is a UI mockup; it does not implement authentication.
- Map data is stored in browser localStorage, so it is not synchronized between devices or users.
- The backend has no production-ready request validation, background job processing, or access controls for computationally intensive simulation requests.
- A few frontend dependencies and configuration values require cleanup for reliable fresh installation.

## Roadmap

- Replace placeholder impact statistics with data-backed metrics.
- Add database-backed restoration-site and species records.
- Validate and constrain simulation inputs; improve error handling.
- Calibrate the model using ecological or restoration-site observations.
- Add reproducible tests, screenshots, and deployment instructions.

## License

No license has been specified yet. Until a license is added, the repository is publicly viewable but does not automatically grant broad reuse permissions.
