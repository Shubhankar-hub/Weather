const apiKey = '1ae6b98bddae4b039cc61313252704'; // Your WeatherAPI Key

// Function to fetch city suggestions as the user types
async function showSuggestions() {
    const input = document.getElementById('cityInput').value;
    const suggestionsList = document.getElementById('suggestions');

    // If input is empty, clear suggestions and return
    if (input.length === 0) {
        suggestionsList.innerHTML = '';
        return;
    }

    const apiUrl = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${input}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Clear any existing suggestions
        suggestionsList.innerHTML = '';

        // Check if there are any results
        if (data.length === 0) {
            return;
        }

        // Create list of suggestions
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name}, ${item.country}`;
            li.classList.add('suggestion-item');
            li.onclick = () => selectCity(item.name); // Select city when clicked
            suggestionsList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
}

// Function to select a city and redirect to weather details page
function selectCity(city) {
    window.location.href = `weather.html?city=${city}`;
}

// Function to get weather details based on the city (button click or enter key)
async function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (city) {
        window.location.href = `weather.html?city=${city}`;
    }
}

// Function to fetch and display weather details for the selected city (for weather.html)
async function getWeatherDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const cityName = urlParams.get("city"); // Get the city name from the URL
    
    if (cityName) {
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}&aqi=no`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Check if the city is found
            if (data.error) {
                document.getElementById("weatherDetails").innerHTML = `<p>City not found. Please try again with a valid city name. ❌</p>`;
                return;
            }

            // Display weather details
            const weatherContent = `
                <h3>Weather Details for ${data.location.name}, ${data.location.country} 🌍</h3>
                <p><strong>Temperature:</strong> ${data.current.temp_c}°C / ${data.current.temp_f}°F 🌡️</p>
                <p><strong>Condition:</strong> ${data.current.condition.text} 🌤️</p>
                <p><strong>Humidity:</strong> ${data.current.humidity}% 💧</p>
                <p><strong>Wind Speed:</strong> ${data.current.wind_kph} km/h 💨</p>
                <p><strong>Feels Like:</strong> ${data.current.feelslike_c}°C / ${data.current.feelslike_f}°F 🌡️</p>
                <p><strong>Last Updated:</strong> ${data.current.last_updated}</p>
            `;

            document.getElementById("weatherDetails").innerHTML = weatherContent;
        } catch (error) {
            console.log("Error fetching weather details:", error);
            document.getElementById("weatherDetails").innerHTML = `<p>There was an error retrieving the weather details. Please try again. ❌</p>`;
        }
    } else {
        document.getElementById("weatherDetails").innerHTML = `<p>No city specified. Please go back and select a city. ❌</p>`;
    }
}

// Call the function to fetch weather details when the page loads
if (window.location.pathname.includes('weather.html')) {
    window.onload = getWeatherDetails;
}
