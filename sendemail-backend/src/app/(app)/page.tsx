"use client";

import React from "react";
import { useScore } from "./ScoreProvider";

const HomePage = () => {
  const { score } = useScore();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Live Cricket Score</h1>
      <p className="text-xl mt-4">Current Score: <span className="font-semibold">{score}</span></p>
    </div>
  );
};

export default HomePage;
