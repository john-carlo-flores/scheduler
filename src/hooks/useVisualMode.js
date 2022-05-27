import { useState } from "react";

export const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // Push new mode to the end of the history and set to current mode
  // If replace is true, overwrite last element in history instead of append
  const transition = ((newMode, replace = false) => {
    setHistory(prev => replace ? [...prev.slice(0, -1), newMode] : [...prev, newMode]);
    setMode(newMode);
  });

  // Pop last mode in History and set mode to last item after pop
  // Prevent from reverting past initial mode
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