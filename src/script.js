let citySearch = document.querySelector("#form");
let buttonCurrent = document.querySelector("#button-current");
let speed = document.querySelector("#wind-speed");
let celcius = document.querySelector("#celcius");
let fahrenheit = document.querySelector("#fahrenheit");
let units = "metric";
let cityForUnits;

buttonCurrent.addEventListener("click", getLocation);
fahrenheit.addEventListener("click", convertToFahrenheit);
celcius.addEventListener("click", showCelcius);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let city = document.querySelector("#city-search");
  searchCity(city.value);
  clearInputField(city);
});

function clearInputField(city) {
  city.value = "";
}

function showDate(datestamp) {
  let date = new Date(datestamp);

  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = weekDays[date.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December ",
  ];
  let month = months[date.getMonth()];
  let dayNumber = date.getDate();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + date.getMinutes();
  }
  let hours = date.getHours();
  if (hours < 10) {
    hours = "0" + date.getHours();
  }
  let time = `${hours}:${minutes}`;

  return `${month} ${dayNumber}, ${day}, ${time}`;
}

function showDay(datestamp) {
  let day = new Date(datestamp * 1000);
  let week = ["SUN", "MON", "TUE", "WEN", "THU", "FRI", "SAT"];
  let dayNumber = week[day.getDay()];
  return dayNumber;
}

function searchCity(city) {
  let apiKey = "f28953e2adf95c39204b733667598ea9";
  let link = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(link).then(showTemperature);
}

// Output weather values from api
function showTemperature(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#weather-describe").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#max").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#min").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#last-update-date").innerHTML = showDate(
    response.data.dt * 1000
  );
  cityForUnits = response.data.name;
  forecastApi(response.data.coord);
  showIcons(response.data);
}
//api for forecast
function forecastApi(response) {
  let lon = response.lon;
  let lat = response.lat;
  let apiKey = "f28953e2adf95c39204b733667598ea9";
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&daily={part}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(futureForecast);
}
//forecast
function futureForecast(response) {
  let days = response.data.daily;
  days.shift();
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row text-center">`;
  days.forEach(function (day, index) {
    if (index < 5) {
      forecastHTML += ` <div class="col mb-3 mb-sm-0">
            <ul class="text-center px-1">
              <li class="fw-bold mb-2">${showDay(day.dt)}</li>
              <li>
                <img class="mb-2"
                src="${changeIcons(day.weather[0].icon)}" 
                alt="${day.weather[0].description}" 
                height="50" 
                width="50" 
                id="forecast-icon" />
              </li>
              <li class="fs-5">${Math.round(day.temp.day)}&#186;</li>
              <li>${Math.round(day.temp.night)}&#186;</li>
            </ul>
          </div>
          `;
    }
  });
  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//Main icon and alt replacement
function showIcons(response) {
  let icon = document.querySelector("#icon-main");
  let weatherDescription = response.weather[0].description;
  let iconInfo = response.weather[0].icon;
  icon.setAttribute("src", changeIcons(iconInfo));
  icon.setAttribute("alt", weatherDescription);
}

//Replacing the icon in html depending on the weather description
function changeIcons(response) {
  let iconWay = "";
  switch (response) {
    case "01d":
      iconWay = "images/sun.svg";
      break;
    case "01n":
      iconWay = "images/moon.svg";
      break;
    case "02d":
    case "03d":
    case "04d":
      iconWay = "images/clouds.svg";
      break;
    case "02n":
    case "03n":
    case "04n":
      iconWay = "images/moon-clouds.svg";
      break;
    case "09d":
    case "09n":
    case "10d":
    case "10n":
      iconWay = "images/rain.svg";
      break;
    case "11d":
    case "11n":
      iconWay = "images/thunderstorm.svg";
      break;
    case "13d":
    case "13n":
      iconWay = "images/snow.svg";
      break;
    case "50d":
    case "50n":
      iconWay = "images/mist.svg";
      break;
    default:
      iconWay = "images/mist.svg";
  }
  return iconWay;
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(currentPosition);
  function currentPosition(response) {
    let lat = response.coords.latitude;
    let lon = response.coords.longitude;
    let apiKey = "f28953e2adf95c39204b733667598ea9";
    let link = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    axios.get(link).then(getCity);
    axios.get(link).then(showTemperature);
  }
}

//Takes the name of the city from the api and displays in html
function getCity(response) {
  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;
}

function showCelcius(event) {
  event.preventDefault();
  celcius.classList.add("active");
  fahrenheit.classList.remove("active");
  units = "metric";
  speed.innerHTML = " m/s";
  searchCity(cityForUnits);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  celcius.classList.remove("active");
  fahrenheit.classList.add("active");
  units = "imperial";
  speed.innerHTML = " m/h";
  searchCity(cityForUnits);
}

searchCity("Dnipro");
