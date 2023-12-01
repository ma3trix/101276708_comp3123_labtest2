import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);
  const apiKey = '4dbe7295ad110323b63c9717d1d0e0ee';
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  const citiesApiUrl = '/cities.json';

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesResponse = await axios.get(citiesApiUrl);
        setCities(citiesResponse.data);
      } catch (err) {
        console.error('Error fetching cities:', err);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (city) {
      fetchWeatherData();
    }
  }, [city]);

  const fetchWeatherData = async () => {
    try {
      const selectedCity = cities.find((c) => c.city.toLowerCase() === city.toLowerCase());

      if (!selectedCity) {
        setError('City not found. Please try again.');
        setWeatherData(null);
        return;
      }

      const weatherResponse = await axios.get(apiUrl, {
        params: {
          q: `${selectedCity.city},${selectedCity.iso2}`,
          appid: apiKey,
          units: 'metric',
        },
      });

      setWeatherData(weatherResponse.data);
      setError(null);
    } catch (err) {
      setWeatherData(null);
      setError('Error fetching weather data. Please try again.');
    }
  };

  const getIconUrl = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div className="card">
      <h1>Weather App</h1>
      <div className="input-container">
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="" disabled>Select a city</option>
          {cities.map((cityItem) => (
            <option key={cityItem.city} value={cityItem.city}>
              {cityItem.city}, {cityItem.country}
            </option>
          ))}
        </select>
      </div>
      <div className="button-container">
        {/* Removed the "Get Weather" button */}
      </div>

      {weatherData && (
        <div className="weather-details">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <p>Temperature: {weatherData.main.temp} °C</p>
          {weatherData.weather && weatherData.weather.length > 0 && (
            <div>
              <p>Weather: {weatherData.weather[0].description}</p>
              <img
                src={getIconUrl(weatherData.weather[0].icon)}
                alt={weatherData.weather[0].description}
              />
            </div>
          )}
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Weather;
