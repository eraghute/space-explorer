# Space Explorer

An interactive space and Earth exploration app built with React and TypeScript. Explore NASA imagery, view Earth from a 3D globe, discover astronomical events, and check weather forecasts.

## Features

- **Globe Explorer** – Explore a 3D Earth globe powered by CesiumJS. Rotate and zoom the globe, select a location, and view its coordinates and astronomical insights, including sunlight conditions and Sun and Moon information.
- **Things to Watch** – Browse celestial events in daily, weekly, monthly, and yearly calendar views. Search and filter events by category and date. Includes curated eclipse and meteor-shower information, alongside asteroid close-approach data from NASA's NeoWs feed.
- **NASA Astronomy Picture of the Day** – Explore NASA's astronomy image collection, read descriptions, and browse available dates.
- **Earth from Space** – Browse natural-colour Earth imagery from NASA's EPIC camera, with a main image viewer and capture thumbnails.
- **Earth Weather** – View current conditions, hourly forecasts, and a 10-day forecast for London using Open-Meteo.
- **Dark and light themes** – Switch between themes across the app.

## Built with

- React 19 and TypeScript
- Vite
- React Router
- TanStack Query
- CesiumJS
- SunCalc
- Bootstrap 5 and custom CSS
- Vitest and Testing Library

## Getting started

### Prerequisites

- Node.js and npm

### Install and run

```bash
git clone https://github.com/eraghute/space-explorer.git
cd space-explorer
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Run TypeScript checks and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test -- --run` | Run the test suite once |

## Data sources

- [NASA Astronomy Picture of the Day](https://science.nasa.gov/solar-system/astronomy-picture-of-the-day/) – Astronomy images and descriptions.
- [NASA EPIC](https://epic.gsfc.nasa.gov/) – Natural-colour images of Earth.
- [NASA EOSDIS GIBS](https://www.earthdata.nasa.gov/data/tools/gibs) – Earth imagery used by the globe.
- [NASA Near Earth Object Web Service (NeoWs)](https://api.nasa.gov/) – Near-Earth object close-approach data.
- [NASA GSFC Eclipse Predictions](https://eclipse.gsfc.nasa.gov/) – Eclipse information.
- [NASA Science: Meteor Showers](https://science.nasa.gov/solar-system/meteors-meteorites/meteor-showers/) – Meteor-shower information.
- [Open-Meteo](https://open-meteo.com/) – London weather forecasts.

Some NASA services use the public `DEMO_KEY`, which has request limits. If a NASA data source is temporarily unavailable or its limit has been reached, try again later.

## Project status

This is an ongoing personal project. Features and data sources may evolve as the application develops.
