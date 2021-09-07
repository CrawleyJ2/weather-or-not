var savedCities = [];
var searchFormEl = document.querySelector('#search-form');
var selectedCityEl = document.querySelector('#city');
var savedCitiesFormEl = document.querySelector('#savedFormGroup');
//var savedCitiesSearch = document.querySelector('#savedFormGroup');

// form handler for entered city
var formSubmitHandler = function(event) {
  event.preventDefault();
  var city = selectedCityEl.value.trim();

  pullWeather(city);
};

// form handler for saved city-repeated search
var savedCityFormSubmit = function(event) {
  event.preventDefault();
  var savedCity = event.target.textContent;
  console.log(savedCity);

  pullWeather(savedCity);
};

// event listener - search form submission
searchFormEl.addEventListener('submit', formSubmitHandler);
// event listener - saved city submission
savedCitiesFormEl.addEventListener('click', savedCityFormSubmit);

// generate saved cities list
var getSavedCities = function() {
  var savedCities = JSON.parse(localStorage.getItem('cities'));

  if (savedCities !== null) {
    cityList = savedCities;
  }

  savedCities.forEach((city, index) => {
    var formList = document.querySelector('#savedFormGroup');
    var cityButton = document.createElement('button');
    cityButton.setAttribute('class', 'col-12 savedCityBtn');
    cityButton.setAttribute('id', city + '-saveBtn');
    cityButton.textContent = city;
    formList.appendChild(cityButton); 
  });
};

// send saved cities to localstorage
function saveCity () {
  localStorage.setItem('cities', JSON.stringify(savedCities));
  document.querySelector('#savedFormGroup').innerHTML = '<label class="title">Saved Cities</label>';
  getSavedCities();
};

// function to get weather from api
var pullWeather = function(city) {
  fetch('https://api.openweathermap.org/geo/1.0/direct?q='+ city +'&limit=1&appid=e89a8e141812e6ab1807eaf3ed0ffd77').then(function(response) {
    response.json().then(function(data) {
      console.log(data);
      savedCities.push(city);
      saveCity();
      var lat = data[0].lat;
      var lon = data[0].lon;
      
      return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&exclude=minutely,hourly,alerts&appid=e89a8e141812e6ab1807eaf3ed0ffd77').then(function(response) {
        response.json().then(function(data) {
          console.log(data);
          var cityTitleEl = document.querySelector('#city-date');
          cityTitleEl.innerHTML = city + " " + moment.unix(data.current.dt).format('MM/DD/YYYY') + ' <img src="https://openweathermap.org/img/wn/' + data.current.weather[0].icon + '.png">';
          var currentTempEl = document.querySelector('#temp');
          currentTempEl.innerHTML = Math.floor(data.current.temp) + '<span>&#176;</span> F';
          var currentWindEl = document.querySelector('#wind');
          currentWindEl.innerHTML = Math.floor(data.current.wind_speed) + ' MPH';
          var currentHumidityEl = document.querySelector('#humidity');
          currentHumidityEl.innerHTML = data.current.humidity + '<span>&#37;</span>';
          var currentUVIndexEl = document.querySelector('#uv-index');
          currentUVIndexEl.innerHTML = (data.current.uvi);
          // handler for displaying severity of uv index
          if (parseInt(currentUVIndexEl.textContent) < 3) {
            currentUVIndexEl.setAttribute('class', 'low');
          } else if (parseInt(currentUVIndexEl.textContent) > 8) {
            currentUVIndexEl.setAttribute('class', 'severe');
          } else {
            currentUVIndexEl.setAttribute('class', 'moderate');
          }

          // // set up for 5 day forecas
          // var dayForecast = function(dayCard, dayIndex) {
          // // date info
          // var forecastDateEl = document.querySelector('#'+ dayCard +'-date');
          // forecastDateEl.innerHTML = moment.unix(data.daily[dayIndex].dt).format('MM/DD/YYYY');
          // // icon info
          // var forecastIconEl = document.querySelector('#'+ dayCard +'-icon');
          // forecastIconEl.innerHTML = '<img src="https://openweathermap.org/img/wn/' + data.daily[dayIndex].weather[0].icon + '.png">'
          // // temp info
          // var forecastTempEl = document.querySelector('#'+ dayCard +'-temp');
          // forecastTempEl.innerHTML = data.daily[dayIndex].temp.max + '<span>&#176;</span>F';
          // // wind info
          // var forecastWindEl = document.querySelector('#'+ dayCard +'-wind');
          // forecastWindEl.innerHTML = data.daily[dayIndex].wind_speed + ' MPH';
          // // humidity info
          // var forecastWindEl = document.querySelector('#'+ dayCard +'-humidity');
          // forecastWindEl.innerHTML = data.daily[dayIndex].humidity + '<span>&#37;</span>';
          // };
          // // 5 day forecast
          // var dayCardArr = ['day1', 'day2', 'day3', 'day4', 'day5'];
          // var dayIndexArr = [1, 2, 3, 4, 5];
          // dayCardArr.forEach((dayCard, index) => {
          //     var dayIndex = dayIndexArr[index];
          //     dayForecast(dayCard, dayIndex);
          // });
        });
      });
    });
  });
};

// fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&appid=e89a8e141812e6ab1807eaf3ed0ffd77')
// .then(function(response) {
//   return response.json();
// })