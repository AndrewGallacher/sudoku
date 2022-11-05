import React, { useState } from "react";
import { CellModel } from "../models/CellModel";

interface CellProps {
  cell: CellModel;
  solveCell: (arg0: number, arg1: number, arg2: number) => void;
}

const Cell: React.FunctionComponent<CellProps> = ({
  cell,
  solveCell,
}): JSX.Element => {
  const [editMode, setEditMode] = useState(false);

  const handleClick = (): void => {
    setEditMode(true);
  };

  const handleEditKeyUp = (e: any): void => {
    if (!isNaN(e.key)) {
      const solution = parseInt(e.key);
      solveCell(cell.rowIndex, cell.columnIndex, solution);
    }

    setEditMode(false);
  };

  const getClassName = (value: string): string => {
    return `${value} row${cell.rowIndex + 1} column${cell.columnIndex + 1}`;
  };

  // If solved, show solution
  if (cell.solution) {
    return <td className={getClassName("solution")}>{cell.solution}</td>;
  }

  // Edit mode?
  if (editMode) {
    return (
      <td>
        <input type="text" autoFocus onKeyUpCapture={handleEditKeyUp} />
      </td>
    );
  }

  // otherwise, show possibles
  return (
    <td className={getClassName("pencil")} onClick={handleClick}>
      {cell.possibleSolutions.map((solution, index) => (
        <span key={`r${cell.rowIndex}c${cell.columnIndex}s${solution}`}>
          <span>{solution}</span>
          <span> </span>
        </span>
      ))}
    </td>
  );
};

export default Cell;
