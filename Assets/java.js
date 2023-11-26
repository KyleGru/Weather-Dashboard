const APIKey = "fc1640bed3215e2b224eefde45f29f61";
var searchLocation = document.querySelector("#search-btn");
var userInput = document.querySelector("#user-input");
var currentLocation = document.querySelector("#location-btn");
var cityArrList = JSON.parse(localStorage.getItem("cities")) || [];


searchLocation.addEventListener("click", () => {
    var cityInput = userInput.value.trim().toLowerCase();


    searchCity(cityInput, APIKey);
    // getCityCoord(city, APIKey);
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