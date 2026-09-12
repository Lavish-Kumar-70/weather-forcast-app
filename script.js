// ==========================================
// WEATHERLY - WEATHER FORECAST APP
// COMPLETE WORKING JAVASCRIPT
// ==========================================


// ==========================================
// API
// ==========================================

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";

const REVERSE_GEOCODING_API =
    "https://nominatim.openstreetmap.org/reverse";


// ==========================================
// DOM ELEMENTS
// ==========================================

const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");
const locationBtn = document.querySelector("#locationBtn");
const darkModeBtn = document.querySelector("#darkModeBtn");
const clearBtn = document.querySelector("#clearBtn");

const message = document.querySelector("#message");
const loading = document.querySelector("#loading");

const cityName = document.querySelector("#cityName");
const currentDate = document.querySelector("#currentDate");

const temperature = document.querySelector("#temperature");
const weatherDescription = document.querySelector("#weatherDescription");
const weatherIcon = document.querySelector("#weatherIcon");
const feelsLike = document.querySelector("#feelsLike");

const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windSpeed");
const pressure = document.querySelector("#pressure");
const uvIndex = document.querySelector("#uvIndex");

const sunrise = document.querySelector("#sunrise");
const sunset = document.querySelector("#sunset");

const hourlyContainer =
    document.querySelector("#hourlyForecast");

const dailyContainer =
    document.querySelector("#dailyForecast");


// ==========================================
// WEATHER EFFECT ELEMENTS
// ==========================================

const weatherBackground =
    document.querySelector("#weatherBackground");

const rainEffect =
    document.querySelector("#rainEffect");

const snowEffect =
    document.querySelector("#snowEffect");

const cloudEffect =
    document.querySelector("#cloudEffect");

const sunEffect =
    document.querySelector("#sunEffect");

const fogEffect =
    document.querySelector("#fogEffect");


// ==========================================
// WEATHER INFORMATION
// ==========================================

function getWeatherInfo(code) {

    const weather = {

        0: {
            description: "Clear Sky",
            icon: "☀️",
            type: "clear"
        },

        1: {
            description: "Mainly Clear",
            icon: "🌤️",
            type: "clear"
        },

        2: {
            description: "Partly Cloudy",
            icon: "⛅",
            type: "cloudy"
        },

        3: {
            description: "Overcast",
            icon: "☁️",
            type: "cloudy"
        },

        45: {
            description: "Fog",
            icon: "🌫️",
            type: "foggy"
        },

        48: {
            description: "Rime Fog",
            icon: "🌫️",
            type: "foggy"
        },

        51: {
            description: "Light Drizzle",
            icon: "🌦️",
            type: "rainy"
        },

        53: {
            description: "Moderate Drizzle",
            icon: "🌦️",
            type: "rainy"
        },

        55: {
            description: "Heavy Drizzle",
            icon: "🌧️",
            type: "heavy-rain"
        },

        56: {
            description: "Light Freezing Drizzle",
            icon: "🌧️",
            type: "rainy"
        },

        57: {
            description: "Heavy Freezing Drizzle",
            icon: "🌧️",
            type: "heavy-rain"
        },

        61: {
            description: "Slight Rain",
            icon: "🌦️",
            type: "rainy"
        },

        63: {
            description: "Moderate Rain",
            icon: "🌧️",
            type: "rainy"
        },

        65: {
            description: "Heavy Rain",
            icon: "🌧️",
            type: "heavy-rain"
        },

        66: {
            description: "Light Freezing Rain",
            icon: "🌧️",
            type: "rainy"
        },

        67: {
            description: "Heavy Freezing Rain",
            icon: "🌧️",
            type: "heavy-rain"
        },

        71: {
            description: "Slight Snow",
            icon: "🌨️",
            type: "snowy"
        },

        73: {
            description: "Moderate Snow",
            icon: "🌨️",
            type: "snowy"
        },

        75: {
            description: "Heavy Snow",
            icon: "❄️",
            type: "snowy"
        },

        77: {
            description: "Snow Grains",
            icon: "❄️",
            type: "snowy"
        },

        80: {
            description: "Slight Rain Showers",
            icon: "🌦️",
            type: "rainy"
        },

        81: {
            description: "Moderate Rain Showers",
            icon: "🌧️",
            type: "rainy"
        },

        82: {
            description: "Violent Rain Showers",
            icon: "⛈️",
            type: "heavy-rain"
        },

        85: {
            description: "Slight Snow Showers",
            icon: "🌨️",
            type: "snowy"
        },

        86: {
            description: "Heavy Snow Showers",
            icon: "❄️",
            type: "snowy"
        },

        95: {
            description: "Thunderstorm",
            icon: "⛈️",
            type: "heavy-rain"
        },

        96: {
            description: "Thunderstorm With Hail",
            icon: "⛈️",
            type: "heavy-rain"
        },

        99: {
            description: "Heavy Thunderstorm",
            icon: "⛈️",
            type: "heavy-rain"
        }
    };

    return weather[code] || {
        description: "Unknown Weather",
        icon: "🌡️",
        type: "clear"
    };
}


// ==========================================
// TEMPERATURE FORMAT
// ==========================================

function formatTemperature(value) {

    if (
        value === null ||
        value === undefined ||
        Number.isNaN(value)
    ) {
        return "--";
    }

    return Math.round(value);
}


// ==========================================
// TIME FORMAT
// ==========================================

function formatTime(time) {

    if (!time) {
        return "--:--";
    }

    const date = new Date(time);

    return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}


// ==========================================
// DATE FORMAT
// ==========================================

function formatCurrentDate() {

    const date = new Date();

    return date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


// ==========================================
// DAY FORMAT
// ==========================================

function formatDay(dateString, index) {

    if (index === 0) {
        return "Today";
    }

    if (index === 1) {
        return "Tomorrow";
    }

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        weekday: "short"
    });
}


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(text, type = "info") {

    if (!message) {
        return;
    }

    message.textContent = text;

    message.className = "message";

    if (type === "error") {
        message.classList.add("error");
    }

    if (type === "success") {
        message.classList.add("success");
    }
}


// ==========================================
// CLEAR MESSAGE
// ==========================================

function clearMessage() {

    if (!message) {
        return;
    }

    message.textContent = "";
    message.className = "message";
}


// ==========================================
// LOADING
// ==========================================

function setLoading(isLoading) {

    if (loading) {

        loading.classList.toggle(
            "hidden",
            !isLoading
        );
    }

    if (searchBtn) {

        searchBtn.disabled = isLoading;

        searchBtn.textContent =
            isLoading
                ? "Searching..."
                : "🔍 Search";
    }

    if (locationBtn) {

        locationBtn.disabled = isLoading;
    }
}


// ==========================================
// WEATHER EFFECT
// ==========================================

function setWeatherEffect(
    weatherType,
    isNight = false
) {

    if (!weatherBackground) {
        return;
    }


    // Reset background classes

    weatherBackground.className =
        "weather-background";


    // Clear old effects

    if (rainEffect) {
        rainEffect.innerHTML = "";
    }

    if (snowEffect) {
        snowEffect.innerHTML = "";
    }

    if (cloudEffect) {
        cloudEffect.innerHTML = "";
    }

    if (sunEffect) {
        sunEffect.innerHTML = "";
    }

    if (fogEffect) {
        fogEffect.innerHTML = "";
    }


    // ======================================
    // NIGHT
    // ======================================

    if (isNight) {

        weatherBackground.classList.add(
            "night"
        );

        createStars();

        return;
    }


    // ======================================
    // CLEAR
    // ======================================

    if (weatherType === "clear") {

        weatherBackground.classList.add(
            "clear"
        );

        createSun();

        return;
    }


    // ======================================
    // RAIN
    // ======================================

    if (weatherType === "rainy") {

        weatherBackground.classList.add(
            "rainy"
        );

        createRain(30);

        return;
    }


    // ======================================
    // HEAVY RAIN
    // ======================================

    if (weatherType === "heavy-rain") {

        weatherBackground.classList.add(
            "rainy"
        );

        createRain(60);

        return;
    }


    // ======================================
    // SNOW
    // ======================================

    if (weatherType === "snowy") {

        weatherBackground.classList.add(
            "snowy"
        );

        createSnow(25);

        return;
    }


    // ======================================
    // CLOUDY
    // ======================================

    if (weatherType === "cloudy") {

        weatherBackground.classList.add(
            "cloudy"
        );

        createClouds();

        return;
    }


    // ======================================
    // FOG
    // ======================================

    if (weatherType === "foggy") {

        weatherBackground.classList.add(
            "foggy"
        );

        createFog();

        return;
    }
}


// ==========================================
// CREATE RAIN
// ==========================================

function createRain(count) {

    if (!rainEffect) {
        return;
    }

    for (let i = 0; i < count; i++) {

        const drop =
            document.createElement("span");

        drop.className = "rain-drop";

        drop.style.left =
            `${Math.random() * 100}%`;

        drop.style.animationDelay =
            `${Math.random() * 2}s`;

        drop.style.animationDuration =
            `${0.5 + Math.random() * 0.7}s`;

        rainEffect.appendChild(drop);
    }
}


// ==========================================
// CREATE SNOW
// ==========================================

function createSnow(count) {

    if (!snowEffect) {
        return;
    }

    for (let i = 0; i < count; i++) {

        const snow =
            document.createElement("span");

        snow.className = "snowflake";

        snow.textContent = "❄";

        snow.style.left =
            `${Math.random() * 100}%`;

        snow.style.fontSize =
            `${8 + Math.random() * 10}px`;

        snow.style.animationDelay =
            `${Math.random() * 5}s`;

        snow.style.animationDuration =
            `${5 + Math.random() * 5}s`;

        snowEffect.appendChild(snow);
    }
}


// ==========================================
// CREATE CLOUDS
// ==========================================

function createClouds() {

    if (!cloudEffect) {
        return;
    }

    for (let i = 0; i < 5; i++) {

        const cloud =
            document.createElement("div");

        cloud.className =
            "weather-cloud";

        cloud.style.top =
            `${10 + Math.random() * 50}%`;

        cloud.style.left =
            `${Math.random() * 90}%`;

        cloud.style.animationDelay =
            `${Math.random() * 5}s`;

        cloudEffect.appendChild(cloud);
    }
}


// ==========================================
// CREATE SUN
// ==========================================

function createSun() {

    if (!sunEffect) {
        return;
    }

    const sun =
        document.createElement("div");

    sun.className =
        "sun-glow";

    sunEffect.appendChild(sun);
}


// ==========================================
// CREATE FOG
// ==========================================

function createFog() {

    if (!fogEffect) {
        return;
    }

    for (let i = 0; i < 3; i++) {

        const fog =
            document.createElement("div");

        fog.className =
            "fog-layer";

        fog.style.top =
            `${25 + i * 20}%`;

        fog.style.animationDelay =
            `${i * 2}s`;

        fogEffect.appendChild(fog);
    }
}


// ==========================================
// CREATE STARS
// ==========================================

function createStars() {

    if (!weatherBackground) {
        return;
    }

    for (let i = 0; i < 20; i++) {

        const star =
            document.createElement("span");

        star.className =
            "night-star";

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 70}%`;

        star.style.animationDelay =
            `${Math.random() * 3}s`;

        weatherBackground.appendChild(star);
    }
}


// ==========================================
// SEARCH CITY
// ==========================================

async function searchCity() {

    const input =
        cityInput
            ? cityInput.value.trim()
            : "";


    if (!input) {

        showMessage(
            "Please enter a city, state or PIN code.",
            "error"
        );

        return;
    }


    setLoading(true);

    showMessage(
        "Searching location..."
    );


    try {

        // ======================================
        // INDIA SEARCH
        // ======================================

        const indiaUrl =
            `${GEOCODING_API}` +
            `?name=${encodeURIComponent(input)}` +
            `&count=10` +
            `&language=en` +
            `&format=json` +
            `&countryCode=IN`;


        const indiaResponse =
            await fetch(indiaUrl);


        if (!indiaResponse.ok) {
            throw new Error(
                "India location search failed"
            );
        }


        const indiaData =
            await indiaResponse.json();


        let results =
            indiaData.results || [];


        // ======================================
        // GLOBAL SEARCH IF INDIA RESULT NOT FOUND
        // ======================================

        if (results.length === 0) {

            const globalUrl =
                `${GEOCODING_API}` +
                `?name=${encodeURIComponent(input)}` +
                `&count=10` +
                `&language=en` +
                `&format=json`;


            const globalResponse =
                await fetch(globalUrl);


            if (!globalResponse.ok) {
                throw new Error(
                    "Global location search failed"
                );
            }


            const globalData =
                await globalResponse.json();


            results =
                globalData.results || [];
        }


        // ======================================
        // NO RESULT
        // ======================================

        if (results.length === 0) {

            showMessage(
                "Location not found. Try another city, state or PIN code.",
                "error"
            );

            return;
        }


        // ======================================
        // FIND BEST RESULT
        // ======================================

        const inputLower =
            input.toLowerCase();


        // Exact Indian name

        let selectedLocation =
            results.find(result =>

                result.name &&
                result.name.toLowerCase() ===
                    inputLower &&

                result.country_code &&
                result.country_code.toLowerCase() ===
                    "in"
            );


        // Any exact name

        if (!selectedLocation) {

            selectedLocation =
                results.find(result =>

                    result.name &&
                    result.name.toLowerCase() ===
                        inputLower
                );
        }


        // Indian result

        if (!selectedLocation) {

            selectedLocation =
                results.find(result =>

                    result.country_code &&
                    result.country_code.toLowerCase() ===
                        "in"
                );
        }


        // First result

        if (!selectedLocation) {

            selectedLocation =
                results[0];
        }


        console.log(
            "Selected Location:",
            selectedLocation
        );


        // ======================================
        // GET WEATHER
        // ======================================

        await getWeather(

            selectedLocation.latitude,

            selectedLocation.longitude,

            selectedLocation.name,

            selectedLocation.country,

            selectedLocation.admin1 || ""
        );


    } catch (error) {

        console.error(
            "Search Error:",
            error
        );


        showMessage(
            "Unable to find weather. Please check your internet connection.",
            "error"
        );

    } finally {

        setLoading(false);
    }
}


// ==========================================
// GET WEATHER
// ==========================================

async function getWeather(
    latitude,
    longitude,
    locationName,
    country,
    state = ""
) {

    try {

        showMessage(
            "Loading weather..."
        );


        const url =
            `${WEATHER_API}` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +

            `&current=` +
            `temperature_2m,` +
            `relative_humidity_2m,` +
            `apparent_temperature,` +
            `is_day,` +
            `precipitation,` +
            `rain,` +
            `weather_code,` +
            `surface_pressure,` +
            `wind_speed_10m` +

            `&hourly=` +
            `temperature_2m,` +
            `weather_code,` +
            `precipitation_probability` +

            `&daily=` +
            `weather_code,` +
            `temperature_2m_max,` +
            `temperature_2m_min,` +
            `sunrise,` +
            `sunset,` +
            `uv_index_max` +

            `&timezone=auto` +
            `&forecast_days=7`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Weather API failed"
            );
        }


        const data =
            await response.json();


        // ======================================
        // SAVE LOCATION
        // ======================================

        window.currentWeatherLocation = {

            latitude,
            longitude,

            name: locationName,

            country,

            state
        };


        // ======================================
        // RENDER DATA
        // ======================================

        renderCurrentWeather(
            data,
            locationName,
            country,
            state
        );


        renderHourlyForecast(data);

        renderDailyForecast(data);


        // ======================================
        // WEATHER EFFECT
        // ======================================

        const currentCode =
            data.current?.weather_code;


        const weatherInfo =
            getWeatherInfo(currentCode);


        const isNight =
            data.current?.is_day === 0;


        setWeatherEffect(
            weatherInfo.type,
            isNight
        );


        clearMessage();


    } catch (error) {

        console.error(
            "Weather Error:",
            error
        );


        showMessage(
            "Unable to load weather information.",
            "error"
        );
    }
}


// ==========================================
// CURRENT WEATHER
// ==========================================

function renderCurrentWeather(
    data,
    locationName,
    country,
    state
) {

    const current =
        data.current;


    if (!current) {
        return;
    }


    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );


    // ======================================
    // CITY
    // ======================================

    if (cityName) {

        cityName.textContent =
            locationName ||
            "Unknown Location";
    }


    // ======================================
    // DATE
    // ======================================

    if (currentDate) {

        currentDate.textContent =
            state && country

                ? `${state}, ${country} • ${formatCurrentDate()}`

                : formatCurrentDate();
    }


    // ======================================
    // TEMPERATURE
    // ======================================

    if (temperature) {

        temperature.textContent =
            formatTemperature(
                current.temperature_2m
            );
    }


    // ======================================
    // WEATHER DESCRIPTION
    // ======================================

    if (weatherDescription) {

        weatherDescription.textContent =
            weatherInfo.description;
    }


    // ======================================
    // WEATHER ICON
    // ======================================

    if (weatherIcon) {

        weatherIcon.textContent =
            weatherInfo.icon;
    }


    // ======================================
    // FEELS LIKE
    // ======================================

    if (feelsLike) {

        feelsLike.textContent =
            `Feels like ${formatTemperature(
                current.apparent_temperature
            )}°C`;
    }


    // ======================================
    // HUMIDITY
    // ======================================

    if (humidity) {

        humidity.textContent =
            `${Math.round(
                current.relative_humidity_2m
            )}%`;
    }


    // ======================================
    // WIND
    // ======================================

    if (windSpeed) {

        windSpeed.textContent =
            `${Math.round(
                current.wind_speed_10m
            )} km/h`;
    }


    // ======================================
    // PRESSURE
    // ======================================

    if (pressure) {

        pressure.textContent =
            `${Math.round(
                current.surface_pressure
            )} hPa`;
    }


    // ======================================
    // UV
    // ======================================

    if (uvIndex) {

        const uv =
            data.daily?.uv_index_max?.[0];


        uvIndex.textContent =
            uv !== undefined
                ? Math.round(uv)
                : "--";
    }


    // ======================================
    // SUNRISE
    // ======================================

    if (sunrise) {

        sunrise.textContent =
            formatTime(
                data.daily?.sunrise?.[0]
            );
    }


    // ======================================
    // SUNSET
    // ======================================

    if (sunset) {

        sunset.textContent =
            formatTime(
                data.daily?.sunset?.[0]
            );
    }
}


// ==========================================
// HOURLY FORECAST
// ==========================================

function renderHourlyForecast(data) {

    if (!hourlyContainer) {
        return;
    }


    hourlyContainer.innerHTML = "";


    const hourly =
        data.hourly;


    if (!hourly || !hourly.time) {
        return;
    }


    const currentTime =
        new Date();


    let startIndex =
        hourly.time.findIndex(
            time =>
                new Date(time) >=
                currentTime
        );


    if (startIndex === -1) {
        startIndex = 0;
    }


    const endIndex =
        Math.min(
            startIndex + 24,
            hourly.time.length
        );


    for (
        let i = startIndex;
        i < endIndex;
        i++
    ) {

        const time =
            new Date(
                hourly.time[i]
            );


        const weatherInfo =
            getWeatherInfo(
                hourly.weather_code[i]
            );


        const temp =
            hourly.temperature_2m[i];


        const rainProbability =
            hourly.precipitation_probability?.[i] ?? 0;


        const item =
            document.createElement("div");


        item.className =
            "hourly-item";


        item.innerHTML = `

            <div class="hour-time">

                ${
                    i === startIndex

                        ? "Now"

                        : time.toLocaleTimeString(
                            "en-IN",
                            {
                                hour: "numeric",
                                hour12: true
                            }
                        )
                }

            </div>


            <div class="hour-icon">
                ${weatherInfo.icon}
            </div>


            <div class="hour-temp">
                ${formatTemperature(temp)}°
            </div>


            <div class="hour-rain">
                💧 ${rainProbability}%
            </div>

        `;


        hourlyContainer.appendChild(item);
    }
}


// ==========================================
// DAILY FORECAST
// ==========================================

function renderDailyForecast(data) {

    if (!dailyContainer) {
        return;
    }


    dailyContainer.innerHTML = "";


    const daily =
        data.daily;


    if (!daily || !daily.time) {
        return;
    }


    for (
        let i = 0;
        i < daily.time.length;
        i++
    ) {

        const weatherInfo =
            getWeatherInfo(
                daily.weather_code[i]
            );


        const item =
            document.createElement("div");


        item.className =
            "daily-item";


        item.innerHTML = `

            <div class="day-name">

                ${formatDay(
                    daily.time[i],
                    i
                )}

            </div>


            <div class="day-icon">
                ${weatherInfo.icon}
            </div>


            <div class="day-condition">

                ${weatherInfo.description}

            </div>


            <div class="day-temp">

                <strong>

                    ${formatTemperature(
                        daily.temperature_2m_max[i]
                    )}°

                </strong>


                <span>

                    ${formatTemperature(
                        daily.temperature_2m_min[i]
                    )}°

                </span>

            </div>

        `;


        dailyContainer.appendChild(item);
    }
}


// ==========================================
// MY LOCATION
// ==========================================

function getMyLocation() {

    if (!navigator.geolocation) {

        showMessage(
            "Geolocation is not supported by your browser.",
            "error"
        );

        return;
    }


    showMessage(
        "Getting your location..."
    );


    if (locationBtn) {
        locationBtn.disabled = true;
        locationBtn.textContent = "📍 Locating...";
    }


    navigator.geolocation.getCurrentPosition(

        async position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            try {

                // ==================================
                // REVERSE GEOCODING
                // ==================================

                const url =
                    `${REVERSE_GEOCODING_API}` +
                    `?lat=${latitude}` +
                    `&lon=${longitude}` +
                    `&format=json` +
                    `&accept-language=en`;


                const response =
                    await fetch(url);


                if (!response.ok) {
                    throw new Error(
                        "Reverse geocoding failed"
                    );
                }


                const locationData =
                    await response.json();


                const address =
                    locationData.address || {};


                const locationName =
                    address.city ||
                    address.town ||
                    address.village ||
                    address.municipality ||
                    address.county ||
                    "My Location";


                const state =
                    address.state || "";


                const country =
                    address.country || "";


                if (cityInput) {
                    cityInput.value =
                        locationName;
                }


                updateClearButton();


                await getWeather(

                    latitude,

                    longitude,

                    locationName,

                    country,

                    state
                );


            } catch (error) {

                console.error(
                    "Location name error:",
                    error
                );


                await getWeather(

                    latitude,

                    longitude,

                    "My Location",

                    "",

                    ""
                );
            }


            if (locationBtn) {

                locationBtn.disabled = false;

                locationBtn.textContent =
                    "📍 My Location";
            }
        },


        error => {

            console.error(
                "Geolocation Error:",
                error
            );


            let errorMessage =
                "Unable to get your location.";


            if (error.code === 1) {

                errorMessage =
                    "Location permission denied. Please allow location access.";
            }


            if (error.code === 2) {

                errorMessage =
                    "Location information is unavailable.";
            }


            if (error.code === 3) {

                errorMessage =
                    "Location request timed out.";
            }


            showMessage(
                errorMessage,
                "error"
            );


            if (locationBtn) {

                locationBtn.disabled = false;

                locationBtn.textContent =
                    "📍 My Location";
            }
        },


        {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 300000
        }
    );
}


// ==========================================
// DARK MODE
// ==========================================

function setDarkMode(enabled) {

    document.body.classList.toggle(
        "dark-mode",
        enabled
    );


    if (darkModeBtn) {

        darkModeBtn.innerHTML =
            enabled
                ? "☀️ <span id=\"modeText\">Light Mode</span>"
                : "🌙 <span id=\"modeText\">Dark Mode</span>";
    }


    localStorage.setItem(
        "weatherlyDarkMode",
        enabled
    );
}


// ==========================================
// LOAD DARK MODE
// ==========================================

function loadDarkMode() {

    const saved =
        localStorage.getItem(
            "weatherlyDarkMode"
        );


    setDarkMode(
        saved === "true"
    );
}


// ==========================================
// CLEAR BUTTON
// ==========================================

function updateClearButton() {

    if (!clearBtn || !cityInput) {
        return;
    }


    clearBtn.style.display =
        cityInput.value.trim()
            ? "block"
            : "none";
}


// ==========================================
// SEARCH BUTTON
// ==========================================

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        searchCity
    );
}


// ==========================================
// ENTER KEY
// ==========================================

if (cityInput) {

    cityInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                searchCity();
            }
        }
    );


    cityInput.addEventListener(
        "input",
        updateClearButton
    );
}


// ==========================================
// CLEAR BUTTON
// ==========================================

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        () => {

            if (cityInput) {

                cityInput.value = "";

                cityInput.focus();
            }


            updateClearButton();

            clearMessage();
        }
    );
}


// ==========================================
// MY LOCATION BUTTON
// ==========================================

if (locationBtn) {

    locationBtn.addEventListener(
        "click",
        getMyLocation
    );
}


// ==========================================
// DARK MODE BUTTON
// ==========================================

if (darkModeBtn) {

    darkModeBtn.addEventListener(
        "click",
        () => {

            const enabled =
                !document.body.classList.contains(
                    "dark-mode"
                );


            setDarkMode(enabled);
        }
    );
}


// ==========================================
// INITIAL SETUP
// ==========================================

loadDarkMode();

updateClearButton();


// ==========================================
// NO DEFAULT CITY
// ==========================================
// Weather will NOT automatically show Haridwar.
// User must search or click My Location.
// ==========================================

console.log(
    "Weatherly JavaScript loaded successfully."
);