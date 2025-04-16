const apiKey = "c4f58d4cdd136760eb52085ad054767f"; //just because i already have one
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

function checkScreenWidth() {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 768) {
    document.querySelector(".warn").innerHTML = `<p>It seems you are using a mobile device. Currently the styling is broken for mobile devices, please use the website on a PC for the best experience. </p>`;
    document.querySelector(".warnfooter").innerHTML = `<p>Now that you have scrolled all the way down to here: DO YOU SEE HOW BROKEN IT IS??? </p>`;
  }
}


document.addEventListener("DOMContentLoaded", () => {
  loadData()
  checkScreenWidth();
});
// Call loadData on page load to check for saved data
locationInput.addEventListener("input", (e) => {
  const cityname = e.target.value;
  locationInput.value = cityname;
});
locationButton.addEventListener("click", () => {
  document.querySelector(".crystalize").classList.remove("hide");
  const cityname = locationInput.value;
  latlongFetch(cityname, statecode, countrycode).then(() => {
    getWeather(lat, lon); // Call getWeather only after latlongFetch resolves
    getForecast(lat, lon);
    getRealTimeWeather(lat, lon);
    getExtra(lat, lon);
    getHourlyWeather(lat, lon);
    locationInput.value = ""; // Clear the input field after fetching
  });
});

refreshButton.addEventListener("click", () => {
  document.querySelector(".crystalize").classList.remove("hide");
  locationInput.value = "";
  document.querySelector(".electro-charged").classList.add("hide");
  document.querySelector(".crystalize").classList.add("hide");
  document.querySelector(".refresh").classList.remove("hide");
  getWeather(lat, lon); // Call getWeather with the last known lat/lon, if there is none then we just hide this button altogether
  getForecast(lat, lon);
  getRealTimeWeather(lat, lon);
  getExtra(lat, lon);
  getHourlyWeather(lat, lon);
});

reloadButton.addEventListener("click", () => {
  document.querySelector(".crystalize").classList.remove("hide");
  const savedLocationName = localStorage.getItem("locationName");
  const savedLatLong = localStorage.getItem("latlong");

  if (savedLocationName && savedLatLong) {
    const [savedLat, savedLon] = savedLatLong.split(",");
    lat = parseFloat(savedLat); // Ensure lat and lon are numbers
    lon = parseFloat(savedLon);
    getWeather(lat, lon);
    getForecast(lat, lon);
    getRealTimeWeather(lat, lon);
    getExtra(lat, lon);
    getHourlyWeather(lat, lon);
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

      getWeather(lat, lon);
      getForecast(lat, lon);
      getRealTimeWeather(lat, lon);
      getExtra(lat, lon);
      getHourlyWeather(lat, lon);
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

function getWeather(lat, lon) {
  document.querySelector(".weatherforecast").innerHTML = ""; // Clear previous forecast data
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
      const time = new Date(data.dt * 1000).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const day = new Date(data.dt * 1000).getDate();
      const month = new Date(data.dt * 1000).toLocaleString("default", {
        month: "long",
      });
      const weather = data.weather[0].description;
      const weatherIcon = data.weather[0].icon; // Weather icon code, will convert to actual icons
      document.querySelector(
        ".icon"
      ).src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      //either openweatherAPI is drunk or there is something wrong on my end, no way the temperatures are all the same
      const location = data.name;
      const city = data.sys.country; // City name and country code
      const temp = Math.round(data.main.temp);
      // const tempmax = Math.round(data.main.temp_max); //until the current weather can return something else rather than 3 same values
      // const tempmin = Math.round(data.main.temp_min);
      const realfeel = Math.round(data.main.feels_like);
      document.querySelector(".electro-charged").classList.remove("hide");
      document.querySelector("#dt").textContent = month + " "+ day + " @ "+ time;
      document.querySelector("#locationName").textContent =
        location + ", " + city;

      document.querySelector("#condition").textContent = weather;
      document.querySelector("#temperature").textContent = `${temp}°C`; //because fuck imperial
      // document.querySelector("#tempmaxmin").textContent =
      //   `${tempmax}°C` + " / " + `${tempmin};
      document.querySelector("#feelslike").textContent =
        "RealFeel: " + `${realfeel}°C`;
      document.querySelector(".crystalize").classList.add("hide");
      document.querySelector(".refresh").classList.remove("hide");
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      document.querySelector(".crystalize").classList.add("hide");
      document.querySelector(".electro-charged").classList.remove("hide");
      document.querySelector(".refresh").classList.remove("hide");
    });
}

function getExtra(lat, lon) {
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
      const humidity = Math.round(data.current.humidity);
      const wind = Math.round(data.current.wind_speed);
      const uvi = Math.round(data.current.uvi);
      const dew = Math.round(data.current.dew_point);
      const sunrise = new Date(data.current.sunrise * 1000).toLocaleTimeString(
        "en-GB",
        { hour: "2-digit", minute: "2-digit", hour12: false }
      );
      const sunset = new Date(data.current.sunset * 1000).toLocaleTimeString(
        "en-GB",
        { hour: "2-digit", minute: "2-digit", hour12: false }
      );

      document.querySelector(".humidity").textContent =
        "Humidity: " + `${humidity}%`;
      document.querySelector(".wind").textContent =
        "Wind speed: " + `${wind} km/h`;
      document.querySelector(".uvi").textContent = "UV Index: " + `${uvi}`;
      document.querySelector(".dewpoint").textContent =
        "Dew point: " + `${dew}°C`;
      document.querySelector(".sunrise").textContent =
        "Sunrise: " + `${sunrise}`;
      document.querySelector(".sunset").textContent = "Sunset: " + `${sunset}`;
    })
    .catch((error) => {
      console.error("Error fetching extra weather data:", error);
      document.querySelector(".crystalize").classList.add("hide");
    });
}

if (!locationInput.value.trim()) {
  document.querySelector(".electro-charged").classList.add("hide");
  document.querySelector(".crystalize").classList.add("hide");
  document.querySelector(".refresh").classList.add("hide");
} else {
  document.querySelector(".refresh").classList.remove("hide");
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
      data.daily.slice(0, 7).forEach((daily) => {
        const weather = daily.weather[0].description;
        const weatherIcon = daily.weather[0].icon;
        const dateOfWeek = new Date(daily.dt * 1000).toLocaleDateString(
          "en-US",
          {
            weekday: "long",
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
        console.log();

        // Append forecast details
        document.querySelector(".weatherforecast").innerHTML += `
    <div class="details">
      <h2>${dateOfWeek}</h2>
      <p>${month} ${day}<p>
      <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weather}">
      <h3>${weather}</h3>
      <h4>${tempmax}°C</h4>
      <h4>${tempmin}°C</h4>
      <h4>${rainchance}% precip ${rain}</h4>
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
      data.hourly.slice(0, 25).forEach((hourly) => {
        // Debating whether we should keep it 24 or 12
        const weather = hourly.weather[0].description;
        const weatherIcon = hourly.weather[0].icon;
        const time = new Date(hourly.dt * 1000).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const day = new Date(hourly.dt * 1000).getDate();
        const month = new Date(hourly.dt * 1000).toLocaleString("default", {
          month: "short",
        });
        const foretemp = Math.round(hourly.temp);
        const forehumidity = Math.round(hourly.humidity);
        const forechance = Math.round(hourly.pop * 100);
        let forerain = "";
        if (forechance > 0 && hourly.rain) {
          forerain = "(" + Math.round(hourly.rain["1h"] * 100) / 100 + "mm)";
        }

        // Append forecast details
        document.querySelector(".hourlyforecast").innerHTML += `
    <div class="details">
    <div class="sector1">
      <h2>${time}</h2>
      <p>${day} ${month}<p>
      </div>
      <div class="sector2">
      <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weather}">
      
      <h3>${foretemp}°C</h3>
      </div>
      <div class="sector3">
      <h4>${forehumidity}% humid</h4>
      <h4>${forechance}% precip ${forerain}</h4>
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

function getRealTimeWeather(lat, lon) {
  // temporary measure for now because for some fucking reason i cant get the graph to work
  document.querySelector(".realtime").innerHTML = ""; // Clear previous MinuteCast data
  document.querySelector(".crystalize").classList.remove("hide");
  fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,current,alerts&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.cod !== 200) {
        document.querySelector(".electro-charged").classList.remove("hide");
      }
      data.minutely.forEach((minute) => {
        const time = new Date(minute.dt * 1000).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const precipitation = Math.round(minute.precipitation * 100) / 100; // Round to 2 decimal places
        const maxPrecipitation = Math.max(
          ...data.minutely.map((minute) => minute.precipitation)
        );
        const transparency = precipitation / maxPrecipitation; // Calculate transparency based on max precipitation
        const color = `rgba(65,245,114,${transparency})`; // Set color based on precipitation
        document.querySelector(".realtime").innerHTML += `
          <div class="minute-details" style="background-color: ${color};">
            <h1>${time}</h1> <p>${precipitation}mm</p>
          </div>
        `;
      });
    })
    .catch((error) => {
      console.error("Error fetching real-time weather data:", error);
      document.querySelector(".crystalize").classList.add("hide");
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
    getWeather(lat, lon);
    getForecast(lat, lon);
    getRealTimeWeather(lat, lon);
    getExtra(lat, lon);
    getHourlyWeather(lat, lon);
  }
  if (
    !localStorage.getItem("locationName") &&
    !localStorage.getItem("latlong")
  ) {
lat = 35.021041;
lon = 135.7556075;

    getWeather(lat, lon);
    getForecast(lat, lon);
    getRealTimeWeather(lat, lon);
    getExtra(lat, lon);
    getHourlyWeather(lat, lon);
    reloadButton.classList.add("hide");
    clearButton.classList.add("hide");
  } else {
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
