// Weather api: https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// lat and long api: http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit=1&appid={API key}
var weatherCards = [$('#day1'), $('#day2'), $('#day3'), $('#day4'),$('#day5')]

if (localStorage.length !== 0){
searchHistory()
}

$("#search").on("click", function(){
var city = $("#search-area").val()
if (localStorage.length !== 0){
    const history = JSON.parse(localStorage.getItem("cities"))
    var newHistory = history['cities']
    if (!newHistory.includes(city)){
    newHistory.push(city)
    }
    history['cities'] = newHistory
    localStorage.setItem("cities", JSON.stringify(history))
}else{
    const history = {
        cities : [city]
    }
localStorage.setItem("cities", JSON.stringify(history))
}

fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=976b9a4c772c56a631ad20598451da86')
.then(function(response){
    return response.json()
})
.then (function(data){
var latitude = data[0]['lat']
var longitude = data[0]['lon']
todayWeather(latitude, longitude)
fiveDaysForecast(latitude, longitude)
searchHistory()
})
})

function fiveDaysForecast(lat, long){
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&appid=976b9a4c772c56a631ad20598451da86&units=imperial')
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        var fiveDaysWeather = [data["list"][4], data["list"][12], data["list"][20], data["list"][28], data["list"][36]]
        for(card of weatherCards){
            $(card).empty()
        }

        // Weather cards for 2nd-6th day
        for (var i = 0; i < 5; i++){
            var temp = fiveDaysWeather[i]["main"]["temp"]
            var windSpeed = fiveDaysWeather[i]["wind"]["speed"]
            var humidityPercent = fiveDaysWeather[i]["main"]["humidity"]
            var icon = fiveDaysWeather[i]["weather"][0]["icon"]
            var dayDate = fiveDaysWeather[i]["dt_txt"].split('-')
            var displayDate = dayDate[1] + '/' + dayDate[2].split(' ')[0] + '/'+ dayDate[0]
            weatherCards[i].append(displayDate)
            weatherCards[i].append("<img src= https://openweathermap.org/img/wn/" + icon + "@2x.png>")
            weatherCards[i].append('<li>Temperature: '+temp+'°F</li>')
            weatherCards[i].append('<li>Wind Speed: '+windSpeed+'mph</li>')
            weatherCards[i].append('<li>Humidity: '+humidityPercent+'%</li>')
    }})
}


// code for displaying today's weather
function todayWeather(lat, long){
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=976b9a4c772c56a631ad20598451da86&units=imperial')
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        var temperature = data["main"]["temp"]
        var wind = data["wind"]["speed"]
        var humidity = data["main"]["humidity"]
        var todayIcon = data["weather"][0]["icon"]
        // first day weather
        $('#today-date').text(dayjs().format("M/D/YYYY"))
        $("#today-img").attr("src", "https://openweathermap.org/img/wn/" + todayIcon + "@2x.png")
        $('#today-temp').text('Temperature: '+temperature+'°F')
        $('#today-wind').text('Wind Speed: '+wind+'mph')
        $('#today-humidity').text('Humidity: '+humidity+'%')
    })
}

function searchHistory(){
    $("#search-history").empty()
    for(let item of JSON.parse(localStorage.getItem('cities'))['cities']){
        let historyButton = $("<button></button>").text(item).addClass("btn btn-secondary")
        $("#search-history").append(historyButton)
    
    historyButton.on("click", function(){
        var city = historyButton.text()

    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=976b9a4c772c56a631ad20598451da86')
    .then(function(response){
        return response.json()
    })
    .then (function(data){
    var latitude = data[0]['lat']
    var longitude = data[0]['lon']
    todayWeather(latitude, longitude)
    fiveDaysForecast(latitude, longitude)
        })
       }) 
    $("#search-history").append(historyButton)
}
}

