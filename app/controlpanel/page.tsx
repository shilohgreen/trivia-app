"use client";

import React from "react";

export default function ControlPanel() {

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
    <div>
      <h1>Control Panel</h1>
      <button
        className="p-2 bg-pink-500 text-white rounded"
        onClick={() => handleButtonClick("pink", true)}
      >
        Increase
      </button>
      <button
        className="p-2 bg-pink-500 text-white rounded"
        onClick={() => handleButtonClick("pink", false)}
      >
        Decrease
      </button>
    </div>
  );
}
