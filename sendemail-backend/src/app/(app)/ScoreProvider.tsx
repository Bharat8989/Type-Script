"use client";

import React, { createContext, useState, useContext } from "react";

interface ScoreContextType {
  score: number;
  updateScore: (newScore: number) => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [score, setScore] = useState<number>(0); // ✅ Keep score in global state

  const updateScore = (newScore: number) => {
    setScore(newScore); // ✅ Updates global state
  };

  return (
    <ScoreContext.Provider value={{ score, updateScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error("useScore must be used within a ScoreProvider");
  }
  return context;
};
