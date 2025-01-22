"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function HomePage() {
  console.log("HomePage");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPushed, setIsPushed] = useState(false);

  useEffect(() => {
    if (isPushed) {
      const intervalId = setInterval(() => {
        console.log("Reset heartbeat");
      }, 1000);

      return () => clearInterval(intervalId); // CLean up will only be needed if it enters the if block
    }
  }, [isPushed]);

  useEffect(() => {
    // Initialize the audio instance once on component mount
    audioRef.current = new Audio("/sounds/button-push.mp3");

    // Set button state based on backend state
    fetch("/api/ispushed")
      .then((response) => response.json())
      .then((data) => {
        const isPushed = data.message;
        console.log("isPushed: ", isPushed);
        setIsPushed(isPushed);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleMouseDown = async (e: React.TouchEvent) => {
    if (isPushed) {
      // If its already pushed just dont do anything
      return;
    }

    try {
      if (audioRef.current) {
        await audioRef.current.play();
        console.log("Playback started");
      }
    } catch (err: unknown) {
      // If cant play audio, just dont do anything
      console.log("Audio Playback failed");
      return;
    }

    // Send buzzer request to backend
    fetch("/api/buzzer")
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data);
      })
      .catch((error) => console.error("Error:", error));

    // Set button state to pushed
    console.log("button pushed");
    setIsPushed(true);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-end">
      <div className="relative w-screen h-1/2">
        <div
          className="absolute w-2/3 h-1/3 top-20 left-12 bg-transparent z-10"
          onTouchStart={(e: React.TouchEvent) => handleMouseDown(e)}
        ></div>
        <Image src="/buttons/button-bottom.svg" alt="Bottom button" fill />
        <Image
          key={isPushed.toString()}
          src={
            isPushed
              ? "/buttons/button-top-red-pressed.svg"
              : "/buttons/button-top-red.svg"
          }
          alt="Top red button"
          fill
          priority
        />
      </div>
    </div>
  );
}
