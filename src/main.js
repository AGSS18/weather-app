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

let multipleConditionsImages = [`url("../media/mist.jpg")`, `url("../media/mist-2.jpg")`, `url("../media/mist-3.jfif")`, `url("../media/mist-4.jfif")`, `url("../media/mist-5.jfif")`];

let otherConditions = [
  "Clear",
  "Clouds",
  "Thunderstorm",
  "Snow",
  "Drizzle",
  "Rain"];

let otherConditionsImages = {
  "Clear" : [`url("../media/sunny.jpg")`, `url("../media/sunny_2.jfif")`, `url("../media/sunny_3.jfif")`, `url("../media/sunny_4.jfif")`, `url("../media/sunny_5.jfif")`],

  "Clouds" : [`url("../media/cloud.jpg")`, `url("../media/cloud_2.jfif")`, `url("../media/cloud_3.jfif")`, `url("../media/cloud_4.jfif")`, `url("../media/cloud_5.jfif")`],

  "Thunderstorm" : [`url("../media/thunder.jfif")`, `url("../media/thunder_2.jfif")`, `url("../media/thunder_3.jfif")`, `url("../media/thunder_4.jfif")`, `url("../media/thunder_5.jfif")`],

  "Snow" : [`url("../media/snowy.jpeg")`, `url("../media/snowy_2.jfif")`, `url("../media/snowy_3.jfif")`, `url("../media/snowy_4.jfif")`, `url("../media/snowy_5.jfif")`],

  "Drizzle" : [`url("../media/drizzle.jfif")`, `url("../media/drizzle_2.jpg")`, `url("../media/drizzle_3.jfif")`, `url("../media/drizzle_4.jfif")`, `url("../media/drizzle_5.jfif")`],

  "Rain" : [`url("../media/rain.jfif")`, `url("../media/rain_2.jfif")`, `url("../media/rain_3.jfif")`, `url("../media/rain_4.jfif")`, `url("../media/rain_5.jfif")`]
}

let otherConditionsIcons = [
  `<i class="fas fa-sun"></i>`,
  `<i class="fas fa-cloud"></i>`,
  `<i class="fas fa-cloud-showers-heavy"></i>`,
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
  let backgroundImages = document.querySelector(".one-day-temp-container");
  sixDayApi(response.data.coord);

  celsiusTemp = response.data.main.temp;

  tempElement.innerHTML = Math.round(celsiusTemp);
  cityElement.innerHTML = response.data.name;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  humidityElement.innerHTML = response.data.main.humidity;
  descriptionElement.innerHTML = response.data.weather[0].description;
  timeElement.innerHTML = updateMainTime(response.data.dt * 1000);
  iconElement.innerHTML = updateMainIcon(response.data.weather[0].main);
  backgroundImages.style.backgroundImage = updateBackgroundImage(response.data.weather[0].main);
}

function updateBackgroundImage(main){
  let random = Math.floor(Math.random() * 5);
  if(multipleConditions.includes(main)){
    console.log(random);
    return multipleConditionsImages[random];
  } else {
    if(otherConditions.includes(main)){
      return otherConditionsImages[main][random];
    }
  }
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
    for (let i = 0; i < tempElements.length; i++) {
      let operation = Math.round((tempElements[i].innerHTML * 9) / 5 + 32);
      tempElements[i].innerHTML = operation;
    }
  } else {
    let unitsElements = document.querySelectorAll(".units");
    for (let i = 0; i < unitsElements.length; i++) {
      unitsElements[i].innerHTML = "C";
    }
    let tempElements = document.querySelectorAll(".temperature");
    for (let i = 0; i < tempElements.length; i++) {
      let operation = Math.round(((tempElements[i].innerHTML - 32) * 5) / 9);
      tempElements[i].innerHTML = operation;
    }
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

function sixDayApi(coords){
  let apiSixDays = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiSixDays).then(sixDayForecast);
  return
}

function sixDayForecast(response){
  let baseDay = newDate.getDay();
  let sixDaysMaxTemp = document.querySelectorAll(".max-temp");
  let sixDaysMinTemp = document.querySelectorAll(".min-temp");
  let updateIcons = document.querySelectorAll(".other-icons");
  for(let i = 0; i < sixDaysMaxTemp.length; i++) {
    baseDay = baseDay + 1;
    if(baseDay === 7){
      baseDay = 0;
    }
    sixDaysMaxTemp[i].innerHTML = Math.round(response.data.daily[baseDay].temp.max);
    sixDaysMinTemp[i].innerHTML = Math.round(response.data.daily[baseDay].temp.min);
    updateIcons[i].innerHTML = updateMainIcon(response.data.daily[baseDay].weather[0].main);
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

let firstFav = document.querySelector(".city-one");
firstFav.addEventListener("click", function(){
  searchCity(firstFav.innerHTML);
});

let secondFav = document.querySelector(".city-two");
secondFav.addEventListener("click", function(){
  searchCity(secondFav.innerHTML);
});

let thirdFav = document.querySelector(".city-three");
thirdFav.addEventListener("click", function(){
  searchCity(thirdFav.innerHTML);
});

let fourthFav = document.querySelector(".city-four");
fourthFav.addEventListener("click", function(){
  searchCity(fourthFav.innerHTML);
});

let fifthFav = document.querySelector(".city-five");
fifthFav.addEventListener("click", function(){
  searchCity(fifthFav.innerHTML);
});

searchCity("Monterrey");

