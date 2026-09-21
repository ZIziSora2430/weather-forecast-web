import { useEffect, useState } from "react";
import axios from "axios";
import { ForecastDateCard } from "./ForecastDateCard";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const ForecastChart = ({ forecast }) => {
  const dailyData = {};

  forecast.list.forEach((item) => {
    const date = new Date(item.dt * 1000);

    const dateKey = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });

    if (!dailyData[dateKey]) {
      dailyData[dateKey] = [];
    }

    dailyData[dateKey].push(item.main.temp);
  });

  const chartData = Object.entries(dailyData).map(([date, temperatures]) => {
    const average =
      temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;

    return {
      date,
      temp: Number(average.toFixed(1)),
    };
  });

  const data = {
    labels: chartData.map((item) => item.date),
    datasets: [
      {
        label: "Temperature",
        data: chartData.map((item) => item.temp),
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        borderColor: "#76C0EC",
        fill: true,
        backgroundColor: "rgba(227, 242, 253, 0.8)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 2,
        },
        title: {
          text: "Temperature (°C)",
        },
      },
      x: {
        title: {
          text: "Date",
        },
      },
    },
  };

  return (
    <div className="w-full h-65 mb-5">
      <Line data={data} options={options} />
    </div>
  );
};

export const ForecastWeather = ({ location }) => {
  const [status, setStatus] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    if (location.lat === null || location.lon === null) return;

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`,
      )
      .then((response) => {
        setStatus(response.data);
      })
      .catch((error) => {
        console.log(error.response?.status);
        console.log(error.response?.data);
      });
  }, [location]);

  const getDailyForecast = (list) => {
    const daily = {};

    list.forEach((item) => {
      const date = new Date(item.dt * 1000);

      const dateKey = date.toLocaleDateString("en-CA");

      const hour = date.getHours();

      // Nếu ngày này chưa có data
      if (!daily[dateKey]) {
        daily[dateKey] = item;
        return;
      }

      // Chọn mốc gần 12h trưa nhất
      const currentHour = new Date(daily[dateKey].dt * 1000).getHours();

      if (Math.abs(hour - 12) < Math.abs(currentHour - 12)) {
        daily[dateKey] = item;
      }
    });

    return Object.values(daily);
  };

  if (!status) {
    return null;
  }

  const dailyForecast = getDailyForecast(status.list);

  // Lấy tối đa 3 card tại một thời điểm
  const visibleForecasts = dailyForecast.slice(currentIndex, currentIndex + 3);

  const handleNext = () => {
    if (currentIndex + 3 < dailyForecast.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  return (
    <>
      <p className="text-gray-400 text-md">Temperature</p>

      {status && (
        <>
          <ForecastChart forecast={status} />

          <div className="relative w-full">
            {/* Forecast cards */}
            <div className="flex flex-row gap-4 overflow-hidden">
              {visibleForecasts.map((item, index) => (
                <div key={item.dt} className="flex-1 min-w-0">
                  <ForecastDateCard forecast={item} />
                </div>
              ))}
            </div>

            {/* Previous button */}
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute top-1/2 -left-5 -translate-y-1/2
                     z-10 flex items-center justify-center
                     w-10 h-10 rounded-full
                     bg-white shadow-md
                     disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="text-xl">‹</span>
            </button>

            {/* Next button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex + 3 >= dailyForecast.length}
              className="absolute top-1/2 -right-5 -translate-y-1/2
                     z-10 flex items-center justify-center
                     w-10 h-10 rounded-full
                     bg-white shadow-md
                     disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="text-xl">›</span>
            </button>
          </div>
        </>
      )}
    </>
  );
};
