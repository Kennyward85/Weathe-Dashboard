var cityVal = [];
// this will get the data from local storage 
function rendered(){
var savedCity = JSON.parse(localStorage.getItem("citylist"));
if (savedCity !== null) {
    savedCity = cityVal
}  
}
//   On click functions for taking entered citys checking if they exist or not in local storage
// if they exist will return if not they will push in the the array of stored citys
$("#searchbtn").on("click", function () {
     city = $("#city").val();
    // once the click event happens will call the weatherInfo function to produce the forecast
    weatherInfo();
    // this is where it checks local storage for saved city 
    var checkRecent = cityVal.includes(city);
    if(checkRecent === true) {
        return
        // this is where it will push to the array if city has not been searched for
    } else {
        cityVal.push(city);
        localStorage.setItem("cityList", JSON.stringify(cityVal));
        var history = $("<li>").addClass("list-group-item list-group-item-action").text(city);
        $(".citylist").append(history);
    }
});
// This is for the saved searches below the search bar so that clicking them will return previous searches data
$(".citylist").on("click", "li", function() {
    city =($(this).text());
weatherInfo();
})
rendered();
    // this function will get all the info for the daily forecast and then it will append it to the page
    function weatherInfo() {
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=70d33a5bb880c7ea27d6d510a14fac55&units=imperial",
            method: "GET"
        }).then(function (data) {
            console.log(data);
            // clears content
            $("#daily").empty();
            // $("#fiveday").empty()
            // creating the elements for the card
            var head = $("<h3>").addClass("header").html(data.name + " (" + new Date().toLocaleDateString() + ")");
            // creates the card div
            var card = $("<div>").addClass("card");
            // this creates the text and generates the api info for the temp
            var temp = $("<p>").addClass("text").html("Temperature: " + data.main.temp + " °F");
            // this creates the text and generates the api info for the wind speed
            var wind = $("<p>").addClass("text").html("Wind Speed: " + data.wind.speed + " MPH");
            // this creates the text and generates the api info for the humidity
            var humidity = $("<p>").addClass("text").html("Humidity: " +data.main.humidity + "%");
            // this creates the card body these are bootstrap elements for creating a card
            var cardBody = $("<div>").addClass("card-body");
            // this will append the image to the card body
            var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
            // This will put them on the page in the order listed then append them to the daily forecast section
            // This will append the image into the h3 section along with the city name
            head.append(img);
            // this will set the img temp humidity and wind in that order into the car
            cardBody.append(head, temp, humidity, wind);
            // then it will append the card body into the card
            card.append(cardBody);
            // finally it will append the card with all the cardbody into the #daily section
            $("#daily").append(card);
            // information for calling api latitude and longitude
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?appid=70d33a5bb880c7ea27d6d510a14fac55&lat=" + lat + "&lon=" + lon,
            method: "GET"
            // This will append the UV info to the <p> text as a span button to creat the color outline 
            // dependent on wether it is green ok semi high yellow or bad red
        }).then(function (data) {
            console.log(data);
            var uvIndex = $("<p>").text("UV Index: ");
            var index = $("<span>").addClass("btn btn-sm").text(data.value);

            // this will change the outline around the uv depending on severity
            if (data.value < 3) {
                index.addClass("btn btn-outline-success");
            }if (data.value > 2 && data.value <= 6) {
                index.addClass("btn btn-outline-warning");
            }else{
                index.addClass("btn btn-outline-danger");
            }

            $("#daily .card-body").append(uvIndex.append(index));
        })
        // create the five day forecast to append to the page 
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=70d33a5bb880c7ea27d6d510a14fac55&units=imperial",
            method: "GET"
        }).then(function (data) {
            //  Console logged the data the API was pulling to dig deeper into how to call the objects needed for 
            // all 3 of the API calls made with Ajax
           console.log(data)
           $("#fiveday").html("<h4 class= 'mt-3'>Five Day Forecast:</h4>").append("<div class ='row'>");
            //   Simple for loop to cycle through array 
            for (var i = 0; i < data.list.length; i++) {
                // sets time of day to look at forcast 
                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
          
                    // making bootstrap card with the proper divisions to append everything
                    // so that it will end up displaying in the proper order
                    // making the Divisions of the card to place the object information
                    // setting column size so 5 cards fit properly on page refer to Readme
                    //  col-md-2 will allow for 5 cards without taking up all 12 columns
                    var cards = $("<div>").addClass("col-md-2 card body bg-primary text-white p-2");
                    var cardTitle = $("<h4>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    // Adding the img provided by the API
                    var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                    // Adding temp and humidty in the card text 
                    var temp = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp + " °F");
                    var humid = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    // This will put the card together by appending it
                    cards.append(cardTitle,img, temp,humid);
                    // This takes everything appended to cards and appends it to the proper spot in the html
                    $("#fiveday .row").append(cards);
                }
            }
   
        });
    })
}  