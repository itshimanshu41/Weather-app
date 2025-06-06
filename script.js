const apiKey = "8c97ff7f547400be567bebd20e89d9e7"; // Your valid OpenWeatherMap API key

// Theme toggle
document.getElementById("themeToggle").addEventListener("change", function() {
    document.body.classList.toggle("dark");
});

// Fetch weather by city name
async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const resultDiv = document.getElementById("weatherResult");

    if (!city) {
        resultDiv.innerHTML = "⚠️ Please enter a city name.";
        return;
    }

    fetchWeather(`q=${city}`);
}

// Fetch weather by current location
async function getLocationWeather() {
    const resultDiv = document.getElementById("weatherResult");

    if (!navigator.geolocation) {
        resultDiv.innerHTML = "❌ Geolocation is not supported by this browser.";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(`lat=${latitude}&lon=${longitude}`);
        },
        () => {
            resultDiv.innerHTML = "❌ Location access denied.";
        }
    );
}

// Common weather fetch logic
async function fetchWeather(query) {
    const resultDiv = document.getElementById("weatherResult");
    resultDiv.innerHTML = "⏳ Fetching weather data...";

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        if (data.cod !== 200) {
            resultDiv.innerHTML = `❌ Error: ${data.message}`;
            return;
        }

        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        resultDiv.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <img src="${iconUrl}" alt="Weather icon" />
            <p><strong>🌡 Temperature:</strong> ${data.main.temp}°C</p>
            <p><strong>🌥 Weather:</strong> ${data.weather[0].description}</p>
            <p><strong>💧 Humidity:</strong> ${data.main.humidity}%</p>
            <p><strong>💨 Wind Speed:</strong> ${data.wind.speed} m/s</p>
        `;
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = "❌ Error fetching data. Please try again later.";
    }
}