function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function setBackgroundImage(response) {
  let background = document.querySelector("body");
  let condition = response.data.condition.icon;
  if (
    condition === "clear-sky-day" ||
    condition === "few-clouds-day" ||
    condition === "clear-sky-night" ||
    condition === "few-clouds-night"
  ) {
    background.setAttribute(
      `style`,
      `background-image: url("src/images/clear-sky.jpg");`
    );
  } else if (
    condition === "scattered-clouds-day" ||
    condition === "broken-clouds-day" ||
    condition === "scattered-clouds-night" ||
    condition === "broken-clouds-night"
  ) {
    background.setAttribute(
      `style`,
      `background-image: url("src/images/clouds.jpg");
       background-size: cover;`
    );
  } else if (
    condition === "thunderstorm-day" ||
    condition === "thunderstorm-night"
  ) {
    background.setAttribute(
      `style`,
      `background-image: url("src/images/thunderstorm.jpg");`
    );
  } else if (condition === "snow-day" || condition === "snow-night") {
    background.setAttribute(
      `style`,
      `background-image: url("src/images/snow.jpg");`
    );
  } else if (condition === "mist-day" || condition === "mist-night") {
    background.setAttribute(
      `style`,
      `background-image: url("src/images/mist.jpg");`
    );
  } else {
    background.setAttribute(
      `style`,
      `background-image: url("src/images/Umbrellas.jpg");`
    );
  }
}

// changes temp from celsius to fahrenheit
function convertToFahrenheit(event) {
  event.preventDefault();
  units = "fahrenheit";
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  temperatureElement.innerHTML = convertTemperature(units, celsiusTemperature);

  feelsLikeElement.innerHTML = `${convertTemperature(
    units,
    celsiusFeelsLike
  )}°`;

  displayForecast();
}

// changes temp from fahrenheit to celsius
function convertToCelsius(event) {
  event.preventDefault();
  units = "celsius";
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = celsiusTemperature;
  feelsLikeElement.innerHTML = `${celsiusFeelsLike}°`;
  displayForecast();
}

// degree conversion: celsius vs. fahrenheit
function convertTemperature(unit, temperature) {
  if (unit === "fahrenheit") {
    return Math.round((temperature * 9) / 5 + 32);
  } else {
    return Math.round(temperature);
  }
}

function displayForecast() {
  let forecastElement = document.querySelector("#forecast");
  let forecastHtml = "";

  forecastResponse.forEach(function (day, index) {
    if (index > 0 && index < 6) {
      forecastHtml =
        forecastHtml +
        `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${formatDay(day.time)}</div>
        <div><img src="${
          day.condition.icon_url
        }" class="weather-forecast-icon" /></div>
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max">${convertTemperature(
            units,
            day.temperature.maximum
          )}°</span>
          <span class="weather-forecast-temperature-min">${convertTemperature(
            units,
            day.temperature.minimum
          )}°</span>
        </div>
      </div>
    `;
    }
  });
  forecastElement.innerHTML = forecastHtml;
}

function updateForecast(response) {
  forecastResponse = response.data.daily;
  displayForecast();
}

function getForecast(city) {
  let apiUrl = `${baseUrl}forecast?query=${city}&key=${apiKey}`;
  axios.get(apiUrl).then(updateForecast);
}

function updateCurrentWeather(response) {
  let cityElement = document.querySelector("#city");
  let countryElement = document.querySelector("#country");
  let conditionElement = document.querySelector("#condition");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let airPressureElement = document.querySelector("#air-pressure");
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  let icon = document.querySelector("#icon");

  celsiusTemperature = Math.round(response.data.temperature.current);
  temperatureElement.innerHTML = celsiusTemperature;
  cityElement.innerHTML = `${response.data.city},`;
  countryElement.innerHTML = `${response.data.country}`;
  conditionElement.innerHTML = response.data.condition.description;
  celsiusFeelsLike = Math.round(response.data.temperature.feels_like);
  feelsLikeElement.innerHTML = `${celsiusFeelsLike}°`;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed} km/h`;
  airPressureElement.innerHTML = `${response.data.temperature.pressure} hPa`;
  timeElement.innerHTML = formatDate(date);
  icon.innerHTML = `
    <img
      src="${response.data.condition.icon_url}"
      class="weather-temperature-icon"
    />
  `;
  setBackgroundImage(response);
  getForecast(response.data.city);
}

function searchCity(city) {
  let apiUrl = `${baseUrl}current?query=${city}&key=${apiKey}`;
  axios.get(apiUrl).then(updateCurrentWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  searchCity(searchInput.value);
  searchInput.value = "";
}

// Degrees unit conversion events
let celsiusTemperature = null;
let celsiusFeelsLike = null;

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", convertToCelsius);

// Global variables
let city = null;
let units = "metric";
let apiKey = "4a6baff0aba2ofc3b32f2f5atce330d1";
let baseUrl = "https://api.shecodes.io/weather/v1/";
let forecastResponse = null;
let temperatureElement = document.querySelector("#temperature");
let feelsLikeElement = document.querySelector("#feels-like");

// Search submit event
let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

// Default city for start
searchCity("Berlin");
