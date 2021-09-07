var savedCities = [];
var searchFormEl = document.querySelector('#search-form');
var selectedCityEl = document.querySelector('#city');
var savedCitiesFormEl = document.querySelector('#savedFormGroup');
//var savedCitiesSearch = document.querySelector('#savedFormGroup');

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

  cityList.forEach((city, index) => {
    var formList = document.querySelector('#savedFormGroup');
    var cityButton = document.createElement('button');
    cityButton.setAttribute('class', 'col-12 savedCityBtn');
    cityButton.setAttribute('id', city + '-saveBtn');
    cityButton.textContent = city;
    formList.appendChild(cityButton); 
  });
};

getSavedCities();

// send saved cities to localstorage
function saveCity () {
  localStorage.setItem('cities', JSON.stringify(savedCities));
  document.querySelector('#savedFormGroup').innerHTML = '<label class="title">Saved Cities</label>';
  getSavedCities();
};

// form handler for entered city
var formSubmitHandler = function(event) {
  event.preventDefault();
  var city = selectedCityEl.nodeValue.trim();

  pullWeather(city);
};
// form handler for saved city-repeated search
var savedCityFormSubmit = function(event) {

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
      fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&appid=e89a8e141812e6ab1807eaf3ed0ffd77').then(function(response) {
        response.json().then(function(data) {
          console.log(data);
        });
      });
    });
  });
};

// fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&appid=e89a8e141812e6ab1807eaf3ed0ffd77')
// .then(function(response) {
//   return response.json();
// })