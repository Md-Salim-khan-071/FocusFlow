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