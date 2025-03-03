"use client";

import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";

export default function ControlPanel() {
  const [positions, setPositions] = useState<string[]>([]);
  const [points, setPoints] = useState<Record<string, number | undefined>>({
    blue: undefined,
    green: undefined,
    pink: undefined,
    purple: undefined,
    red: undefined,
  });

  type TeamColor = 'blue' | 'red' | 'green' | 'pink' | 'purple';
  const bgColorMap: Record<TeamColor, string> = {
    blue: "bg-blue-400",
    red: "bg-red-400",
    green: "bg-green-400",
    pink: "bg-pink-400",
    purple: "bg-purple-400"
  };

  const fetchScores = async () => {
    try {
      const response = await fetch("/api/changescore");
      const data = await response.json();
      console.log(data);
      setPoints(data.updatedScores);
    } catch (error) {
      console.error("Error fetching changescore:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPositions();
    }, 500);
    fetchScores();
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
      const positions = data.positions.map(
        (pos: string) => JSON.parse(pos).teamColour as TeamColor
      );
      setPositions(positions);
      return positions;
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  const handleButtonClick = async (teamColour: TeamColor, isIncrease: boolean) => {
    console.log("handleButtonClick", teamColour, isIncrease);
    const response = await fetch("/api/changescore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamColour, isIncrease }),
    });

    const data = await response.json();
    if (data) {
      setPoints(data.updatedScores);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Control Panel</h1>

      <div className="space-y-4">
        {/* Pink and Blue Teams Row */}
        <div className="flex md:flex-row gap-4">
          {/* Pink Team Controls */}
          <div className="flex-1 bg-pink-50 p-4 rounded-lg">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-pink-700">Pink Team</h2>
              <div className="text-3xl font-bold text-pink-600">
                {points.pink ?? 0}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={() => handleButtonClick("pink", false)}
              >
                −
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => handleButtonClick("pink", true)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Blue Team Controls */}
          <div className="flex-1 bg-blue-50 p-4 rounded-lg">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-blue-700">Blue Team</h2>
              <div className="text-3xl font-bold text-blue-600">
                {points.blue ?? 0}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => handleButtonClick("blue", false)}
              >
                −
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleButtonClick("blue", true)}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        {/* Green and Purple Teams Row */}
        <div className="flex md:flex-row gap-4">
          {/* Green Team Controls */}
          <div className="flex-1 bg-green-50 p-4 rounded-lg">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-green-700">Green Team</h2>
              <div className="text-3xl font-bold text-green-600">
                {points.green ?? 0}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                fullWidth
                variant="outlined"
                color="success"
                onClick={() => handleButtonClick("green", false)}
              >
                −
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={() => handleButtonClick("green", true)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Purple Team Controls */}
          <div className="flex-1 bg-purple-50 p-4 rounded-lg">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-purple-700">
                Purple Team
              </h2>
              <div className="text-3xl font-bold text-purple-600">
                {points.purple ?? 0}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={() => handleButtonClick("purple", false)}
              >
                −
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => handleButtonClick("purple", true)}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        {/* Red Team and Admin Controls Row */}
        <div className="flex gap-4">
          {/* Red Team Controls */}
          <div className="flex-1 bg-red-50 p-4 rounded-lg">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-red-700">Red Team</h2>
              <div className="text-3xl font-bold text-red-600">
                {points.red ?? 0}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={() => handleButtonClick("red", false)}
              >
                −
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => handleButtonClick("red", true)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Admin Controls */}
          <div className="flex-1 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
              Admin Controls
            </h2>
            <div className="flex flex-col gap-2">
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={resetButtons}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Active Positions Display */}
        {positions.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
              Active Positions
            </h2>
            <div className="flex flex-col gap-2">
              {positions.map((colour) => (
                <div
                  key={`${colour}-decrease`}
                  className={`p-2 ${bgColorMap[colour as TeamColor]} rounded text-center font-semibold`}
                >
                  {colour}
                </div>
              )).reverse()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
