function dropDown() {
  document.getElementById("favorites").classList.toggle("active");
}

document.getElementById("plus-icon").addEventListener("click", dropDown);

let city = "Monterrey";


let newDate = null; //actualizado
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


//let refreshDate = updateMainTime(newDate);

function updateOtherDays() {
  let otherActualDay = newDate.getDay();
  let allDays = document.querySelectorAll(".days");
  for (let i = 0; i < allDays.length; i++) {
    otherActualDay = otherActualDay + 1;
    if (otherActualDay === 7) {
      otherActualDay = 0;
    }
    let shortDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    allDays[i].innerHTML = shortDays[otherActualDay];
  }
}

function searchForm(Event) {
  Event.preventDefault();
  let valueSearch = document.querySelector("#search-city");
  city = valueSearch.value;
  let updateCity = document.querySelector("#city");
  updateCity.innerHTML = city;
  //apiCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}&units=metric`;
  //axios.get(apiCityUrl).then(showWeather);
  showWeather();
}

let onlyForm = document.querySelector("#search-form");
onlyForm.addEventListener("submit", searchForm);

function changeUnits() {
  let actualUnits = document.querySelector("#principal-unit").innerHTML;
  if (actualUnits === "C") {
    let unitsElements = document.querySelectorAll(".units");
    for (let i = 0; i < unitsElements.length; i++) {
      unitsElements[i].innerHTML = "F";
    }
    let tempElements = document.querySelectorAll(".temperature");
    for (let i = 0; i < tempElements.length; i++) {
      let operation = Math.round((tempElements[i].innerHTML * 9 / 5) + 32);
      tempElements[i].innerHTML = operation;
    }
  } else {
    let unitsElements = document.querySelectorAll(".units");
    for (let i = 0; i < unitsElements.length; i++) {
      unitsElements[i].innerHTML = "C";
    }
    let tempElements = document.querySelectorAll(".temperature");
    for (let i = 0; i < tempElements.length; i++) {
      let operation = Math.round((tempElements[i].innerHTML - 32) * 5 / 9);
      tempElements[i].innerHTML = operation;
    }
  }
}

function showCurrentTemp() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiPositionUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiPositionUrl).then(resp => {
    let place = resp.data.name;
    let currentPlace = document.querySelector("#city");
    currentPlace.innerHTML = place;
    showWeather(resp);
  });
}

function showWeather(response) {
  console.log(city);
  console.log(response);
  let resetUnits = document.querySelectorAll(".units");
  for (let i = 0; i < resetUnits.length; i++) {
    resetUnits[i].innerHTML = "C";
  }
  //let latitud = response.data.coord.lat;
  //let longitude = response.data.coord.lon;
  roundMainTemp = Math.round(response.data.main.temp);
  let description = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let wind = Math.round(response.data.wind.speed);
  let condition = response.data.weather[0].main;
  let weatherDescription = document.querySelector(".condition");
  let mainTemp = document.querySelector("#main-temp");
  let currentHumidity = document.querySelector(".humidity");
  let currentWind = document.querySelector(".main-wind");
  weatherDescription.innerHTML = description;
  mainTemp.innerHTML = roundMainTemp;
  currentHumidity.innerHTML = humidity;
  currentWind.innerHTML = wind;
  //updateMainIcon(condition, latitud, longitude);
}

function updateMainIcon(response, lat, lon) {
  let mainCondition = response;
  if (multipleConditions.includes(mainCondition)) {
    let changeIcon = document.querySelector(".icon-temp");
    changeIcon.innerHTML = `<i class="fas fa-smog"></i>`;
  } else {
    if (otherConditions.includes(mainCondition)) {
      let position = otherConditions.indexOf(mainCondition);
      let changeIcon = document.querySelector(".icon-temp");
      changeIcon.innerHTML = otherConditionsIcons[position];
    }
  }
  getSixDayUrl(lat, lon);
}

function getSixDayUrl(lat, lon) {
  let sixDaysUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${apiKey}&units=metric`;
  axios.get(sixDaysUrl).then(resp => {
    showSixDayTemp(resp);
  });
}

function showSixDayTemp(response) {
  let firstDay = newDate.getDay();
  let allTemps = document.querySelectorAll(".all-temps");
  let changeIcons = document.querySelectorAll(".other-icons");
  let iconPosition;
  let iconsConditions;
  for (let i = 0; i < allTemps.length; i++) {
    if (firstDay < 6) {
      firstDay = firstDay + 1;
    } else {
      firstDay = 0;
    }
    allTemps[i].innerHTML = Math.round(response.data.daily[firstDay].temp.day);
    iconsConditions = response.data.daily[firstDay].weather[0].main;
    if (multipleConditions.includes(iconsConditions)) {
      changeIcons[i].innerHTML = `<i class="fas fa-smog"></i>`;
    } else {
      if (otherConditions.includes(iconsConditions)) {
        iconPosition = otherConditions.indexOf(iconsConditions);
        changeIcons[i].innerHTML = otherConditionsIcons[iconPosition];
      }
    }
  }
}

//
function temporaryInfo(response) {
  let tempElement = document.querySelector("#main-temp");
  let cityElement = document.querySelector("#city");
  let windElement = document.querySelector(".main-wind");
  let humidityElement = document.querySelector(".humidity");
  let descriptionElement = document.querySelector(".condition");
  let timeElement = document.querySelector("#principal-date");
  tempElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  humidityElement.innerHTML = response.data.main.humidity;
  descriptionElement.innerHTML = response.data.weather[0].description;
  timeElement.innerHTML = updateMainTime(/*response.data.dt * 1000*/);
}

function updateMainTime(/*syncDate*/) {
  newDate = new Date(/*syncDate*/);
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
  return `${actualDay}, ${actualMonth} ${actualDate} ${actualYear}, ${actualHour}:${actualMinutes}`;
  //updateOtherDays();
}

let clickCelsius = document.querySelector("#principal-unit");

clickCelsius.addEventListener("click", changeUnits);

let clickCurrentLocation = document.querySelector("#location-button");
clickCurrentLocation.addEventListener("click", showCurrentTemp);

let apiKey = `2a2676887289368652de121a9db03637`;
let apiCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

axios.get(apiCityUrl).then(temporaryInfo);