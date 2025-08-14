// Configuration file for API keys and other settings
// In production, these should be environment variables or server-side configuration
const config = {
  // OpenWeatherMap API key - replace with your actual key
  openWeatherApiKey: "YOUR_OPENWEATHER_API_KEY_HERE",
  
  // MapTiler API key - replace with your actual key  
  mapTilerApiKey: "YOUR_MAPTILER_API_KEY_HERE",
  
  // Default coordinates (Kyoto, Japan)
  defaultLat: 35.021041,
  defaultLon: 135.7556075,
  
  // API endpoints
  openWeatherGeoUrl: "https://api.openweathermap.org/geo/1.0/direct",
  openWeatherCurrentUrl: "https://api.openweathermap.org/data/2.5/weather",
  openWeatherOneCallUrl: "https://api.openweathermap.org/data/3.0/onecall",
  mapTilerUrl: "https://api.maptiler.com/maps/basic-v2"
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}