function WeekDays(date) {
  let weekDays = [
    "Sunday,",
    "Monday,",
    "Tuesday,",
    "Wednesday,",
    "Thursday,",
    "Friday,",
    "Saturday,",
  ];
  let currentDay = document.querySelector("#current-day");
  let day = weekDays[date.getDay()];
  currentDay.innerHTML = day;
}

function months(date) {
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

  let currentMonth = document.querySelector("#current-month");
  let month = months[date.getMonth()];
  currentMonth.innerHTML = month;
}

function dayNumber(date) {
  let currentDayNumber = document.querySelector("#current-day-number");
  let day = date.getDate();
  currentDayNumber.innerHTML = `${day},`;
}

function time(date) {
  let timeOption = document.querySelector("#current-time");
  let minutes = date.getMinutes();
  let hours = date.getHours();
  if (minutes < 10) {
    minutes = "0" + date.getMinutes();
  }
  let time = `${hours}:${minutes}`;
  timeOption.innerHTML = time;
  return time;
}

let date = new Date();
WeekDays(date);
months(date);
dayNumber(date);
time(date);

function citySearch(city) {
  let apiKey = "f28953e2adf95c39204b733667598ea9";
  let link = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(link).then(showTemperature);
}

function cityInput(event) {
  event.preventDefault();
  let city = document.querySelector("#city-search").value;
  citySearch(city);
}

let citySearchButton = document.querySelector("#button-search");
citySearchButton.addEventListener("click", cityInput);
let writeCity = document.querySelector("#city-search");
writeCity.addEventListener("search", cityInput);

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
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(currentPosition);
  function currentPosition(response) {
    let lat = response.coords.latitude;
    let lon = response.coords.longitude;

    let apiKey = "f28953e2adf95c39204b733667598ea9";
    let link = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios.get(link).then(getCity);
    axios.get(link).then(showTemperature);
  }
}

function getCity(response) {
  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;
}

let buttonCurrent = document.querySelector("#button-current");
buttonCurrent.addEventListener("click", getLocation);

citySearch("Dnipro");

/*let celcius = document.querySelector("#celcius");
let fahrenheit = document.querySelector("#fahrenheit");
let formulaFahrenheit = Math.round(currentTemperature.innerHTML * 1.8 + 32);

function convertToFahrenheit() {
  currentTemperature.innerHTML = formulaFahrenheit;
}

function celciusShow() {
  currentTemperature.innerHTML;
}

fahrenheit.addEventListener("click", convertToFahrenheit);
celcius.addEventListener("click", celciusShow);
*/
