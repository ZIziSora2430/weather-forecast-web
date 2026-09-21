import { useState, useEffect } from "react";
import "./App.css";
import { TemperatureDetail } from "./components/TemperatureDetails";
import { ForecastWeather } from "./components/ForecastWeather";
import axios from "axios";

function App() {
  const [location, setLocation] = useState({
    lat: null,
    lon: null,
  });

  const [status, setStatus] = useState(null);
  const londonCoordinates = {
    lat: 51.5074,
    lon: -0.1278,
  };

  function success(pos) {
    const crd = pos.coords;
    setLocation({
      lat: crd.latitude,
      lon: crd.longitude,
    });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  useEffect(() => {
    if (location.lat === null || location.lon === null) {
      location.lat = londonCoordinates.lat;
      location.lon = londonCoordinates.lon;
    }
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=aab64aa1d7106654a2f85d74605d0bcb`,
      )
      .then((response) => {
        setStatus(response.data);
      })
      .catch((error) => {
        console.log(error.response?.status);
        console.log(error.response?.data);
      });
  }, [location]);

  return (
    <>
      <div className="bg-white w-full mt-20 mb-20 rounded-xl  p-5">
        <div className="flex flex-row gap-2 items-center">
          <p className="">Your city</p>
          <p className="p-1 w-40 border border-gray-400 rounded-md">
            {status ? status.name : "London"}
          </p>
        </div>
        <div className="flex min-h-125 flex-row items-stretch justify-center gap-20">
          <div className="w-[30%] flex items-center justify-center">
            <TemperatureDetail status={status} />
          </div>

          <div className="w-[70%]">
            <ForecastWeather location={location} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
