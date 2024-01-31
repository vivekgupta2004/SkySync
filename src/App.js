import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from 'lottie-react';
import loadingAnimation from './loading.json';

function App() {
  const [data, setData] = useState({});
  const [loc, setLoc] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${loc}&units=imperial&appid=b8beb8bcdd794dff7a9e3ad0ad1d232f`;
  const [currentDateTime, setCurrentDateTime] = useState(new Date());


  
  const dateBuilder = (d) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",

    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    return `${day} ${date} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  }
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=b8beb8bcdd794dff7a9e3ad0ad1d232f`
          )
          .then((response) => {
            setData(response.data);
            setError(false);
          })
          .catch((error) => {
            setError(true);
          })
          .finally(() => {
            setLoading(false);
          });
      },
      (error) => {
        setError(true);
        setLoading(false);
      }
    );
  }, []);

  const searchLocation = () => {
    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
        setError(false);
        setLoc("");
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchLocation();
    }
  };

  return (
    <div className="app">
      <div className="search-box">
        <div className="search-input-container">
          <input
            value={loc}
            onChange={(event) => setLoc(event.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Your Location"
            type="text"
          />
          <button className="search-button" onClick={searchLocation}>
            Search
          </button>
        </div>
      </div>
      <div className="container">
        {error ? (
          <div className="error">
            <h1>Wrong location entered</h1>
          </div>
        ) : (
          <div className="top">
            <div className="location">
              <p className="loactiontext" >{data.name}</p>
            </div>
            <div className="weather-icon">
              {data.weather && data.weather[0] ? (
                <img
                  src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`}
                  alt={data.weather[0].description}
                />
              ) : null}
            </div>
            <div className="temp">
              {data.main ? <h1>{((data.main.temp - 32) * 5/9).toFixed()}°C</h1> : null}
            </div>
            <div className="description">
              {data.weather ? (
                <p className="bold">{data.weather[0].main}</p>
              ) : null}
            </div>
          </div>
        )}
          <div className='container_date'>
          <div className='date-time'>
            <p>{dateBuilder(currentDateTime)}</p>
          </div>
        </div>
        {data.name !==undefined && !error && (
          <div className="bottom">
            <div className="feels">
              {data.main ? (
                <p className="bold">{((data.main.feels_like-32)*5/9).toFixed(2)}°C</p>
              ) : null}
              <p>Feels Like</p>
            </div>
            <div className="humidty">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className="bold">{data.wind.speed}MPH</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        )}
         
        {loading && (
          <div className="loading-animation">
          <Lottie loop={true} animationData={loadingAnimation} />
          <h1 className="loadingtext">Loading...</h1>
          <p className="loadingtext">Just Wait</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


