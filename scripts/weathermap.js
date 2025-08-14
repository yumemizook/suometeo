// Import configuration
// const apiKey = "c4f58d4cdd136760eb52085ad054767f";

// Use configuration for API key
const apiKey = config.openWeatherApiKey;

// Validate API key
if (!apiKey || apiKey === "YOUR_OPENWEATHER_API_KEY_HERE") {
  console.error("Please configure your OpenWeatherMap API key in config.js");
  alert("API key not configured. Please check the configuration file.");
}

getWeatherMap();

function getWeatherMap(){
    const layer = "precipitation_new";
    const z = 0;
    const x = 0;
    const y = 0;
fetch(`https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${apiKey}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.blob();
    })
    .then(blob => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(blob);
        img.alt = "Weather Map Layer";
        img.style.width = "auto"; // Adjust the width as needed
        img.style.height = "100%"; // Maintain aspect ratio
        document.getElementById("overlay").appendChild(img);
    })
    .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
    }); 
    
}
function getWorldMap(){
    
}