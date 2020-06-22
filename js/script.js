
var userInput = "";
var savedCities = [];
//Constructor 
function City(name) {
    this.name = name;
}
var defaultCity = 'Melbourne,Au';

if (localStorage.getItem('saved-cities') !== null){
    savedCities =  JSON.parse(localStorage.getItem('saved-cities'));
    savedCities.forEach(element => {
        createButtons(element.name);  
    });
}

getWeather(defaultCity);


function getWeather (city) {
var apiKey = 'a867bed92987322936a99cf501351781';
var currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&units=metric&APPID='+apiKey;






fetch(currentWeatherUrl) 

.then(res => res.ok ? res.json() : console.log("Error"))
.then(data => {
    console.log(data);
    
    var weatherDate = dateString(data.dt);
    document.getElementById('weather-city').textContent = "";
    document.getElementById('weather-city').textContent = data.name + " " + data.sys.country;
    document.querySelector("#weather-today").textContent = "";
    document.querySelector("#weather-today").textContent = weatherDate;

    var condition = document.querySelector(".conditions");
    condition.textContent = data.weather[0].description;
    var temp = document.querySelector(".temp-today");
    var humidity = document.querySelector(".humidity-today");
    var windSpeed = document.querySelector(".wind-speed-today");
    temp.innerHTML = '<img src="http://openweathermap.org/img/w/'+ data.weather[0].icon+'.png" alt="icon" height="64" width="64">' + data.main.temp.toFixed(1)+'°C';
    humidity.textContent = "Humidity: " + data.main.humidity+"%";
    windSpeed.textContent = "Wind Speed: " + data.wind.speed+" km/h";
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid=" +apiKey;
    fetch(uvUrl)
    .then(res => res.ok ? res.json() : console.log("Error"))
    .then(data => {
        console.log(data)
        var uvSpan = document.createElement('span');
        var uv = document.querySelector(".uv-index-today");
        uv.textContent = "UV Index: ";
        uvSpan.textContent = + data.value;
        uvSpan.style.borderRadius = "5px";
        uvSpan.style.padding = "0.5em";
        
        
        switch(parseInt(data.value)) {
        case 1:
        case 2:   
        uvSpan.style.backgroundColor = colours[0];   
        break;
        case 3:
        case 4:
        case 5:
        uvSpan.style.backgroundColor = colours[1];   
        break;
        case 6: 
        case 7:  
        uvSpan.style.backgroundColor = colours[2];   
        break;
        case 8:
        case 9:
        case 10:
        uvSpan.style.backgroundColor = colours[3];   
        break;
        default:
        uvSpan.style.backgroundColor = colours[4];   
        }
        uv.appendChild(uvSpan);
    })

    var fiveDayForecastUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&units=metric&exclude=minutely,hourly&appid='+apiKey;

    fetch(fiveDayForecastUrl)
    .then(res => res.ok ? res.json() : console.log('Error'))
    .then(data => {
       
       var dailyData = data.daily; 
       document.getElementById("future-forecast").innerHTML = "";
       for (var i = 1; i < dailyData.length - 2; i++){
        var cardDate = dateString(dailyData[i].dt);
        var div = document.createElement('div');
        div.classList.add("card");
        console.log(div);
        var heading  = document.createElement('h4');
        heading.textContent = cardDate;
        var iconImg = document.createElement('p');
        iconImg.innerHTML = '<img src="http://openweathermap.org/img/w/'+ dailyData[i].weather[0].icon+'.png" alt="icon" height="64" width="64">'
        var maxTemp = document.createElement('p');
        maxTemp.textContent = "Max Temp: " + dailyData[i].temp.max.toFixed(1)+"°C";
        var minTemp = document.createElement('p');
        minTemp.textContent = "Min Temp: " + dailyData[i].temp.min.toFixed(1)+"°C";
        var humidity = document.createElement('p');
        humidity.textContent = "Humidity: " + dailyData[i].humidity + "%";
        div.appendChild(heading);
        div.appendChild(iconImg);
        div.appendChild(maxTemp);
        div.appendChild(minTemp);
        div.appendChild(humidity);
        document.getElementById("future-forecast").appendChild(div);
       }
     console.log(data);



     var iconcode = '';
     var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    
 })
    
})
 

}

function getUserInput (e) {

    if (e.type === 'click'){
     userInput = searchBox.value;
     console.log(userInput);
     getWeather(userInput);
     saveCity(userInput);
    } else if (e.key === 'Enter') {
        userInput = searchBox.value;
        console.log(userInput)
        getWeather(userInput);
        saveCity(userInput);
    }
};


var searchBtn = document.querySelector("#search-btn");
var searchBox = document.querySelector("#city-search");
searchBtn.addEventListener("click", getUserInput);
searchBox.addEventListener("keyup", getUserInput);
document.body.addEventListener( 'click', function ( event ) {
    console.log(event.srcElement);
    if(event.srcElement.classList.contains('saved-search-btn') ) {
        document.querySelector("#city-search").value = event.srcElement.textContent;
        getWeather (event.srcElement.textContent);
    };
  } );

//Colours: Green, yellow, orange, red, purple
var colours = ['#9CC600','#FFBC01', '#FF9000', '#F55022', '#9E47CC'];

function saveCity(userInput) {
    if(savedCities.find(x => x.name === userInput)) return;
    var newCityObj = new City(userInput);
    savedCities.push(newCityObj);
    localStorage.setItem("saved-cities", JSON.stringify(savedCities));
    console.log(savedCities);
    createButtons(userInput);

}

function createButtons(userInput) {
    var newButton = document.createElement('a');
    newButton.textContent = userInput;
    newButton.classList.add('saved-search-btn');
    document.querySelector("#saved-searches").appendChild(newButton);

}

function buttonClickSearch() {

}

function dateString (unixDate) {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var theDate = new Date(unixDate * 1000);
    var dayName = days[theDate.getDay()];
    var day = theDate.getDate();
    var month = months[theDate.getMonth()];

    return dayName + " " + day + " " + month;
}

