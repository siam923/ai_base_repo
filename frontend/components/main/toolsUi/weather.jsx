'use client';

import React from 'react';

export function Weather({ weatherAtLocation }) {
  console.log(weatherAtLocation);

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-4 bg-blue-400 max-w-[500px]">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="size-10 rounded-full bg-yellow-300"></div>
          <div className="text-4xl font-medium text-blue-50">
            {weatherAtLocation.temperature}°C
          </div>
        </div>

        <div className="text-blue-50">{weatherAtLocation.location}</div>
      </div>
    </div>
  );
}
