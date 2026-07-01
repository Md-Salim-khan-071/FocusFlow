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

    const current_date = `${day} , ${month} ${date}`
    document.getElementById("live_date").textContent = current_date; 
}
livedate();
setInterval(livedate, 1000); 


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


