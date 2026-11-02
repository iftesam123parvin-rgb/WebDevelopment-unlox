// api.js – all network calls for the Weather App (Open-Meteo, no API key needed)

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

// Custom error so the UI can show friendly messages
export class WeatherError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WeatherError';
  }
}

// Small helper: fetch JSON and throw on HTTP errors
const fetchJSON = async (url) => {
  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new WeatherError('Network error. Please check your internet connection.');
  }
  if (!response.ok) {
    throw new WeatherError(`Server error (${response.status}). Please try again later.`);
  }
  return response.json();
};

// Step 1: turn a city name into coordinates
export const getCoordinates = async (city) => {
  const params = new URLSearchParams({ name: city, count: 1, language: 'en', format: 'json' });
  const data = await fetchJSON(`${GEO_URL}?${params}`);

  if (!data.results?.length) {
    throw new WeatherError(`City "${city}" not found. Check the spelling and try again.`);
  }

  const { name, country, admin1, latitude, longitude } = data.results[0];
  return { name, country, region: admin1, latitude, longitude };
};

// Step 2: get current weather + 5-day forecast for those coordinates
export const getWeather = async ({ latitude, longitude }) => {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: [
      'temperature_2m', 'apparent_temperature', 'relative_humidity_2m',
      'wind_speed_10m', 'weather_code', 'is_day', 'pressure_msl', 'precipitation',
    ].join(','),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: 5,
  });
  return fetchJSON(`${WEATHER_URL}?${params}`);
};

// Combined helper used by the app: city name -> { place, weather }
export const getWeatherByCity = async (city) => {
  const place = await getCoordinates(city);
  const weather = await getWeather(place);
  return { place, weather };
};
