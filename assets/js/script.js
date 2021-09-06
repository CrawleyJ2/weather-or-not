const savedCityData = localStorage.getItem('cities');


const pullWeather = function(city) {
  fetch('https://api.openweathermap.org/geo/1.0/direct?q='+ city +'&limit=1&appid=e89a8e141812e6ab1807eaf3ed0ffd77')
  .then(function(response) {
    return response.json();
  })
  .then(function(response) {
    var lat = response[0].lat;
    var lon = response[0].lon;
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude={part}&appid=e89a8e141812e6ab1807eaf3ed0ffd77')
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      var returnedStats = [
        response.daily[0].temp.day,
        response.daily[0].wind_speed,
        response.daily[0].humidity,
        response.daily[0].uvi,
        response.daily[0].weather[0].icon
      ]
    })
  })
};



