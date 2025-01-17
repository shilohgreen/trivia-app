"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const [isPushed, setIsPushed] = useState(false);

  const playButtonPushSound = () => {
    const audio = new Audio("/sounds/button-push.mp3");
    audio.play();
  };

  const handleMouseUp = () => {
    setIsPushed(false);
  };

  const handleMouseDown = () => {
    playButtonPushSound();
    setIsPushed(true);
    console.log("mouse down");
  };

  return (
    <div className="w-screen h-screen flex justify-center items-end">
      <div className="relative w-screen h-1/2">
        <div
          className="absolute w-2/3 h-1/3 top-20 left-12 bg-transparent z-10"
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        ></div>
        <Image src="/buttons/button-bottom.svg" alt="Bottom button" fill />
        <Image
          key={isPushed.toString()}
          src={isPushed ? "/buttons/button-top-red-pressed.svg" : "/buttons/button-top-red.svg"}
          alt="Top red button"
          fill
          priority
        />
      </div>
    </div>
  );
}
