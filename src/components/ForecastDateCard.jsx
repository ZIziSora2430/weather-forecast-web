import { formatDate } from "../utils/formatDate";

export const ForecastDateCard = ({ forecast }) => {
  const date = new Date(forecast.dt * 1000);
  const today = new Date();
  const { minF, shortMonth, shortDay, ddF } = formatDate(
    date.getMinutes(),
    date.getMonth(),
    date.getDay(),
    date.getDate(),
  );

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return (
    <div
      className={`shadow-lg  rounded-2xl flex flex-col items-center p-10 m-1 ${
        isToday ? "bg-blue-400 " : "bg-white border-gray-200 border"
      }`}
    >
      <p className={`font-bold ${isToday ? "text-white" : "text-gray-900"}`}>
        {isToday ? "Today" : ddF}
      </p>

      <img
        className="w-20 h-20 object-cover"
        src={`https://openweathermap.org/payload/api/media/file/${forecast.weather[0].icon}.png`}
        alt="weather"
      />

      <p className={`text-sm ${isToday ? "text-white" : "text-gray-400"}`}>
        Humidity
      </p>

      <p
        className={
          isToday ? "text-white font-semibold" : "text-gray-600 font-light"
        }
      >
        {forecast.main.humidity}%
      </p>
    </div>
  );
};
