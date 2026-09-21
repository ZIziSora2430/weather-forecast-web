import { useState, useEffect } from "react";
import axios from "axios";
import { formatDate } from "../utils/formatDate";

export const TemperatureDetail = ({ status }) => {

  const today = new Date();
  const yyyy = String(today.getFullYear());
  const hh = String(today.getHours());

  const { minF, shortMonth, shortDay, ddF } = formatDate(
    today.getMinutes(),
    today.getMonth(),
    today.getDay(),
    today.getDate(),
  );

  return (
    <>
      <div className="flex min-h-full flex-col items-center justify-center text-center">
        <p className="text-gray-400 text-sm">
          {hh > 12 ? hh - 12 : hh}:{minF} {hh > 12 ? "PM" : "AM"}, {shortDay},{" "}
          {shortMonth} {ddF}, {yyyy}
        </p>

        {status && (
          <>
            <div className="flex flex-row items-center">
              <img
                src={`https://openweathermap.org/payload/api/media/file/${status.weather[0].icon}.png`}
                className="w-35 h-35 object-cover"
              />

              <div className="relative flex shrink-0">
                <p className="text-4xl font-bold">{status.main.temp}</p>

                <p className="absolute -top-1 -right-6 text-lg font-semibold">
                  &deg;C
                </p>
              </div>
            </div>

            <p className="text-2xl font-semibold">{status.weather[0].main}</p>

            <div className="flex flex-row justify-center gap-8 mt-8">
              <div className="flex flex-col items-center ">
                <p className="text-gray-400">Humidity</p>
                <p>{status.main.humidity}%</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-gray-400">Wind Speed</p>
                <p>{status.wind.speed} m/s</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
