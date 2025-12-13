import { useEffect, useState } from "react";

export const useCounter = (end: number, duration: number) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    // Calculate how much time per step to finish in 'duration' ms
    // If we want 0 -> 365 in 2000ms, we need a step every ~5.5ms
    const stepTime = Math.abs(Math.floor(duration / end));
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
};