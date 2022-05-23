import { useState } from "react";

export const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = ((newMode, replace = false) => {
    setHistory(prev => replace ? [...prev.slice(0, -1), newMode] : [...prev, newMode]);
    setMode(newMode);
  });

  const back = (() => {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      
      setHistory(prev => {
        return [...prev].slice(0, -1);
      });
    }
  });

  return { mode, transition, back };
};