// Select HTML Elements

const form = document.querySelector("#weather-form");

const cityInput = document.querySelector("#city-input");

const statusMessage =
    document.querySelector("#weather-status");

const result =
    document.querySelector("#weather-result");


// Weather Codes

const weatherCodes = {

    0: ["Clear sky", "☀️"],
    1: ["Mainly clear", "🌤️"],
    2: ["Partly cloudy", "⛅"],
    3: ["Overcast", "☁️"],

    45: ["Fog", "🌫️"],
    48: ["Fog", "🌫️"],

    51: ["Light drizzle", "🌦️"],
    53: ["Drizzle", "🌦️"],
    55: ["Dense drizzle", "🌧️"],

    61: ["Slight rain", "🌦️"],
    63: ["Rain", "🌧️"],
    65: ["Heavy rain", "🌧️"],

    71: ["Slight snow", "🌨️"],
    73: ["Snow", "🌨️"],
    75: ["Heavy snow", "❄️"],

    80: ["Rain showers", "🌦️"],
    81: ["Rain showers", "🌧️"],
    82: ["Heavy showers", "⛈️"],

    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with hail", "⛈️"],
    99: ["Thunderstorm with hail", "⛈️"]

};


// Display Status Messages

const setStatus = (message, isError = false) => {

    statusMessage.textContent = message;

    statusMessage.classList.toggle("error", isError);

};


// Step 1: Get City Coordinates

async function getCoordinates(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {

        throw new Error(
            "Could not connect to location service."
        );

    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {

        throw new Error(
            "City not found. Check the spelling."
        );

    }

    return data.results[0];

}


// Step 2: Get Weather Information

async function getWeather(latitude, longitude) {

    const params = new URLSearchParams({

        latitude,
        longitude,

        current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",

        timezone: "auto"

    });

    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?${params}`
    );

    if (!response.ok) {

        throw new Error(
            "Could not retrieve weather data."
        );

    }

    return response.json();

}


// Step 3: Display Weather Information

function renderWeather(place, data) {

    const { current } = data;

    const [description, icon] =
        weatherCodes[current.weather_code] ??
        ["Current conditions", "🌡️"];


    document.querySelector("#location-name").textContent =
        `${place.name}, ${place.country}`;


    document.querySelector("#weather-description").textContent =
        description;


    document.querySelector("#weather-time").textContent =
        `Local time: ${current.time.replace("T", " ")}`;


    document.querySelector("#weather-icon").textContent =
        icon;


    document.querySelector("#temperature").textContent =
        `${Math.round(current.temperature_2m)}°C`;


    document.querySelector("#feels-like").textContent =
        `Feels like ${Math.round(current.apparent_temperature)}°`;


    document.querySelector("#humidity").textContent =
        `${current.relative_humidity_2m}%`;


    document.querySelector("#wind").textContent =
        `${current.wind_speed_10m} km/h`;


    document.querySelector("#precipitation").textContent =
        `${current.precipitation} mm`;


    result.hidden = false;

}


// Step 4: Handle Search Form

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) return;


    result.hidden = true;

    setStatus("Finding city and fetching weather...");


    const button = form.querySelector("button");

    button.disabled = true;


    try {

        const place = await getCoordinates(city);

        const weather = await getWeather(
            place.latitude,
            place.longitude
        );

        renderWeather(place, weather);

        setStatus(
            `Showing current weather for ${place.name}.`
        );


    } catch (error) {

        setStatus(error.message, true);


    } finally {

        button.disabled = false;

    }

});