// Weather api: https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// lat and long api: http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit=1&appid={API key}

$("#search").on("click", function(){
var city = $("#search-area").val()

fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=976b9a4c772c56a631ad20598451da86')
.then(function(response){
    return response.json()
})
.then (function(data){
var latitude = data[0]['lat']
var longitude = data[0]['lon']
getWeather(latitude, longitude)
})
})

function getWeather(lat, long){
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&appid=976b9a4c772c56a631ad20598451da86&units=imperial')
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        var todayWeather = data["list"][0]
        console.log(todayWeather)
        var temperature = todayWeather["main"]["temp"]
        var wind = todayWeather["wind"]["speed"]
        var humidity = todayWeather["main"]["humidity"]
    })
}