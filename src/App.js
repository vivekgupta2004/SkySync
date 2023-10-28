import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import loadingAnimation from './loading.json';



 function App() {
  const [data, setData] = useState({})
  const [location, setLocation] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  /* const [res,setRes] = useState("") */


  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=2754dfca540b9ca12f00bcb0043febc9`;



  /*   const options = {
      method: 'GET',
      url: 'https://forecast9.p.rapidapi.com/rapidapi/forecast/Ghaziabad/summary/',
      headers: {
        'X-RapidAPI-Key': 'f5f315d086msh22e4e2a7f438e71p16a8f8jsn1609b2aabfec',
        'X-RapidAPI-Host': 'forecast9.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log(response.data);
      setRes(response)
    } catch (error) {
      console.error(error);
    }
     */




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
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=2754dfca540b9ca12f00bcb0043febc9`
        ).then((response) => {
          setData(response.data);
          setError(false);
        }).catch((error) => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }, (error) => {
      setError(true);
      setLoading(false);
    }
    );
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const searchLocation = () => {
    setLoading(true);
    axios.get(url).then((response) => {
      setData(response.data)
      setError(false);
      setLocation("");
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    })
      .catch((error) => {
        setError(true);
        setLoading(false);
      });


  }
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchLocation();
    }
  };
  return (
    <div className='app'>
      <div className='search'>
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={handleKeyPress}
          placeholder='Enter Location'
          type="text"
        />
        <button className="search-button" onClick={searchLocation}>
          Search
        </button>
      </div>
      <div className='container'>
        {error ? (
          <div className="error">
            <h1>Wrong location entered</h1>
          </div>
        ) : (
          <div className='top'>
            <div className='location'>
              <p>{data.name}</p>
            </div>
            <div className="weather-icon">
              {data.weather && data.weather[0] ? (
                <img
                  src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`}
                />
              ) : null}
            </div>
            <div className='temp'>
              {data.main ? <h1>{((data.main.temp - 32) * 5 / 9).toFixed()}°C</h1> : null}

            </div>
            <div className='description'>
              {data.weather ? <p>{data.weather[0].main}</p> : null}

            </div>
          </div>
        )}

        <div className='date-time'>
          <p>{dateBuilder(currentDateTime)}</p>
        </div>

        {data.name != undefined && !error && (
          <div className='bottom'>
            <div className='feels'>
              {data.main ? <p className='bold'>{((data.main.feels_like - 32) * 5 / 9).toFixed()}°C</p> : null}
              <p>Feels like</p>
            </div>
            <div className='humidity'>
              {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className='wind'>
              {data.wind ? <p className='bold'>{data.wind.speed.toFixed()}MPH</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        )}
        <div>

        </div>

        {loading && (
          <div className="loading-animation">
            <Lottie loop={true} animationData={loadingAnimation} />
            <h1 className="loadingtext">Loading...</h1>
            <p className="loadingtext">Just Wait</p>
          </div>
        )}

        {/* {res} */}
      </div>
    </div>
  )
}
export default App;