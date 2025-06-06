"use client";

import GridRow from "./GridRow";
import { useState, useRef } from "react";
import { useEffect } from "react"

interface GridProps {
  letters: string[];
  rowNum: number;
  gridAmount: number;
  letterCount: number;
  color: number[];
  gameOver: boolean;
  flipping: boolean;
  playAgain: boolean;
}

const Grid: React.FC<GridProps> = ({
  letters,
  rowNum,
  gridAmount,
  letterCount,
  color,
  gameOver,
  flipping,
  playAgain,
}) => {
  const initialWordsArray = new Array(gridAmount + 1).fill("");
  const [words, setWords] = useState(initialWordsArray);

  const initialColorsArray = Array(gridAmount + 1).fill(Array(letterCount).fill(0));
  const [colors, setColors] = useState(initialColorsArray);

  const lastRow = gameOver ? 0 : 1;

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newWords = [...words];
    newWords[rowNum] = letters.join("");
    setWords(newWords);

    const newColors = [...colors];
    newColors[rowNum - lastRow] = color;
    setColors(newColors);

    if (playAgain) {
      setWords(initialWordsArray);
      setColors(initialColorsArray);
    }
  }, [letters, rowNum, lastRow, playAgain, color, colors, initialColorsArray, initialWordsArray, words]);

  return (
    <div className="mt-4" ref={gridRef}>
      {words.map((word, index) => (
        <GridRow
          key={index}
          word={word}
          id={index + 1}
          letterCount={letterCount}
          colorClass={colors[index]}
          flipping={flipping && index === rowNum - lastRow}
        />
      ))}
    </div>
  );
};

export default Grid;