// ui.js – everything that touches the DOM for the Weather App
import { describeWeather } from './weatherCodes.js';
 
const output = document.querySelector('#output');
const recentBox = document.querySelector('#recent');
 
const toF = (c) => (c * 9) / 5 + 32;
const formatTemp = (c, unit) => `${Math.round(unit === 'F' ? toF(c) : c)}°${unit}`;
 
// Escape text before putting it inside innerHTML (protects against odd API data)
const escapeHTML = (str = '') =>
  String(str).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
 
export const showLoading = () => {
  output.innerHTML = '<div class="loader" role="status" aria-label="Loading"></div>';
};
 
export const showError = (message) => {
  output.innerHTML = `<p class="message error">⚠️ ${escapeHTML(message)}</p>`;
};
 
export const renderWeather = ({ place, weather }, unit = 'C') => {
  const { current, daily, current_units: units } = weather;
  const { text, icon } = describeWeather(current.weather_code, current.is_day === 1);
  const location = [place.region, place.country].filter(Boolean).join(', ');
  const localTime = new Date(current.time).toLocaleString('en-IN', {
    weekday: 'long', hour: '2-digit', minute: '2-digit',
  });
 
  const forecastHTML = daily.time
    .map((date, i) => {
      const { icon: dIcon, text: dText } = describeWeather(daily.weather_code[i]);
      const dayName = i === 0 ? 'Today' : new Date(date).toLocaleDateString('en-IN', { weekday: 'short' });
      return `
        <div class="day" title="${dText}">
          <div class="d-name">${dayName}</div>
          <div class="d-icon">${dIcon}</div>
          <div>${formatTemp(daily.temperature_2m_max[i], unit)} / ${formatTemp(daily.temperature_2m_min[i], unit)}</div>
        </div>`;
    })
    .join('');
 
  output.innerHTML = `
    <article class="weather-card">
      <div class="weather-head">
        <div>
          <h2>${escapeHTML(place.name)}</h2>
          <div class="place">${escapeHTML(location)} · ${localTime}</div>
        </div>
        <div class="unit-toggle" role="group" aria-label="Temperature unit">
          <button type="button" data-unit="C" class="${unit === 'C' ? 'active' : ''}">°C</button>
          <button type="button" data-unit="F" class="${unit === 'F' ? 'active' : ''}">°F</button>
        </div>
      </div>
 
      <div class="weather-main">
        <div class="weather-icon">${icon}</div>
        <div>
          <div class="temp">${formatTemp(current.temperature_2m, unit)}</div>
          <div class="condition">${text}</div>
          <div class="feels">Feels like ${formatTemp(current.apparent_temperature, unit)}</div>
        </div>
      </div>
 
      <div class="details">
        <div class="detail"><span>💧 Humidity</span><strong>${current.relative_humidity_2m}${units.relative_humidity_2m}</strong></div>
        <div class="detail"><span>💨 Wind speed</span><strong>${current.wind_speed_10m} ${units.wind_speed_10m}</strong></div>
        <div class="detail"><span>🧭 Pressure</span><strong>${Math.round(current.pressure_msl)} ${units.pressure_msl}</strong></div>
        <div class="detail"><span>🌧️ Precipitation</span><strong>${current.precipitation} ${units.precipitation}</strong></div>
      </div>
    </article>
 
    <div class="forecast">${forecastHTML}</div>
  `;
};
 
export const renderRecent = (cities) => {
  recentBox.innerHTML = cities
    .map((city) => `<button type="button" class="chip" data-city="${escapeHTML(city)}">${escapeHTML(city)}</button>`)
    .join('');
};
 