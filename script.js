// ==========================================
// GET HTML ELEMENTS
// ==========================================

const cityInput =
    document.getElementById("cityInput");

const searchBtn =
    document.getElementById("searchBtn");

const locationBtn =
    document.getElementById("locationBtn");

const darkModeBtn =
    document.getElementById("darkModeBtn");

const message =
    document.getElementById("message");

const cityName =
    document.getElementById("cityName");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const condition =
    document.getElementById("condition");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");

const hourlyForecast =
    document.getElementById("hourlyForecast");

const forecast =
    document.getElementById("forecast");

const rainAnimation =
    document.getElementById("rainAnimation");


// ==========================================
// FIX: track in-flight requests so a new
// search cancels any previous one that
// hasn't resolved yet (prevents race
// condition where an older, slower request
// overwrites the UI after a newer one)
// ==========================================

let currentController = null;


// ==========================================
// SEARCH BUTTON
// ==========================================

searchBtn.addEventListener(
    "click",
    getWeather
);


// ==========================================
// ENTER KEY
// ==========================================

cityInput.addEventListener(
    "keyup",
    function (event) {

        if (event.key === "Enter") {

            getWeather();

        }

    }
);


// ==========================================
// MAIN WEATHER FUNCTION
// ==========================================

async function getWeather() {

    const city =
        cityInput.value.trim();


    // Empty input

    if (city === "") {

        showMessage(
            "Please enter city name"
        );

        return;
    }


    // FIX: cancel any previous request
    // still in flight before starting a
    // new one

    if (currentController) {

        currentController.abort();

    }

    currentController =
        new AbortController();

    const { signal } =
        currentController;


    showMessage(
        "Loading weather..."
    );


    try {

        // ======================================
        // STEP 1: FIND CITY
        // ======================================

        const geoURL =
            "https://geocoding-api.open-meteo.com/v1/search?"
            + "name="
            + encodeURIComponent(city)
            + "&count=1"
            + "&language=en"
            + "&format=json";


        const geoResponse =
            await fetch(geoURL, { signal });


        if (!geoResponse.ok) {

            throw new Error(
                "Location API Error"
            );

        }


        const geoData =
            await geoResponse.json();


        // City not found

        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            showMessage(
                "City not found"
            );

            return;
        }


        // First result

        const location =
            geoData.results[0];


        const latitude =
            location.latitude;


        const longitude =
            location.longitude;


        // ======================================
        // STEP 2: GET WEATHER
        // ======================================

        await loadWeather(
            latitude,
            longitude,
            location,
            signal
        );

    }


    catch (error) {

        // FIX: don't show an error message
        // when the request was intentionally
        // aborted by a newer search

        if (error.name === "AbortError") {

            return;

        }


        console.log(error);

        showMessage(
            "Weather data load nahi ho raha"
        );

    }

}


// ==========================================
// LOAD WEATHER DATA
// ==========================================

async function loadWeather(
    latitude,
    longitude,
    location,
    signal
) {

    const weatherURL =
        "https://api.open-meteo.com/v1/forecast?"
        + "latitude=" + latitude
        + "&longitude=" + longitude
        + "&current="
        + "temperature_2m,"
        + "relative_humidity_2m,"
        + "wind_speed_10m,"
        + "weather_code"
        + "&hourly="
        + "temperature_2m,"
        + "weather_code"
        + "&daily="
        + "weather_code,"
        + "temperature_2m_max,"
        + "temperature_2m_min,"
        + "sunrise,"
        + "sunset"
        + "&wind_speed_unit=kmh"
        + "&timezone=auto"
        + "&forecast_days=7";


    const weatherResponse =
        await fetch(weatherURL, { signal });


    if (!weatherResponse.ok) {

        throw new Error(
            "Weather API Error"
        );

    }


    const data =
        await weatherResponse.json();


    // ======================================
    // CURRENT WEATHER
    // ======================================

    cityName.innerText =
        location.name
        + (location.country
            ? ", " + location.country
            : "");


    temperature.innerText =
        Math.round(
            data.current.temperature_2m
        ) + "°C";


    humidity.innerText =
        data.current.relative_humidity_2m
        + "%";


    // FIX: round wind speed, it can come
    // back with decimals (e.g. 13.7 km/h)

    wind.innerText =
        Math.round(
            data.current.wind_speed_10m
        ) + " km/h";


    // Weather code

    const weatherCode =
        data.current.weather_code;


    // Condition

    condition.innerText =
        getWeatherCondition(
            weatherCode
        );


    // Icon

    weatherIcon.innerText =
        getWeatherIcon(
            weatherCode
        );


    // ======================================
    // RAIN ANIMATION
    // ======================================

    if (isRainWeather(weatherCode)) {

        showRainAnimation();

    }

    else {

        hideRainAnimation();

    }


    // ======================================
    // SUNRISE / SUNSET
    // ======================================

    sunrise.innerText =
        formatTime(
            data.daily.sunrise[0]
        );


    sunset.innerText =
        formatTime(
            data.daily.sunset[0]
        );


    // ======================================
    // HOURLY FORECAST
    // ======================================

    createHourlyForecast(data);


    // ======================================
    // 7 DAY FORECAST
    // ======================================

    createDailyForecast(data);


    // Clear message

    showMessage("");

}


// ==========================================
// CHECK RAIN WEATHER
// ==========================================

function isRainWeather(code) {

    return (

        // Drizzle

        (code >= 51 && code <= 57)

        ||

        // Rain

        (code >= 61 && code <= 67)

        ||

        // Rain showers

        (code >= 80 && code <= 82)

        ||

        // Thunderstorm

        (code >= 95 && code <= 99)

    );

}


// ==========================================
// SHOW RAIN ANIMATION
// ==========================================

function showRainAnimation() {

    // Clear old drops

    rainAnimation.innerHTML = "";


    // Create 70 rain drops

    for (let i = 0; i < 70; i++) {

        const drop =
            document.createElement("span");


        drop.className =
            "rain-drop";


        // Random horizontal position

        drop.style.left =
            Math.random() * 100 + "%";


        // Random delay

        drop.style.animationDelay =
            Math.random() * 1 + "s";


        // Random speed

        drop.style.animationDuration =
            (0.5 + Math.random() * 0.6)
            + "s";


        // Random height

        drop.style.height =
            (12 + Math.random() * 12)
            + "px";


        rainAnimation.appendChild(
            drop
        );

    }


    // Show animation

    rainAnimation.style.display =
        "block";

}


// ==========================================
// HIDE RAIN ANIMATION
// ==========================================

function hideRainAnimation() {

    rainAnimation.style.display =
        "none";

    rainAnimation.innerHTML =
        "";

}


// ==========================================
// 24 HOUR FORECAST
// ==========================================

function createHourlyForecast(data) {

    // Clear old forecast

    hourlyForecast.innerHTML = "";


    // ======================================
    // FIND CURRENT HOUR FROM API TIMEZONE
    // ======================================

    const currentTime =
        data.current.time;


    let currentIndex =
        data.hourly.time.indexOf(
            currentTime
        );


    // If exact time not found,
    // find nearest hour

    if (currentIndex === -1) {

        const currentDate =
            new Date(currentTime);


        currentIndex =
            data.hourly.time.findIndex(
                function (time) {

                    return (
                        new Date(time)
                        >= currentDate
                    );

                }
            );

    }


    // FIX: findIndex also returns -1 if
    // nothing matched (e.g. current time
    // is after every hourly slot). The old
    // code treated that the same as "index
    // not found yet" and fell back to 0,
    // which silently shows hour 0 of day 1
    // instead of "now". Falling back to the
    // last available index is a safer guess
    // than jumping back to the start.

    if (currentIndex < 0) {

        currentIndex =
            Math.max(
                data.hourly.time.length - 1,
                0
            );

    }


    // ======================================
    // SHOW NEXT 24 HOURS
    // ======================================

    for (
        let i = 0;
        i < 24;
        i++
    ) {

        const index =
            currentIndex + i;


        // Stop if data finished

        if (
            index >=
            data.hourly.time.length
        ) {

            break;

        }


        const time =
            new Date(
                data.hourly.time[index]
            );


        const temp =
            Math.round(
                data.hourly
                    .temperature_2m[index]
            );


        const code =
            data.hourly
                .weather_code[index];


        // ==================================
        // CREATE CARD
        // ==================================

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "hour-card";


        card.innerHTML = `

            <p>
                ${formatHour(time)}
            </p>

            <div class="hour-icon">
                ${getWeatherIcon(code)}
            </div>

            <strong>
                ${temp}°C
            </strong>

        `;


        hourlyForecast.appendChild(
            card
        );

    }

}


// ==========================================
// 7 DAY FORECAST
// ==========================================

function createDailyForecast(data) {

    // Clear old forecast

    forecast.innerHTML = "";


    // 7 days

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(
                data.daily.time[i]
            );


        const maxTemp =
            Math.round(
                data.daily
                    .temperature_2m_max[i]
            );


        const minTemp =
            Math.round(
                data.daily
                    .temperature_2m_min[i]
            );


        const code =
            data.daily
                .weather_code[i];


        // Create card

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "forecast-card";


        card.innerHTML = `

            <p>
                ${formatDay(date)}
            </p>

            <div class="forecast-icon">
                ${getWeatherIcon(code)}
            </div>

            <p>
                ${getWeatherCondition(code)}
            </p>

            <strong>
                ${maxTemp}° / ${minTemp}°
            </strong>

        `;


        forecast.appendChild(
            card
        );

    }

}


// ==========================================
// MY LOCATION
// ==========================================

locationBtn.addEventListener(
    "click",
    function () {


        // Check browser support

        if (!navigator.geolocation) {

            showMessage(
                "Geolocation is not supported"
            );

            return;
        }


        // FIX: cancel any previous search
        // request still in flight

        if (currentController) {

            currentController.abort();

        }

        currentController =
            new AbortController();

        const { signal } =
            currentController;


        showMessage(
            "Getting your location..."
        );


        navigator.geolocation.getCurrentPosition(

            // ==================================
            // SUCCESS
            // ==================================

            async function (position) {

                const latitude =
                    position.coords.latitude;


                const longitude =
                    position.coords.longitude;


                try {

                    const location = {

                        name: "My Location",

                        country: ""

                    };


                    await loadWeather(
                        latitude,
                        longitude,
                        location,
                        signal
                    );

                }


                catch (error) {

                    if (
                        error.name ===
                        "AbortError"
                    ) {

                        return;

                    }


                    console.log(error);


                    showMessage(
                        "Location weather load nahi ho raha"
                    );

                }

            },


            // ==================================
            // ERROR
            // ==================================

            function (error) {

                console.log(error);


                showMessage(
                    "Location permission allow karo"
                );

            }

        );

    }
);


// ==========================================
// DARK MODE
// ==========================================

darkModeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );


        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            darkModeBtn.innerText =
                "☀️ Light Mode";

        }

        else {

            darkModeBtn.innerText =
                "🌙 Dark Mode";

        }

    }
);


// ==========================================
// WEATHER CONDITION
// ==========================================

function getWeatherCondition(code) {

    if (code === 0) {

        return "Clear Sky";

    }


    if (
        code === 1 ||
        code === 2
    ) {

        return "Partly Cloudy";

    }


    if (code === 3) {

        return "Cloudy";

    }


    if (
        code === 45 ||
        code === 48
    ) {

        return "Foggy";

    }


    if (
        code >= 51 &&
        code <= 57
    ) {

        return "Drizzle";

    }


    if (
        code >= 61 &&
        code <= 67
    ) {

        return "Rainy";

    }


    if (
        code >= 71 &&
        code <= 77
    ) {

        return "Snowy";

    }


    if (
        code >= 80 &&
        code <= 82
    ) {

        return "Rain Showers";

    }


    if (
        code >= 95 &&
        code <= 99
    ) {

        return "Thunderstorm";

    }


    return "Unknown";

}


// ==========================================
// WEATHER ICON
// ==========================================

function getWeatherIcon(code) {

    if (code === 0) {

        return "☀️";

    }


    if (
        code === 1 ||
        code === 2
    ) {

        return "🌤️";

    }


    if (code === 3) {

        return "☁️";

    }


    if (
        code === 45 ||
        code === 48
    ) {

        return "🌫️";

    }


    if (
        code >= 51 &&
        code <= 67
    ) {

        return "🌧️";

    }


    if (
        code >= 71 &&
        code <= 77
    ) {

        return "❄️";

    }


    if (
        code >= 80 &&
        code <= 82
    ) {

        return "🌦️";

    }


    if (
        code >= 95 &&
        code <= 99
    ) {

        return "⛈️";

    }


    return "🌤️";

}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(dateTime) {

    const date =
        new Date(dateTime);


    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ==========================================
// FORMAT HOUR
// ==========================================

function formatHour(date) {

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ==========================================
// FORMAT DAY
// ==========================================

function formatDay(date) {

    return date.toLocaleDateString(
        [],
        {
            weekday: "short"
        }
    );

}


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(text) {

    message.innerText =
        text;

}