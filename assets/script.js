const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardDiv = document.querySelector(".weather-cards");
const historyDiv = document.querySelector(".history-container");
const cityArray = [];

const API_KEY = "b4bd10788309c5e5ac67d594c745e76f"; // API key from OpenWeatherMap API keys

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

const getSearchHistory = (searchHistory) => {
  const btn = document.createElement("button");
  btn.setAttribute("class", "button");
  btn.setAttribute("value", searchHistory);
  btn.textContent = searchHistory;
  historyDiv.append(btn);
};

for (let i = 0; i < searchHistory.length; i++) {
  getSearchHistory(searchHistory[i]);
}

const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    // Main weather card.
    return ` <div class="details">
             <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
             <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(
               2
             )}°C</h4>
             <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
             <h4> Humidity: ${weatherItem.main.humidity} %</h4>
        </div>
        <div class="icon">
        <img src="https://openweathermap.org/img/wn/${
          weatherItem.weather[0].icon
        }@4x.png" alt="weather-icon"/>
            <h4>${weatherItem.weather[0].description}</h4>
        </div>`;
  } else {
    // Five day weather forecast card.
    return `<li class="card">
              <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
             <img src="https://openweathermap.org/img/wn/${
               weatherItem.weather[0].icon
             }@2x.png" alt="weather-icon"/>
             <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)} °C</h4>
             <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
             <h4> Humidity: ${weatherItem.main.humidity} %</h4>
          </li>`;
  }
};

const getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      // Unique filter to get only one forecast per day.
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      // Clear previous weather data
      cityInput.value = "";
      currentWeatherDiv.innerHTML = "";
      weatherCardDiv.innerHTML = "";

      // Created weather cards added to the DOM.
      fiveDaysForecast.forEach((weatherItem, index) => {
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherItem, index)
          );
        } else {
          weatherCardDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherItem, index)
          );
        }
      });
    })
    .catch(() => {
      alert("An error ocuured while fetching the weather forecast!");
    });
};
const getCityCoordinates = (cityName) => {
  const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;

  // We get the input city coordinates from the API.
  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("An error ocuured while fetching the coordinates!");
    });
};

const storage = (city) => {
  searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!cityArray.includes(city)) {
    cityArray.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(cityArray));
    getSearchHistory(city);
  }
};

// Function to get the recent searches

function handleInputChange(event) {
  const inputValue = event.target.value;
  console.log("Input Value:", inputValue);
}

searchButton.addEventListener("click", () => {
  const cityName = cityInput.value.trim(); // User enters the city name.
  if (!cityName) return; // Return if cityName is empty or not found.
  getCityCoordinates(cityName);
  storage(cityName);
});

historyDiv.addEventListener("click", (e) => {
  e.preventDefault();
  const cityClick = this.event.target.value;
  getCityCoordinates(cityClick);
});
