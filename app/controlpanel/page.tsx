"use client";

import React, { useEffect, useState } from "react";

export default function ControlPanel() {
  const [positions, setPositions] = useState<string[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPositions();
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const resetButtons = async () => {
    try {
      const response = await fetch("/api/resetpositions");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Reset response:", data.message);
    } catch (error) {
      console.error("Error resetting buttons:", error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await fetch("/api/positions");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched positions:", data.positions);
      setPositions(data.positions);
      return data.positions;
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  const handleButtonClick = async (teamColour: string, isIncrease: boolean) => {
    const response = await fetch("/api/changescore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamColour, isIncrease }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Control Panel</h1>
      <div className="grid grid-cols-2 gap-4">
        <button
          className="p-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
          onClick={() => handleButtonClick("pink", true)}
        >
          Increase Pink
        </button>
        <button
          className="p-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
          onClick={() => handleButtonClick("pink", false)}
        >
          Decrease Pink
        </button>
        <button
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => handleButtonClick("blue", true)}
        >
          Increase Blue
        </button>
        <button
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => handleButtonClick("blue", false)}
        >
          Decrease Blue
        </button>
        <button
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          onClick={() => handleButtonClick("green", true)}
        >
          Increase Green
        </button>
        <button
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          onClick={() => handleButtonClick("green", false)}
        >
          Decrease Green
        </button>
        <button
          className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          onClick={() => handleButtonClick("purple", true)}
        >
          Increase Purple
        </button>
        <button
          className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          onClick={() => handleButtonClick("purple", false)}
        >
          Decrease Purple
        </button>
        <button
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={() => handleButtonClick("red", true)}
        >
          Increase Red
        </button>
        <button
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={() => handleButtonClick("red", false)}
        >
          Decrease Red
        </button>
        <button
          className="p-2 bg-red-700 text-white rounded hover:bg-red-800 transition"
          onClick={async () => {
            resetButtons()
          }}
        >
          Reset Buttons
        </button>
        <button
          className="p-2 bg-red-700 text-white rounded hover:bg-red-800 transition"
          onClick={async () => {
            fetchPositions()
          }}
        >
          Fetch Positions
        </button>
        {positions.length > 0 &&
          positions.map((colour) => (
            <div
              key={`${colour}-decrease`}
              className={`p-2 bg-${colour}-500 text-white rounded hover:bg-${colour}-600 transition`}
            >
              B {colour.charAt(0).toUpperCase() + colour.slice(1)}
            </div>
          ))}
      </div>
    </div>
  );
}
