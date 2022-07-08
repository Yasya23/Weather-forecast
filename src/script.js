//last updated date
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

function citySearch(city) {
  let apiKey = "f28953e2adf95c39204b733667598ea9";
  let link = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(link).then(showTemperature);
}

function cityInput(event) {
  event.preventDefault();
  let city = document.querySelector("#city-search").value;
  citySearch(city);
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
  document.querySelector("#wind").innerHTML = response.data.wind.speed;
  document.querySelector("#last-update-date").innerHTML = showDate(
    response.data.dt * 1000
  );
  cityForUnitsCovert = response.data.name;
  console.log(cityForUnitsCovert);
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
  let forecastHTML = `<div class="row">`;
  days.forEach(function (day, index) {
    if (index < 5) {
      forecastHTML += ` <div class="col">
            <ul class="future-forecast">
              <li class="day-of-the-week">${showDay(day.dt)}</li>
              <li>
                <img src="${changeIcons(
                  day.weather[0].main
                )}" alt="" height="50" width="50" class="forecast-icon" id="forecast-icon" />
              </li>
              <li class="day-temperature">${Math.round(day.temp.day)}°</li>
              <li class="night-temperature">${Math.round(day.temp.night)}°</li>
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
  let info = response.weather[0].main;
  let icon = document.querySelector("#icon-main");
  icon.setAttribute("src", changeIcons(info));
  icon.setAttribute("alt", info);
}

//Replacing the icon in html depending on the weather description
function changeIcons(response) {
  let iconWay = "";
  switch (response) {
    case "Thunderstorm":
      iconWay = "images/thunderstorm.svg";
      break;
    case "Drizzle":
      iconWay = "images/rain.svg";
      break;
    case "Rain":
      iconWay = "images/rain.svg";
      break;
    case "Snow":
      iconWay = "images/snow.svg";
      break;
    case "Atmosphere":
      iconWay = "images/mist.svg";
      break;
    case "Clear":
      iconWay = "images/sun.svg";
      break;
    case "Clouds":
      iconWay = "images/clouds.svg";
      break;
    default:
      iconWay = "images/mist.svg";
  }
  return iconWay;
}

/* 
Finding your current location
*/
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

function celciusShow(event) {
  event.preventDefault();
  celcius.classList.add("active");
  fahrenheit.classList.remove("active");
  units = "metric";
  citySearch(cityForUnitsCovert);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  celcius.classList.remove("active");
  fahrenheit.classList.add("active");
  units = "imperial";
  citySearch(cityForUnitsCovert);
}

let citySearchButton = document.querySelector("#button-search");
citySearchButton.addEventListener("click", cityInput);
let writeCity = document.querySelector("#city-search");
writeCity.addEventListener("search", cityInput);

let buttonCurrent = document.querySelector("#button-current");
buttonCurrent.addEventListener("click", getLocation);

let units = "metric";
let cityForUnitsCovert;
let celcius = document.querySelector("#celcius");
let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", convertToFahrenheit);
celcius.addEventListener("click", celciusShow);

citySearch("Dnipro");
