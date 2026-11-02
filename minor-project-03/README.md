# Minor Project 03 – Weather App + Movie Search App (API)

Two responsive web apps built with **HTML5, CSS3 and JavaScript (ES6+)** that fetch real-time data from free public APIs.

| App | API used | API key? |
|-----|----------|----------|
| ⛅ Weather App | [Open-Meteo](https://open-meteo.com/) (geocoding + forecast) | Not needed |
| 🎬 Movie Search App | [TVMaze](https://www.tvmaze.com/api) | Not needed |

## Features

### Weather App
- Search weather by city name
- Current temperature, condition and "feels like" temperature
- Humidity, wind speed, pressure and precipitation
- 5-day forecast
- °C / °F toggle
- Recent searches (saved in the browser)
- Friendly error messages (empty input, city not found, network/server errors)
- Responsive layout for mobile and desktop

### Movie Search App
- Search titles using a public database API
- Results grid with posters, release year and rating
- Sort by best match, highest rated or newest
- Details popup: poster, rating, genres, release date, status, runtime, language, network, summary and cast
- Handles invalid searches (empty, too short, no results) and API errors
- Responsive layout for mobile and desktop

## Concepts demonstrated

| Area | Where |
|------|-------|
| Arrow functions, template literals | All `js/*.js` files |
| Destructuring (objects, params, defaults) | `movies/js/api.js` → `normalize()`, event handlers in `app.js` |
| ES Modules (`import` / `export`) | Each app is split into `api.js`, `ui.js`, `app.js` |
| Optional chaining `?.`, nullish `??`, spread `...` | `api.js`, `app.js` |
| Promises, `async`/`await`, Fetch API | `api.js` in both apps |
| Error handling (`try/catch/finally`, custom error classes) | `WeatherError`, `MovieError` |
| DOM manipulation, event handling, event delegation | `ui.js`, `app.js` |
| Form processing & validation | `search()` in each `app.js` |
| JSON data handling | Response parsing and normalising in `api.js` |

## Project structure

```
minor-project-03/
├── index.html            # Landing page linking both apps
├── assets/base.css       # Shared styles
├── weather/
│   ├── index.html
│   ├── style.css
│   └── js/
│       ├── app.js        # Events + state
│       ├── api.js        # Fetch calls
│       ├── ui.js         # DOM rendering
│       └── weatherCodes.js
└── movies/
    ├── index.html
    ├── style.css
    └── js/
        ├── app.js
        ├── api.js
        └── ui.js
```

## How to run

The apps use ES modules, so they must be served over `http://` (opening the file directly with `file://` will not work).

**Option 1 – VS Code:** install the *Live Server* extension, right-click `index.html` → *Open with Live Server*.

**Option 2 – Python:**
```bash
cd minor-project-03
python -m http.server 8000
```
Then open http://localhost:8000

**Option 3 – GitHub Pages (live link):** push to GitHub → repo *Settings* → *Pages* → Source: `main` branch, `/ (root)` → Save. Your site will be at `https://<username>.github.io/<repo-name>/`.



## Author

Iftesam Parvin
