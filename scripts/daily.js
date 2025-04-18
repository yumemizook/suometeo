const apiKey = "c4f58d4cdd136760eb52085ad054767f"; //just because i already have one //temporary backup key
//const apiKey = "c03e728ec54244994b0935a453bcb87c"; // backup key
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
let accentIcon = ""
document.addEventListener("DOMContentLoaded", () => {
     loadData();
    getIcon(accentIcon);
  });
  window.onload = () => {
    getIcon(accentIcon); // Replace with dynamic logic to fetch the actual weather icon
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
        getLocationName(lat, lon);
        // getExtra(lat,lon);
        getForecast(lat, lon);
        getIcon(accentIcon);
      locationInput.value = ""; // Clear the input field after fetching
    });
  });
  
  refreshButton.addEventListener("click", () => {
    document.querySelector(".crystalize").classList.remove("hide");
    locationInput.value = "";
    document.querySelector(".electro-charged").classList.add("hide");
    document.querySelector(".crystalize").classList.add("hide");
    // document.querySelector(".refresh").classList.remove("hide");
    getLocationName(lat, lon);
    // getExtra(lat,lon);
    getForecast(lat, lon);
    getIcon(accentIcon);
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
      // getExtra(lat,lon);
      getForecast(lat, lon);
      getIcon(accentIcon);
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
        // getExtra(lat,lon);
        getForecast(lat, lon);
        getIcon(accentIcon);
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
  

  if (!locationInput.value.trim()) {
    document.querySelector(".electro-charged").classList.add("hide");
    document.querySelector(".crystalize").classList.add("hide");
    // document.querySelector(".refresh").classList.add("hide");
  } else {
    // document.querySelector(".refresh").classList.remove("hide");
  }
  
  
  function getForecast(lat, lon) {
    document.querySelector(".weatherforecast").innerHTML = ""; // Clear previous forecast data
    document.querySelector(".crystalize").classList.remove("hide");
    fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.cod !== 200) {
          document.querySelector(".electro-charged").classList.remove("hide");
        }
        data.daily.forEach((daily) => {
          const weather = daily.weather[0].description;
          const weatherIcon = daily.weather[0].icon;
          const dateOfWeek = new Date(daily.dt * 1000).toLocaleDateString(
            "en-US",
            {
              weekday: "short",
            }
          );
          const day = new Date(daily.dt * 1000).getDate();
          const month = new Date(daily.dt * 1000).toLocaleString("default", {
            month: "long",
          });
          const rainchance = Math.round(daily.pop * 100);
          let rain = "";
          if (rainchance > 0 && daily.rain) {
            rain = "(" + Math.round(daily.rain * 100) / 100 + "mm)";
          }
          const tempmax = Math.round(daily.temp.max);
          const tempmin = Math.round(daily.temp.min);
    
          const moonphase = daily.moon_phase;
          const daycolor = (() => {
            if (dateOfWeek === "Mon") return "cyan";
            if (dateOfWeek === "Tue") return "orange";
            if (dateOfWeek === "Wed") return "pink";
            if (dateOfWeek === "Thu") return "purple";
            if (dateOfWeek === "Fri") return "lime";
            if (dateOfWeek === "Sat") return "white";
            if (dateOfWeek === "Sun") return "red";
          })();

          // Example usage of daycolor to avoid unused variable warning
          const moonphasetext = ((moonphase) => {
            if (moonphase === 0 || moonphase === 1) return "New Moon";
            if (moonphase > 0 && moonphase < 0.25) return "Waxing Crescent";
            if (moonphase === 0.25) return "First Quarter";
            if (moonphase > 0.25 && moonphase < 0.5) return "Waxing Gibbous";
            if (moonphase === 0.5) return "Full Moon";
            if (moonphase > 0.5 && moonphase < 0.75) return "Waning Gibbous";
            if (moonphase === 0.75) return "Last Quarter";
            if (moonphase > 0.75 && moonphase < 1) return "Waning Crescent";
            return "New Moon";
            })(moonphase);
          const summary = daily.summary;
          const sunrise = new Date(daily.sunrise * 1000).toLocaleTimeString(
            "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }
          );
          const sunset = new Date(daily.sunset * 1000).toLocaleTimeString(
            "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }
          );
          console.log();
  
          // Append forecast details
          document.querySelector(".weatherforecast").innerHTML += `
      <div class="details">
      <div class="sector1">
        <h2 style="text-shadow: 0 0 5px ${daycolor};">${dateOfWeek}</h2>
        <p>${month} ${day}<p>
        </div>
        <div class="sector2">
        <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weather}">
        <h5>${weather}</h5>
        </div>
        <div class="sector3">
        <h4><i class="fa-solid fa-temperature-arrow-up"></i>${tempmax}°C</h4>
        <h4><i class="fa-solid fa-temperature-arrow-down"></i>${tempmin}°C</h4>
                <h5><i class="fa-solid fa-moon"></i> ${moonphasetext}</h5>
        </div>
        <div class="sector4">
        <h5><i class="fa-solid fa-cloud-showers-heavy"></i> ${rainchance}% ${rain}</h5>

        </div>
        <div class="sector5">
        <h5><i class="fa-solid fa-up-long"></i> ${sunrise}</h5>
        <h5><i class="fa-solid fa-down-long"></i> ${sunset}</h5>
        </div>
                <div class="summary" style="grid-column: span 5; padding: 10px;">
        <h5>${summary}</h5>
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
      clearButton.classList.add("hide");
    } else {
      clearButton.classList.remove("hide");
    }
  }
  
  function getIcon() {
    fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        const accentIcon = data.current.weather[0].icon;
        if (accentIcon === "11d") {
          document.body.style.backgroundImage = "url('weather-bg/thunderstorm.jpg')";
        } else if (accentIcon === "09d") {
          document.body.style.backgroundImage = "url('weather-bg/rainnight.jpg')";
        } else if (accentIcon === "10d") {
          document.body.style.backgroundImage = "url('weather-bg/rain.jpg')";
        } else if (accentIcon === "13d") {
          document.body.style.backgroundImage = "url('weather-bg/snow.jpg')";
        } else if (accentIcon === "50d") {
          document.body.style.backgroundImage = "url('weather-bg/haze.jpg')";
        } else if (accentIcon === "01d") {
          document.body.style.backgroundImage = "url('weather-bg/clear.jpg')";
        } else if (accentIcon === "02d") {
          document.body.style.backgroundImage = "url('weather-bg/sctrday.jpg')";
        } else if (accentIcon === "03d") {
          document.body.style.backgroundImage = "url('weather-bg/brokenday.jpg')";
        } else if (accentIcon === "04d") {
          document.body.style.backgroundImage = "url('weather-bg/ocday.jpg')";
        } else if (accentIcon === "01n") {
          document.body.style.backgroundImage = "url('weather-bg/clearnight.jpg')";
        } else if (accentIcon === "02n") {
          document.body.style.backgroundImage = "url('weather-bg/sctrnight.jpg')";
        } else if (accentIcon === "03n") {
          document.body.style.backgroundImage = "url('weather-bg/brokennight.jpg')";
        } else if (accentIcon === "04n") {
          document.body.style.backgroundImage = "url('weather-bg/ocnight.jpg')";
        } else if (accentIcon === "10n") {
          document.body.style.backgroundImage = "url('weather-bg/rainnight.jpg')";
        }
      })
      .catch((error) => {
        console.error("Error fetching weather icon data:", error);
      });
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
    getForecast(lat, lon);
    getIcon(accentIcon);

    if (locationName && latlong) {
      clearButton.classList.remove("hide");
    }
  } // Call loadData on page load to check for saved data
  
  function clearSave() {
    localStorage.removeItem("locationName");
    localStorage.removeItem("latlong");
    locationInput.value = ""; // Clear the input field
    // document.querySelector(".refresh").classList.remove("hide"); // Hide the refresh button
  
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
