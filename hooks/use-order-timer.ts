"use client";

import { useState, useEffect } from "react";

export function useOrderTimer(createdAt: Date) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = Math.floor((Date.now() - createdAt.getTime()) / 1000);
      setElapsedSeconds(diff);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [createdAt]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isWarning = minutes >= 10;
  const isCritical = minutes >= 20;

  return { minutes, seconds, display, isWarning, isCritical };
}
