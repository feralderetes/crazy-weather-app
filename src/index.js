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

function updateWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = Math.round(response.data.temperature.current);
  let cityElement = document.querySelector("#city");
  let countryElement = document.querySelector("#country");
  let conditionElement = document.querySelector("#condition");
  let feelsLikeElement = document.querySelector("#feels-like");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let airPressureElement = document.querySelector("#air-pressure");
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  let icon = document.querySelector("#icon");

  temperatureElement.innerHTML = temperature;
  cityElement.innerHTML = `${response.data.city},`;
  countryElement.innerHTML = `${response.data.country}`;
  conditionElement.innerHTML = response.data.condition.description;
  feelsLikeElement.innerHTML = `${response.data.temperature.feels_like}°`;
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
  getForecast(response.data.city);
}

function searchCity(city) {
  let apiKey = "4a6baff0aba2ofc3b32f2f5atce330d1";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  searchCity(searchInput.value);
  searchInput.value = "";
}

function getForecast(city) {
  let apiKey = "4a6baff0aba2ofc3b32f2f5atce330d1";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${formatDay(day.time)}</div>
        <div><img src="${
          day.condition.icon_url
        }" class="weather-forecast-icon" /></div>
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max">${Math.round(
            day.temperature.maximum
          )}°</span>
          <span class="weather-forecast-temperature-min">${Math.round(
            day.temperature.minimum
          )}°</span>
        </div>
      </div>
    `;
    }
  });
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Berlin");
