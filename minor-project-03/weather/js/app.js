// app.js – entry point: wires up events, state and API calls
import { getWeatherByCity, WeatherError } from './api.js';
import { showLoading, showError, renderWeather, renderRecent } from './ui.js';

const form = document.querySelector('#search-form');
const input = document.querySelector('#city-input');
const button = document.querySelector('#search-btn');
const output = document.querySelector('#output');
const recentBox = document.querySelector('#recent');

const RECENT_KEY = 'weather-recent';
const MAX_RECENT = 5;

// App state
const state = {
  unit: 'C',
  lastResult: null,
  recent: loadRecent(),
};

function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) ?? [];
  } catch {
    return [];
  }
}

const saveRecent = (city) => {
  state.recent = [city, ...state.recent.filter((c) => c.toLowerCase() !== city.toLowerCase())].slice(0, MAX_RECENT);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(state.recent));
  } catch { /* storage not available – ignore */ }
  renderRecent(state.recent);
};

const search = async (city) => {
  const query = city.trim();
  if (!query) {
    showError('Please enter a city name.');
    return;
  }

  button.disabled = true;
  showLoading();

  try {
    const result = await getWeatherByCity(query);
    state.lastResult = result;
    renderWeather(result, state.unit);
    saveRecent(result.place.name);
  } catch (err) {
    console.error(err);
    showError(err instanceof WeatherError ? err.message : 'Something went wrong. Please try again.');
  } finally {
    button.disabled = false;
  }
};

// --- Event handling ---
form.addEventListener('submit', (e) => {
  e.preventDefault();
  search(input.value);
});

// Event delegation: unit toggle buttons are created dynamically
output.addEventListener('click', ({ target }) => {
  const { unit } = target.dataset;
  if (unit && state.lastResult) {
    state.unit = unit;
    renderWeather(state.lastResult, state.unit);
  }
});

recentBox.addEventListener('click', ({ target }) => {
  const { city } = target.dataset;
  if (city) {
    input.value = city;
    search(city);
  }
});

renderRecent(state.recent);
