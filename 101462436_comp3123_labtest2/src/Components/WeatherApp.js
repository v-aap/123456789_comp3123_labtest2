import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/WeatherApp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-solid-svg-icons';

const countryNameMapping = {
  CA: 'Canada',
  US: 'United States',
  FR: 'France',
  JP: 'Japan',
  GB: 'United Kingdom',
  IN: 'India',
  DE: 'Germany',
};

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Toronto, Canada"); 
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );
        setWeatherData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWeatherData();
  }, [city, API_KEY]);

  const handleCityChange = (e) => {
    const userInput = e.target.value.trim();
    if (userInput === "") {
      setCity("Toronto, Canada"); 
    } else {
      setCity(userInput);
    }
  };

  const getFullCountryName = (countryCode) => {
    return countryNameMapping[countryCode] || countryCode; 
  };

  return (
    <div className="weather-app">
      <h1>
        <FontAwesomeIcon icon={faSun} className="sun-icon" />
        Valeria's Weather App
      </h1>
      <p className="search-prompt">
        Search for a city using the format: <strong>City, Country</strong>. Example: <em>Toronto, Canada</em>.
      </p>
      <div>
        <input
          type="text"
          onChange={handleCityChange}
          placeholder="Enter city, country"
        />
        {weatherData && (
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt="Weather Icon"
            className="weather-icon"
          />
        )}
      </div>
      {error && <p className="error">Error: {error}</p>}
      {weatherData ? (
        <div className="weather-details">
          <h2>
            {weatherData.name}, {getFullCountryName(weatherData.sys.country)}
          </h2>
          <p><strong>Temperature: </strong>{Math.round(weatherData.main.temp - 273.15)}°C</p>
          <p><strong>Condition: </strong>{weatherData.weather[0].description}</p>
          <p><strong>Humidity: </strong>{weatherData.main.humidity}%</p>
          <p><strong>Wind Speed: </strong>{weatherData.wind.speed} m/s</p>
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default WeatherApp;
