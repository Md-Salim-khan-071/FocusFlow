function liveclock() {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = String(now.getHours()).padStart(2, "0");
    minutes = String(now.getMinutes()).padStart(2, "0");
    seconds = String(now.getSeconds()).padStart(2, "0");

    const current_time = `${hours}:${minutes}:${seconds}`
    document.getElementById("live_clock").textContent = current_time; 
}
liveclock();   // callimg the function 
setInterval(liveclock, 1000);  // running the function every second( 1000 mili seconds )


function dynamic_greeting(){
    const greet = new Date();

    const hours = greet.getHours();
    let greeting

    if (hours>=5 & hours<12){
        greeting = "Good Morning"
    }
    else if (hours>=12 & hours<17){
        greeting = "Good afternoon"
    }
    else if (hours>=17 & hours<21){
        greeting = "Good Evening"
    }
    else{
        greeting = "Good night"
    }
    document.getElementById("greeting").textContent = greeting; 
}
dynamic_greeting();
setInterval(dynamic_greeting, 1000); 


const themeButton = document.getElementById("light_dark_toggle");

themeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");
    moon.style.display = "none";

        if (document.body.classList.contains("dark-mode")) {

        moon.style.display = "none";
        sun.style.display = "block";

    } else {

        moon.style.display = "block";
        sun.style.display = "none";

    }
});

function livedate(){
    const today = new Date();
    //creating days array
    const days=["sunday","monday","Tuesday","Wednesday","Thursdaay","Friday","Saturday"];
    // creating months array
    const months=["January","Febreuary","Mar","April","May","June","July","August","September","October","November","December"]
    // getting the day and month as a number 0-6 which we will convert later into words using above arrays
    let day = today.getDay();
    day = days[day];

    let month = today.getMonth();
    month = months[month]

    let date = today.getDate();

    const current_day = `${day}`
    document.getElementById("live_day").textContent = current_day; 

    const current_date = `${month} ${date}`
    document.getElementById("live_date").textContent = current_date; 
}
livedate();
setInterval(livedate, 1000); 


async function load_quote() {
    const response = await fetch("https://dummyjson.com/quotes/random");
    // The Response object isn't the quote itself. It's a package that contains the quote.
    const data = await response.json();  //"Open the package and convert its contents into a JavaScript object."

    document.getElementById("quote_text").textContent=`"${data.quote}"`;

    document.getElementById("quote_author").textContent=`-${data.author}`;
}
load_quote();

const newbutton = document.getElementById("next_quote");
newbutton.addEventListener("click", load_quote);


function getlocation(){
    navigator.geolocation.getCurrentPosition(success); // success is the below function 
}
// position is an object that multiuple information but we need only two : latitude and logitude 
function success(position){
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log(latitude);
    console.log(longitude);

    loadWeather(latitude, longitude);  // this is calling below async function .  
}
getlocation();
async function loadWeather(latitude, longitude){

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

    // const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

    const response = await fetch(url);

    const data = await response.json();

    // the data that we need is stored in another folder called current in the data folder . hence it nested as : data->current->data that we need .  
    const temperature = data.current.temperature_2m;
    const humidity =  data.current.relative_humidity_2m;
    const windspeed = data.current.wind_speed_10m;
    const weathercode = data.current.weather_code;
    const description = getweatherdescription(weathercode); 
    const symbol = getweathersymbol(weathercode);

    document.getElementById("temperature").textContent=`${temperature}°C`;
    document.getElementById("humidity").textContent=`💧 ${humidity}%`;
    document.getElementById("wind").textContent=`🍃${windspeed}km/h`;
    document.getElementById("temperature").textContent=`${temperature}°C`;
    document.getElementById("weather").textContent=`${description}`;
    document.getElementById("weather_symbol").textContent=`${symbol}`;
}
// function to get weather info . as api returns weather codes like 2,61,71 etc . we need to convert them into meaningfull text and symbols 
function getweatherdescription(code){
    switch(code){
        case 0:
            return "Clear Sky";
        case 1:
            return "Mainly Clear";
        case 2:
            return "Partly Cloudy";
        case 3:
            return "Overcast";
        case 45:
            return "Fog";
        case 61:
            return "Rain";
        case 71:
            return "Snow";
        case 95:
            return "Thunderstorm";
        default:
            return "Weather Unknown";
    }
}
// function for the same work as above but symbols displayfunction weather_description(code){
function getweathersymbol(code){
    switch(code){
        case 0:
            return "☀";
        case 1:
            return "🌤";
        case 2:
            return "⛅";
        case 3:
            return "☁";
        case 45:
            return "🌫";
        case 61:
            return "🌧";
        case 71:
            return "❄";
        case 95:
            return "⛈";
        default:
            return "Weather Unknown";
    }
}