# SuoMeteo - Weather Application

A modern weather application built with vanilla JavaScript, HTML, and CSS that provides current weather conditions, hourly forecasts, daily forecasts, and weather maps.

## Features

- **Current Weather**: Real-time weather information with temperature, humidity, wind, and more
- **Hourly Forecast**: 48-hour detailed weather forecast
- **Daily Forecast**: 8-day weather forecast
- **Weather Map**: Interactive weather map using MapTiler
- **Location Management**: Save and manage favorite locations
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-location**: Get weather for your current location

## Setup Instructions

### 1. API Keys Configuration

Before running the application, you need to configure your API keys:

1. **OpenWeatherMap API Key**:
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key
   - Edit `scripts/config.js` and replace `YOUR_OPENWEATHER_API_KEY_HERE` with your actual key

2. **MapTiler API Key** (for weather map):
   - Sign up at [MapTiler](https://maptiler.com/)
   - Get your free API key
   - Edit `scripts/config.js` and replace `YOUR_MAPTILER_API_KEY_HERE` with your actual key

### 2. Running the Application

1. Clone or download this repository
2. Configure your API keys as described above
3. Open `index.html` in your web browser
4. Allow location access when prompted (optional)

## Recent Fixes Applied

- ✅ Fixed duplicate `style` attributes in HTML elements
- ✅ Added missing spaces in button attributes
- ✅ Fixed mismatched heading tags
- ✅ Moved hardcoded API keys to configuration file
- ✅ Improved error handling for API calls
- ✅ Added proper input validation
- ✅ Fixed button positioning with proper CSS units
- ✅ Added alt text for accessibility
- ✅ Improved z-index management for map overlay
- ✅ Added API key validation
- ✅ Enhanced error messages and user feedback

## File Structure

```
├── index.html          # Main weather page
├── hourly.html         # Hourly forecast page
├── daily.html          # Daily forecast page
├── weathermap.html     # Weather map page
├── scripts/
│   ├── config.js       # Configuration and API keys
│   ├── current.js      # Main weather functionality
│   ├── hourly.js       # Hourly forecast logic
│   ├── daily.js        # Daily forecast logic
│   └── weathermap.js   # Map functionality
├── styles/
│   ├── mobile.css      # Mobile-specific styles
│   ├── hourly.css      # Hourly page styles
│   ├── daily.css       # Daily page styles
│   └── weathermap.css  # Map page styles
└── weather-bg/         # Weather background images
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Feel free to submit issues and enhancement requests!
