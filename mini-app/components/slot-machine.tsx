"use client";

import { useState, useEffect } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"];

function getRandomFruit() {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit)));
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    // initial fill
    setGrid(Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit)));
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWin(false);
    const interval = setInterval(() => {
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]);
        // shift rows down
        newGrid[2] = newGrid[1];
        newGrid[1] = newGrid[0];
        newGrid[0] = Array.from({ length: 3 }, getRandomFruit);
        return newGrid;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      // check win
      const centerRow = grid[1];
      if (centerRow[0] === centerRow[1] && centerRow[1] === centerRow[2]) {
        setWin(true);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="grid grid-cols-3 gap-2">
          {grid.map((row, rowIndex) =>
            row.map((fruit, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="flex justify-center items-center">
                <img src={`/${fruit.toLowerCase()}.png`} alt={fruit} width={64} height={64} />
              </div>
            ))
          )}
        </div>
        <div className="absolute left-0 top-0 h-full w-1 bg-red-500" />
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50"
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {win && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-green-600 font-semibold">You win!</span>
          <Share text={`I just won a slot machine game! ${url}`} />
        </div>
      )}
    </div>
  );
}
