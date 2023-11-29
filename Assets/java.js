const APIKey = "fc1640bed3215e2b224eefde45f29f61";
var searchLocation = document.querySelector("#search-btn");
var userInput = document.querySelector("#user-input");
var currentLocation = document.querySelector("#location-btn");
var cityArrList = JSON.parse(localStorage.getItem("cities")) || [];


searchLocation.addEventListener("click", () => {
    var cityInput = userInput.value.trim().toLowerCase();


    searchCity(cityInput, APIKey);
    searchCityGeo(cityInput, APIKey);
})

function searchCity(city, APIKey) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;

    fetch(queryURL)
    .then(response => response.json())
    .then(data => {
        var { name: cityName, main: {temp: currentTemp, humidity: currentHumidity}, wind: {speed: currentWindSpeed}, weather: [{ icon: currentWeatherIcon}] } = data;

        document.getElementById("cityName").textContent = cityName;
        document.getElementById("currentTemp").textContent = `Temp: ${currentTemp}°F`;
        document.getElementById("currentHumidity").textContent = `Humidity: ${currentHumidity}%`;
        document.getElementById("currentWindSpeed").textContent = `Wind Speed: ${currentWindSpeed} MPH`;
        document.getElementById("currentWeatherIcon").src = `http://openweathermap.org/img/w/${currentWeatherIcon}.png`;
    })
    .catch(error => console.error("Error", error));
}

function searchCityGeo(city, APIKey) {
    var cityGeoCodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;
    fetch(cityGeoCodeURL)
    .then(function (response) {
        return response.json();
    })
    .then(function(data) {
        var lat = data[0].lat.toFixed(2);
        var lon = data[0].lon.toFixed(2);
        display5DayForecast(lat, lon);
    })
}

function display5DayForecast(lat, lon) {
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${APIKey}`;
    fetch(forecastURL)
        .then(response => response.json())
        .then(data => {
            console.log("Full forecast data:", data)
            var forecastDays = data.list && data.list.filter(entry => entry.dt_txt.includes("12:00:00"));

            if(data.list) {
                var forecastDays = data.list && data.list.filter(entry => entry.dt_txt.includes("12:00:00"));
                console.log("Filtered forecast data:", forecastDays);
                var forecastDaysContainer = document.getElementById("forecastDays");

            forecastDaysContainer.innerHTML = "";

            forecastDays.forEach(day => {
                var forecastDate = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                var forecastTemp = day.temp.day;
                
                var forecastCard = document.createElement("li");
                forecastCard.classList.add("col-md-2", "forecast-card");

                var dateEl = document.createElement("span");
                dateEl.textContent = forecastDate;

                var tempEl = document.createElement("span");
                tempEl.textContent = `${forecastTemp}°F`;

                forecastCard.appendChild(dateEl);
                forecastCard.appendChild(tempEl);

                forecastDaysContainer.appendChild(forecastCard)
            })
        } else {
            console.error("Error: Unable to fetch 5-day forecast data");
        }
        })
        .catch(error => console.error("Error fetching 5-day forecast", error));
}