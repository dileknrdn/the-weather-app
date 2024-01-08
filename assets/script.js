const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");

const API_KEY = "b4bd10788309c5e5ac67d594c745e76f"; // API key from OpenWeatherMap API keys

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

      console.log(fiveDaysForecast);
    })
    .catch(() => {
      alert("An error ocuured while fetching the weather forecast!");
    });
};
const getCityCoordinates = () => {
  const cityName = cityInput.value.trim(); // User enters the city name.
  if (!cityName) return; // Return if cityName is empty or not found.

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

searchButton.addEventListener("click", getCityCoordinates);
