//const apiKey = "c4f58d4cdd136760eb52085ad054767f"; //just because i already have one //temporary backup key
const apiKey = "c03e728ec54244994b0935a453bcb87c"; // backup key
const locationFetch = document.querySelector(".get-location-auto");
const searchQuery = new URLSearchParams(location.search);
const query = searchQuery.get("q")?.trim();

const locationInput = document.querySelector("[get-location]");
const locationButton = document.querySelector("#searchBtn");
const refreshButton = document.querySelector(".refresh");
const saveButton = document.querySelector("[save-location]");
const clearButton = document.querySelector("[clear-location]");
const reloadButton = document.querySelector("[get-saved-location]");

let lat, lon; // Declare global variables for latitude and longitude
let tempmax, tempmin; // Declare global variables for max and min temperature

let statecode = ""; // Declare statecode variable
let countrycode = ""; // Declare countrycode variable
let weatherIcon = ""
document.addEventListener("DOMContentLoaded", () => {
     loadData();
    dateTime();
    getIcon(weatherIcon);
  });
  window.onload = () => {
    getIcon(weatherIcon); // Replace with dynamic logic to fetch the actual weather icon
  };


  // Call loadData on page load to check for saved data
  locationInput.addEventListener("input", (e) => {
    const cityname = e.target.value;
    locationInput.value = cityname;
  });
  locationButton.addEventListener("click", () => {
    document.querySelector(".crystalize").classList.remove("hide");
    const cityname = locationInput.value;
    latlongFetch(cityname, statecode, countrycode).then(() => {
        getLocationName(lat, lon); // i kept thinking it doesnt work until i realized i forgot to include this function
    //   getExtra(lat, lon);
      getHourlyWeather(lat, lon);
      getIcon(weatherIcon);
      locationInput.value = ""; // Clear the input field after fetching
    });
  });
  
  refreshButton.addEventListener("click", () => {
    document.querySelector(".crystalize").classList.remove("hide");
    locationInput.value = "";
    document.querySelector(".electro-charged").classList.add("hide");
    document.querySelector(".crystalize").classList.add("hide");
    document.querySelector(".refresh").classList.remove("hide");
    getLocationName(lat, lon);
    // getExtra(lat, lon);
    getHourlyWeather(lat, lon);
    getIcon(weatherIcon);
  });
  
  reloadButton.addEventListener("click", () => {
    document.querySelector(".crystalize").classList.remove("hide");
    const savedLocationName = localStorage.getItem("locationName");
    const savedLatLong = localStorage.getItem("latlong");
  
    if (savedLocationName && savedLatLong) {
      const [savedLat, savedLon] = savedLatLong.split(",");
      lat = parseFloat(savedLat); // Ensure lat and lon are numbers
      lon = parseFloat(savedLon);
      getLocationName(lat, lon);
    //   getExtra(lat, lon);
      getHourlyWeather(lat, lon);
      getIcon(weatherIcon);
    } else {
      document.querySelector("[get-saved-location]").classList.add("hide");
      document.querySelector(".crystalize").classList.add("hide");
    }
  });
  
  locationFetch.addEventListener("click", () => {
    document.querySelector(".crystalize").classList.remove("hide");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat = position.coords.latitude; // Assign values to global variables
        lon = position.coords.longitude;
        console.log(lat, lon); // logged just in case something is off
        getLocationName(lat, lon);
        // getExtra(lat, lon);
        getHourlyWeather(lat, lon);
        getIcon(weatherIcon);
      },
      (error) => {
        console.error("Error getting location:", error.message);
        document.querySelector(".crystalize").classList.add("hide");
        alert(
          "Unable to fetch location. PLease make sure you gave access to geolocation."
        );
      }
    );
  });
  
  saveButton.addEventListener("click", () => {
    saveData();
  });
  
  clearButton.addEventListener("click", () => {
    clearSave();
  });
  

  async function latlongFetch(cityname, statecode, countrycode) {
    const stateParam = statecode ? `,${statecode}` : "";
    const countryParam = countrycode ? `,${countrycode}` : "";
    document.querySelector(".crystalize").classList.remove("hide");
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityname}${stateParam}${countryParam}&limit=5&appid=${apiKey}`
      );
      const latlong = await response.json();
      if (latlong.length > 0) {
        lat = latlong[0].lat;
        lon = latlong[0].lon;
        console.log(`${lat} ${lon}`);
      } else {
        console.error("No results found for the provided city name.");
        alert("No results found for the provided city name. Please try again.");
        document.querySelector(".crystalize").classList.add("hide");
      }
    } catch (error) {
      console.error("Error fetching latitude and longitude:", error);
      alert("Error fetching location data. Please try again later.");
      document.querySelector(".crystalize").classList.add("hide");
    }
  }


  function getLocationName(lat, lon) {
    document.querySelector(".crystalize").classList.remove("hide");
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.cod !== 200) {
          document.querySelector(".electro-charged").classList.remove("hide");
        }
        const location = data.name;
        const country = data.sys.country;
        document.querySelector("#locationName").textContent =
        location + ", " + country;

      });
  }
  
//   function getExtra(lat, lon) {
//     document.querySelector(".weatherforecast").innerHTML = ""; // Clear previous forecast data
//     document.querySelector(".crystalize").classList.remove("hide");
//     fetch(
//       `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${apiKey}&units=metric`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         if (data.cod !== 200) {
//           document.querySelector(".electro-charged").classList.remove("hide");
//         }
//         const humidity = Math.round(data.current.humidity);
//         const wind = Math.round(data.current.wind_speed);
//         const uvi = Math.round(data.current.uvi);
//         const dew = Math.round(data.current.dew_point);
//         const sunrise = new Date(data.current.sunrise * 1000).toLocaleTimeString(
//           "en-GB",
//           { hour: "2-digit", minute: "2-digit", hour12: false }
//         );
//         const sunset = new Date(data.current.sunset * 1000).toLocaleTimeString(
//           "en-GB",
//           { hour: "2-digit", minute: "2-digit", hour12: false }
//         );
  
//         document.querySelector(".humidity").textContent =
//           "Humidity: " + `${humidity}%`;
//         document.querySelector(".wind").textContent =
//           "Wind speed: " + `${wind} km/h`;
//         document.querySelector(".uvi").textContent = "UV Index: " + `${uvi}`;
//         document.querySelector(".dewpoint").textContent =
//           "Dew point: " + `${dew}°C`;
//         document.querySelector(".sunrise").textContent =
//           "Sunrise: " + `${sunrise}`;
//         document.querySelector(".sunset").textContent = "Sunset: " + `${sunset}`;
//       })
//       .catch((error) => {
//         console.error("Error fetching extra weather data:", error);
//         document.querySelector(".crystalize").classList.add("hide");
//       });
//   }
  
  if (!locationInput.value.trim()) {
    document.querySelector(".electro-charged").classList.add("hide");
    document.querySelector(".crystalize").classList.add("hide");
    document.querySelector(".refresh").classList.add("hide");
  } else {
    document.querySelector(".refresh").classList.remove("hide");
  }
  
  
  function getHourlyWeather(lat, lon) {
    document.querySelector(".hourlyforecast").innerHTML = ""; // Clear previous forecast data
    document.querySelector(".crystalize").classList.remove("hide");
    fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=daily,current,minutely,alerts&appid=${apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.cod !== 200) {
          document.querySelector(".electro-charged").classList.remove("hide");
        }
        data.hourly.slice(0, 8).forEach((hourly) => {
          // 48 hours can be fetched in another page
          const weather = hourly.weather[0].description;
          const weatherIcon = hourly.weather[0].icon;
          const hour = new Date(hourly.dt * 1000).getHours();
 
          const dayofweek = new Date(hourly.dt * 1000).toLocaleDateString(
            "en-US",
            {
              weekday: "long",
            }
          );

          const foretemp = Math.round(hourly.temp);
          // const forehumidity = Math.round(hourly.humidity);
          const forechance = Math.round(hourly.pop * 100);
          let forerain = "";
          if (forechance > 0 && hourly.rain) {
            forerain = "(" + Math.round(hourly.rain["1h"] * 100) / 100 + "mm)";
          }
  
          // Append forecast details
          document.querySelector(".hourlyforecast").innerHTML += `
      <div class="details">
      <div class="sector1">
        <h2>${hour}</h2>
        <p>${dayofweek} </p>
        </div>
        <div class="sector2">
        <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weather}">
        
        <h3>${foretemp}°C</h3>
        </div>
        <div class="sector3">
        <h4><i class='fa fa-umbrella'></i>${forechance}%</h4>
        <h4>${forerain}</h4>
        </div>
      </div>
    `;
        });
  
        document.querySelector(".crystalize").classList.add("hide");
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        document.querySelector(".crystalize").classList.add("hide");
        document.querySelector(".electro-charged").classList.remove("hide");
        document.querySelector(".refresh").classList.remove("hide");
      });
    if (
      !localStorage.getItem("locationName") &&
      !localStorage.getItem("latlong")
    ) {
      reloadButton.classList.add("hide");
      clearButton.classList.add("hide");
    } else {
      clearButton.classList.remove("hide");
    }
  }
  
  function getIcon(weatherIcon) {
    if (weatherIcon === "11d") {
      document.body.style.backgroundImage = "url('weather-bg/thunderstorm.jpg')";
    } else if (weatherIcon === "09d") {
      document.body.style.backgroundImage = "url('weather-bg/rainnight.jpg')";
    } else if (weatherIcon === "10d") {
      document.body.style.backgroundImage = "url('weather-bg/rain.jpg')";
    } else if (weatherIcon === "13d") {
      document.body.style.backgroundImage = "url('weather-bg/snow.jpg')";
    } else if (weatherIcon === "50d") {
      document.body.style.backgroundImage = "url('weather-bg/haze.jpg')";
    } else if (weatherIcon === "01d") {
      document.body.style.backgroundImage = "url('weather-bg/clear.jpg')";
    } else if (weatherIcon === "02d") {
      document.body.style.backgroundImage = "url('weather-bg/sctrday.jpg')";
    } else if (weatherIcon === "03d") {
      document.body.style.backgroundImage = "url('weather-bg/brokenday.jpg')";
    } else if (weatherIcon === "04d") {
      document.body.style.backgroundImage = "url('weather-bg/ocday.jpg')";
    } else if (weatherIcon === "01n") {
      document.body.style.backgroundImage = "url('weather-bg/clearnight.jpg')";
    } else if (weatherIcon === "02n") {
      document.body.style.backgroundImage = "url('weather-bg/sctrnight.jpg')";
    } else if (weatherIcon === "03n") {
      document.body.style.backgroundImage = "url('weather-bg/brokennight.jpg')";
    } else if (weatherIcon === "04n") {
      document.body.style.backgroundImage = "url('weather-bg/ocnight.jpg')";
    } else if(weatherIcon === "10n") {
      document.body.style.backgroundImage = "url('weather-bg/rainnight.jpg')";
    }
  }

  function saveData() {
    const locationName = document.querySelector("#locationName").textContent;
    const latlong = `${lat},${lon}`;
    localStorage.setItem("locationName", locationName);
    localStorage.setItem("latlong", latlong);
    alert("Location saved successfully!");
    document.querySelector("[clear-location]").classList.remove("hide"); // Show the refresh button after saving
    document.querySelector("[get-saved-location]").classList.remove("hide");
  }
  
  function loadData() {
    const locationName = localStorage.getItem("locationName");
    const latlong = localStorage.getItem("latlong");
  
    if (locationName && latlong) {
      document.querySelector("#locationName").textContent = locationName;
      const [savedLat, savedLon] = latlong.split(",");
      lat = parseFloat(savedLat); // Ensure lat and lon are numbers
      lon = parseFloat(savedLon);
    } else {
      lat = 35.021041;
      lon = 135.7556075;
      reloadButton.classList.add("hide");
      clearButton.classList.add("hide");
    }

    getLocationName(lat, lon);
    // getExtra(lat,lon);
    getHourlyWeather(lat, lon);
    getIcon(weatherIcon);

    if (locationName && latlong) {
      clearButton.classList.remove("hide");
    }
  } // Call loadData on page load to check for saved data
  
  function clearSave() {
    localStorage.removeItem("locationName");
    localStorage.removeItem("latlong");
    locationInput.value = ""; // Clear the input field
    document.querySelector(".refresh").classList.remove("hide"); // Hide the refresh button
  
    clearButton.classList.add("hide");
    document.querySelector("[get-saved-location]").classList.add("hide");
    alert("Location cleared successfully!");
  }
  // export {
  //   latlongFetch,
  //   getLocationName,
  //   getWeather,
  //   getForecast,
  //   getRealTimeWeather,
  //   getExtra,
  //   getHourlyWeather,
  //   getIcon,
  //   saveData,
  //   loadData,
  //   clearSave,
  // };
