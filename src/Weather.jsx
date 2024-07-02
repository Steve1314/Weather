import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from "react-google-charts";
import './Weather.css';
import Logo from './assets/skysnap.png'
import Search from './assets/search.png'
import Wind from './assets/wind.png'
import Sunrise from './assets/sunrise.png'
import Sunset from './assets/sunset.png'
import Pressure from './assets/weather.png'
import Humidity from './assets/humidity.png'
import Sealevel from './assets/sea-level.png'
import Clouds from './assets/clouds.png'


function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState('');

  const apiKey = 'cd5024eadaf1b5ed7e638c278e633ae2';

  useEffect(() => {
    
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
        const weatherResponse = await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        );
        const forecastResponse = await axios.get(
          `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
        );
  
        setWeatherData(weatherResponse.data);
        setForecastData(forecastResponse.data);
        setError('');
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('City not found. Please try again.');
        setWeatherData(null);
        setForecastData(null);
      }
     
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  const chartData = forecastData ? [
    [
      { type: "string", label: "Time" },
      "Temperature (°C)",
    ],
    ...forecastData.list.map((forecast) => [
      forecast.dt_txt,
      Math.round(forecast.main.temp - 273.15),
    ]),
  ] : [];

  const chartOptions = {
    chart: {
      title: "5 Day / 3 Hour Forecast",
    },
    width: 900,
    height: 350,
    vAxis: {
      title: 'Temperature (°C)',
    },
  };

  return (
    <div className="App">
      <div className="left">
        <form onSubmit={handleSubmit}>
            <img src={Logo} />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            required
          />
          <button type="submit"><img src={Search}  /></button>
        </form>
        {error && <p className="error">{error}</p>}

        <div className="card">
        {weatherData && (
          <>
            <img className="img" src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} alt={weatherData.weather[0].main} />
            <div className="maintemp">{(weatherData.main.temp - 273.15).toFixed(1)}°C</div>
            <div className="mainWeather">{weatherData.weather[0].main}</div>
            <div className="name">{weatherData.name}</div>
            <div className="tempMin">Min Temp: {(weatherData.main.temp_min - 273.15).toFixed(1)}°C</div>
            <div className="tempMax">Max Temp: {(weatherData.main.temp_max - 273.15).toFixed(1)}°C</div>
            <div className="windSpeed">
              <img src={Wind} alt="Wind Speed" />
              {weatherData.wind.speed} m/s
            </div>
            <div className="sun">
              <div className="sunrise">
                Sunrise: <img src={Sunrise} alt="Sunrise" />
                {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
              </div>
              <div className="sunset">
                Sunset: <img src={Sunset} alt="Sunset" />
                {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
              </div>
            </div>
          </>
        )}
        {error && <p className="error">{error}</p>}
      </div>
      </div>

      <div className="right">
      {weatherData && (
          <div className='details'>
            <div className="pressure"> <span>Pressure</span>
              <img src={Pressure} alt="Pressure" />
              {weatherData.main.pressure} hPa
            </div>
            <div >
              <div>Humidity</div>
              <img src={Humidity} alt="Humidity" />
              {weatherData.main.humidity}%
            </div>
            <div>
              <div>Sea Level</div>
              <img src={Sealevel} alt="Sea Level" />
              {weatherData.main.sea_level ? `${weatherData.main.sea_level} hPa` : 'N/A'}
            </div>
            <div>
              <div>Clouds</div>
              <img src={Clouds} alt="Clouds" />
              {weatherData.clouds.all}%
            </div>
          </div>
        )}
    <div className='title'>5 Day / 3 hour Forecast</div>
        {forecastData && (
          <div className="forecast-info">
            
            <ul>
              {forecastData.list.map((forecast, index) => (
                <li key={index}>
                   
                     <img 
                     src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
            />
                  <div>{forecast.dt_txt}</div>
                  <div>{Math.round(forecast.main.temp - 273.15)}°C</div>
                  
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className='chart'> <Chart
            chartType="Line"
            width="100%"
            height="400px"
            data={chartData}
            options={chartOptions}
          /></div>
      </div>
      
     
    </div>
    
  );
}

export default App;
