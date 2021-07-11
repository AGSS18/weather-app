function dropDown() {
  document.getElementById("favorites").classList.toggle("active");
}

document.getElementById("plus-icon").addEventListener("click", dropDown);

let newDate = null;
let roundMainTemp = null;
let actualDay = null;
let actualDays = null;
let actualMonth = null;
let actualMonths = null;
let actualYear = null;
let actualDate = null;
let actualHour = null;
let actualMinutes = null;

let multipleConditions = [
  "Mist",
  "Smoke",
  "Haze",
  "Dust",
  "Fog",
  "Sand",
  "Ash",
  "Squal",
  "Tornado"];

let otherConditions = [
  "Clear",
  "Clouds",
  "Snow",
  "Drizzle",
  "Rain"];

let otherConditionsIcons = [
  `<i class="fas fa-sun"></i>`,
  `<i class="fas fa-cloud"></i>`,
  `<i class="fas fa-snowflake"></i>`,
  `<i class="fas fa-cloud-showers-heavy"></i>`,
  `<i class="fas fa-cloud-rain"></i>`];

function temporaryInfo(response) {
  let resetUnits = document.querySelectorAll(".units");
  for (let i = 0; i < resetUnits.length; i++) {
    resetUnits[i].innerHTML = "C";
  }
  let tempElement = document.querySelector("#main-temp");
  let cityElement = document.querySelector("#city");
  let windElement = document.querySelector(".main-wind");
  let humidityElement = document.querySelector(".humidity");
  let descriptionElement = document.querySelector(".condition");
  let timeElement = document.querySelector(".main-day");
  let iconElement = document.querySelector(".icon-temp");

  celsiusTemp = response.data.main.temp;

  tempElement.innerHTML = Math.round(celsiusTemp);
  cityElement.innerHTML = response.data.name;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  humidityElement.innerHTML = response.data.main.humidity;
  descriptionElement.innerHTML = response.data.weather[0].description;
  timeElement.innerHTML = updateMainTime(response.data.dt * 1000);
  iconElement.innerHTML = updateMainIcon(response.data.weather[0].main);
}

function updateMainTime(syncDate) {
  newDate = new Date(syncDate);
  actualYear = newDate.getFullYear();
  actualDate = newDate.getDate();
  actualHour = newDate.getHours();
  actualMinutes = newDate.getMinutes();

  if (actualHour < 10) {
    actualHour = `0${actualHour}`;
  }
  if (actualMinutes < 10) {
    actualMinutes = `0${actualMinutes}`;
  }

  let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let yearMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Dicember"];
  actualDay = weekDays[newDate.getDay()];
  actualMonth = yearMonths[newDate.getMonth()];
  updateOtherDays(newDate.getDay());
  return `${actualDay}, ${actualMonth} ${actualDate} ${actualYear}, ${actualHour}:${actualMinutes}`;
}

function updateMainIcon(response) {
  if (multipleConditions.includes(response)) {
    return `<i class="fas fa-smog"></i>`;
  } else {
    if (otherConditions.includes(response)) {
      let position = otherConditions.indexOf(response);
      return otherConditionsIcons[position];
    }
  }
}

function searchCity(city) {
  let apiCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiCityUrl).then(temporaryInfo);
}

function searchForm(event) {
  event.preventDefault();
  let valueSearch = document.querySelector("#search-city");
  searchCity(valueSearch.value);
}

function changeUnits(event) {
  event.preventDefault();
  let actualUnits = document.querySelector("#principal-unit").innerHTML;
  if (actualUnits === "C") {
    let unitsElements = document.querySelectorAll(".units");
    for (let i = 0; i < unitsElements.length; i++) {
      unitsElements[i].innerHTML = "F";
    }
    let tempElements = document.querySelectorAll(".temperature");
    celsiusOperation = Math.round((celsiusTemp * 9 / 5) + 32);
    tempElements.innerHTML = celsiusOperation;
  } else {
    let unitsElements = document.querySelectorAll(".units");
    for (let i = 0; i < unitsElements.length; i++) {
      unitsElements[i].innerHTML = "C";
    }
    let tempElements = document.querySelectorAll(".temperature");
    let fahrenheitOperation = Math.round((celsiusOperation - 32) * 5 / 9);
    tempElements.innerHTML = fahrenheitOperation;
  }
}

function updateOtherDays(day) {
  let allDays = document.querySelectorAll(".days");
  for (let i = 0; i < allDays.length; i++) {
    day = day + 1;
    if (day === 7) {
      day = 0;
    }
    let shortDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    allDays[i].innerHTML = shortDays[day];
  }
  return
}

function showCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiPositionUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiPositionUrl).then(resp => {
    city = resp.data.name;
    searchCity(city);
  });
}

let apiKey = `2a2676887289368652de121a9db03637`;

let celsiusTemp = null;
let celsiusOperation = null;

let linkUnitsChange = document.querySelector("#principal-unit");
linkUnitsChange.addEventListener("click", changeUnits);

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchForm);

let clickCurrentLocation = document.querySelector("#location-button");
clickCurrentLocation.addEventListener("click", showCurrentPosition);

searchCity("Monterrey");