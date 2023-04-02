import React, { useCallback, useEffect, useState } from "react";
import { CellModel } from "../services/CellModel";
import Puzzle from "../services/puzzle";
import Row from "./Row";

const Grid = ({ position }: any) => {
  const [iteration, setIteration] = useState<number>(0);
  const [puzzle, setPuzzle] = useState<Puzzle>();
  const [rows, setRows] = useState<CellModel[][]>([]);
  const [loadStartingPosition, setLoadStartingPosition] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number>(-1);

  const solveCell = useCallback(
    (rowIndex: number, columnIndex: number, solution: number): void => {
      if (!puzzle) {
        throw Error("No puzzle to solve");
      }

      setPuzzle(puzzle.applyCellSolution(rowIndex, columnIndex, solution));
      setIteration((i: number) => {
        return i + 1;
      });
    },
    [puzzle]
  );

  const editCell = (rowIndex: number, columnIndex: number) => {
    setSelectedRowIndex(rowIndex);
    setSelectedColumnIndex(columnIndex);
    puzzle?.checkGrid();
  };

  // Initial setup
  useEffect(() => {
    // Start a new puzzle, allowing for look ahead
    setPuzzle(new Puzzle(true));
  }, []);

  // Load starting position
  useEffect(() => {
    if (puzzle && position && loadStartingPosition) {
      const startPosition: number[][] = require(`./puzzles/${position}.json`);
      for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
        for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
          const solution = startPosition[rowIndex][columnIndex];
          if (solution > 0) {
            solveCell(rowIndex, columnIndex, solution);
          }
        }
      }
    }
  }, [position, puzzle, solveCell, loadStartingPosition]);

  useEffect(() => {
    console.log("Rebuild the rows collection...");

    if (!puzzle) {
      return;
    }

    const map = new Map<string, CellModel>();

    puzzle.cells.forEach((element: CellModel) => {
      const key = getCorordinates(element.rowIndex, element.columnIndex);
      map.set(key, element);
    });

    const rows: CellModel[][] = [];

    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      const newRow: CellModel[] = [];
      for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
        const coords = getCorordinates(rowIndex, columnIndex);
        newRow.push(map.get(coords) ?? new CellModel(-1, -1));
      }
      rows.push(newRow);
    }

    setRows(rows);
  }, [puzzle, solveCell, iteration]);

  const getCorordinates = (rowIndex: number, columnIndex: number) => {
    return `(${rowIndex},${columnIndex})`;
  };

  const handleSaveClick = (): void => {
    puzzle?.save();
  };

  const handleLoadClick = (): void => {
    setPuzzle(puzzle?.load());
  };

  const handleClearClick = (): void => {
    editCell(-1, -1);
    setPuzzle(new Puzzle(true));
    setIteration(0);
    setLoadStartingPosition(false);
  };

  const handleCheckClick = (): void => {
    puzzle?.checkGrid();
    setIteration(0);
  };

  const handleResetClick = (): void => {
    editCell(-1, -1);
    setPuzzle(new Puzzle(true));
    setIteration(0);
    setLoadStartingPosition(true);
  };

  const handleSolveClick = (): void => {
    editCell(-1, -1);
    puzzle?.solvePuzzle();
    setIteration((i: number) => {
      return i + 1;
    });
  };

  return (
    <>
      <table>
        <tbody>
          {rows.map((row, index) => (
            <Row
              key={index}
              cells={row}
              solveCell={solveCell}
              editCell={editCell}
              selectedRowIndex={selectedRowIndex}
              selectedColumnIndex={selectedColumnIndex}
            />
          ))}
        </tbody>
      </table>
      <div>
        <input type="button" value="Save" onClick={handleSaveClick} />
        <input type="button" value="Load" onClick={handleLoadClick} />
        <input type="button" value="Clear" onClick={handleClearClick} />
        <input type="button" value="Check" onClick={handleCheckClick} />
        <input type="button" value="Reset" onClick={handleResetClick} />
        <input type="button" value="Solve" onClick={handleSolveClick} />
      </div>
    </>
  );
};

export default Grid;
