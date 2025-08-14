// Import configuration
// const apiKey = "c4f58d4cdd136760eb52085ad054767f"; //just because i already have one //temporary backup key
//const apiKey = "c03e728ec54244994b0935a453bcb87c"; // backup key

// Use configuration for API key
const apiKey = config.openWeatherApiKey;

// Validate API key
if (!apiKey || apiKey === "YOUR_OPENWEATHER_API_KEY_HERE") {
  console.error("Please configure your OpenWeatherMap API key in config.js");
  alert("API key not configured. Please check the configuration file.");
}
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
let weatherIcon = "";
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  dateTime();
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
    getWeather(lat, lon); // Call getWeather only after latlongFetch resolves
    getForecast(lat, lon);
    getRealTimeWeather(lat, lon);
    getExtra(lat, lon);
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
  getWeather(lat, lon); // Call getWeather with the last known lat/lon, if there is none then we just hide this button altogether
  getForecast(lat, lon);
  getRealTimeWeather(lat, lon);
  getExtra(lat, lon);
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
    getWeather(lat, lon);
    getForecast(lat, lon);
    getRealTimeWeather(lat, lon);
    getExtra(lat, lon);
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
      // Coordinates logged for debugging
      getLocationName(lat, lon);
      getWeather(lat, lon);
      getForecast(lat, lon);
      getRealTimeWeather(lat, lon);
      getExtra(lat, lon);
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
  
  if (!cityname || !cityname.trim()) {
    alert("Please enter a city name.");
    document.querySelector(".crystalize").classList.add("hide");
    return;
  }
  
  try {
    const response = await fetch(
      `${config.openWeatherGeoUrl}?q=${encodeURIComponent(cityname)}${stateParam}${countryParam}&limit=5&appid=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const latlong = await response.json();
    if (latlong.length > 0) {
      lat = latlong[0].lat;
      lon = latlong[0].lon;
      // Coordinates fetched successfully
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

function dateTime() {
  setTimeout("dateTime()", 1000);
  const day = new Date().getDay();
  const month = new Date().toLocaleString("en-US", { month: "long" });
  const year = new Date().getFullYear();
  const time = new Date().toLocaleTimeString("en-GB", { hour12: false });

  document.querySelector("#date").textContent = `${month} ${day}, ${year}`;
  document.querySelector("#time").textContent = time;
}
function getLocationName(lat, lon) {
  document.querySelector(".crystalize").classList.remove("hide");
  fetch(
    `${config.openWeatherCurrentUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Weather data received
      if (data.cod !== 200) {
        console.error("API returned error:", data.message);
        document.querySelector(".crystalize").classList.add("hide");
        return;
      }
      const location = data.name;
      const country = data.sys.country;
      document.querySelector("#locationName").textContent =
        location + ", " + country;
    })
    .catch((error) => {
      console.error("Error fetching location name:", error);
      document.querySelector(".crystalize").classList.add("hide");
    });
}
function getWeather(lat, lon) {
  document.querySelector(".weatherforecast").innerHTML = ""; // Clear previous forecast data
  document.querySelector(".crystalize").classList.remove("hide");
  fetch(
    `${config.openWeatherOneCallUrl}?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${apiKey}&units=metric`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Weather data received
      if (data.cod && data.cod !== 200) {
        console.error("API returned error:", data.message);
        document.querySelector(".crystalize").classList.add("hide");
        return;
      }
      const weather = data.current.weather[0].description;
      weatherIcon = data.current.weather[0].icon; // Weather icon code, will convert to actual icons
      document.querySelector(
        ".icon"
      ).src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      //either openweatherAPI is drunk or there is something wrong on my end, no way the temperatures are all the same
      // City name and country code
      const temp = Math.round(data.current.temp);
      const tempmax = Math.round(data.daily[0].temp.max); //until the current weather can return something else rather than 3 same values
      const tempmin = Math.round(data.daily[0].temp.min);
      const realfeel = Math.round(data.current.feels_like);
      const temphue = Math.min(248, Math.max(187 - temp * 6.375, -79));
      const temphsl = `hsl(${temphue}, 100%, 50%)`;
      // Temperature hue calculated for styling
      document.querySelector(".electro-charged").classList.remove("hide");

      document.querySelector("#condition").innerHTML = weather;
      document.querySelector("#temperature").innerHTML = `${temp}°C`; //because fuck imperial
      document.querySelector("#temperature").style.textShadow = `1px 1px 2px ${temphsl}`;
      document.querySelector("#tempmaxmin").innerHTML =
        `<i class="fa-solid fa-temperature-arrow-up"></i> ${tempmax}°C` + " / " + `<i class="fa-solid fa-temperature-arrow-down"></i> ${tempmin}°C`;
      document.querySelector("#feelslike").innerHTML = 
        `<i class="fa-solid fa-temperature-high"></i>  ${realfeel}°C`;
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
    `${config.openWeatherOneCallUrl}?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${apiKey}&units=metric`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Extra weather data received
      if (data.cod && data.cod !== 200) {
        console.error("API returned error:", data.message);
        document.querySelector(".crystalize").classList.add("hide");
        return;
      }
      const humidity = Math.round(data.current.humidity);
      const wind = Math.round(data.current.wind_speed);
      const windDirection = data.current.wind_deg; // Wind direction in degrees
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

      document.querySelector(
        ".humidity"
      ).innerHTML = `<i class="fa-solid fa-droplet"></i> ${humidity}%`;
      document.querySelector(
        ".wind"
      ).innerHTML = `<i class="fa-solid fa-arrow-up direction"></i>  ${wind} km/h`;
      document.querySelector(
        ".direction"
      ).style.transform = `rotate(${windDirection}deg)`; // Rotate the wind icon based on wind direction
      document.querySelector(".uvi").innerHTML = `<i class="fa-solid fa-sun"></i>  ${uvi}`;
      document.querySelector(".dewpoint").innerHTML =
      `<i class="fa-solid fa-leaf"></i>  ${dew}°C`;
      document.querySelector(".sunrise").innerHTML = `<i class="fa-solid fa-up-long"></i> ${sunrise}`;
      document.querySelector(".sunset").innerHTML = `<i class="fa-solid fa-down-long"></i>  ${sunset}`;
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
    `${config.openWeatherOneCallUrl}?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${apiKey}&units=metric`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Forecast data received
      if (data.cod && data.cod !== 200) {
        console.error("API returned error:", data.message);
        document.querySelector(".crystalize").classList.add("hide");
        return;
      }
      data.daily.slice(0, 3).forEach((daily) => {
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
        const daycolor = (() => {
          if (dateOfWeek === "Monday") return "cyan";
          if (dateOfWeek === "Tuesday") return "orange";
          if (dateOfWeek === "Wednesday") return "pink";
          if (dateOfWeek === "Thursday") return "purple";
          if (dateOfWeek === "Friday") return "lime";
          if (dateOfWeek === "Saturday") return "white";
          if (dateOfWeek === "Sunday") return "red";
        })();
        // Day color calculated for styling

        // Append forecast details
        document.querySelector(".weatherforecast").innerHTML += `
      <div class="details">
        <h2 style="text-shadow: 0 0 5px ${daycolor};">${dateOfWeek}</h2>
        <p>${month} ${day}<p>
        <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weather}">
        <h5>${weather}</h5>
        <h4>${tempmax}°C</h4>
        <h4>${tempmin}°C</h4>
        <h5><i class="fa-solid fa-cloud-showers-heavy"></i> ${rainchance}% ${rain}</h5>
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
      // Hourly weather data received
      if (data.cod !== 200) {
        document.querySelector(".electro-charged").classList.remove("hide");
      }
      data.hourly.slice(0, 8).forEach((hourly) => {
        // 48 hours can be fetched in another page
        const weather = hourly.weather[0].description;
        const weatherIcon = hourly.weather[0].icon;
        const hour = new Date(hourly.dt * 1000).getHours();

        const dateOfWeek = new Date(hourly.dt * 1000).toLocaleDateString(
          "en-US",
          {
            weekday: "long",
          }
        );
        const daycolor = (() => {
          if (dateOfWeek === "Monday") return "cyan";
          if (dateOfWeek === "Tuesday") return "orange";
          if (dateOfWeek === "Wednesday") return "pink";
          if (dateOfWeek === "Thursday") return "purple";
          if (dateOfWeek === "Friday") return "lime";
          if (dateOfWeek === "Saturday") return "white";
          if (dateOfWeek === "Sunday") return "red";
        })();

const timehue = (hour / 24) * 360; // Calculate hue based on hour of the day (0-23)
        const timecolor = `hsl(${timehue}, 100%, 50%)`; // Set color based on hour of the day
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
        <h2 style="text-shadow: 0 0 5px ${timecolor};">${hour}</h2>
        <p style="text-shadow: 0 0 5px ${daycolor};">${dateOfWeek}</p>
        </div>
        <div class="sector2">
        <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weather}">
        
        <h3>${foretemp}°C</h3>
        </div>
        <div class="sector3">
        <h4><i class="fa-solid fa-cloud-showers-heavy"></i>${forechance}%</h4>
        <h5>${forerain}</h5>
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
      // Real-time weather data received
      if (data.cod !== 200) {
        document.querySelector(".electro-charged").classList.remove("hide");
      }
      data.minutely.forEach((minute) => {
        const precipitation = Math.round(minute.precipitation * 100) / 100; // Round to 2 decimal places
        const maxPrecipitation = Math.max(
          ...data.minutely.map((minute) => minute.precipitation)
        );
        const timeUntilRain = data.minutely.findIndex(
          (minute) => minute.precipitation > 0
        );
        // const timeUntilRainInMinutes = timeUntilRain !== -1 ? data.minutely[timeUntilRain].dt - data.minutely[0].dt : -1;
        const allRain = data.minutely.every(
          (minute) => minute.precipitation > 0
        );
        const timeUntilDry = data.minutely.findIndex(
          (minute) => minute.precipitation === 0
        );
        // Precipitation timing calculated
        // const timeUntilDryInMinutes = timeUntilDry !== -1 ? data.minutely[timeUntilDry].dt - data.minutely[0].dt : -1;
        if (timeUntilRain === -1) {
          document.querySelector(
            "[time-to-rain]"
          ).innerHTML = `No precipitation in the next 60 minutes`;
        } else if (timeUntilRain !== -1 && timeUntilDry === 0) {
          document.querySelector(
            "[time-to-rain]"
          ).innerHTML = `Precipitation expected in ${timeUntilRain} minutes`;
        } else if (allRain) {
          document.querySelector(
            "[time-to-rain]"
          ).innerHTML = `Rain will continue in the next 60 minutes`;}
       else if (timeUntilDry !== -1 && timeUntilRain !== 0 && timeUntilDry > timeUntilRain) {
          document.querySelector(
            "[time-to-rain]"
          ).innerHTML = `Broken rain over the span of 60 minutes`;
        } else{
          document.querySelector(
            "[time-to-rain]"
          ).innerHTML = `Rain will stop in ${timeUntilDry} minutes`;
        }

        const time = new Date(data.minutely[0].dt * 1000).toLocaleTimeString(
          "en-GB",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }
        );
        const futuretime = new Date(
          new Date().setHours(new Date().getHours() + 1)
        ).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const saturation =
          maxPrecipitation > 0
            ? (precipitation / maxPrecipitation) * 100
            : 0; // Avoid division by zero

        const color = `hsl(136, ${saturation}%, 60.8%)`; // Set color based on precipitation
        document.querySelector(
          "#maxprecip"
        ).innerHTML = `${maxPrecipitation}mm`;
        document.querySelector(".to").innerHTML = `
          <p>${time}</p> <p>${futuretime}</p>`;
        document.querySelector(".realtime").innerHTML += `
  <div class="minute-details" style="background-color: ${color};">
  </div>
`;
      });
    })
    .catch((error) => {
      console.error("Error fetching real-time weather data:", error);
      document.querySelector(".crystalize").classList.add("hide");
    });
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
  } else if (weatherIcon === "10n") {
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
    // Use default coordinates from config
    lat = config.defaultLat;
    lon = config.defaultLon;
    reloadButton.classList.add("hide");
    clearButton.classList.add("hide");
  }

  // Validate coordinates
  if (isNaN(lat) || isNaN(lon)) {
    console.error("Invalid coordinates:", lat, lon);
    lat = config.defaultLat;
    lon = config.defaultLon;
  }

  getLocationName(lat, lon);
  getWeather(lat, lon);
  getForecast(lat, lon);
  getRealTimeWeather(lat, lon);
  getExtra(lat, lon);
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
