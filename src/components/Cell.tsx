import React from "react";
import { CellModel } from "../services/CellModel";

interface CellProps {
  cell: CellModel;
  solveCell: (arg0: number, arg1: number, arg2: number) => void;
  editCell: (rowIndex: number, columnIndex: number) => void;
  selectedRowIndex: number;
  selectedColumnIndex: number;
}

const Cell: React.FunctionComponent<CellProps> = ({
  cell,
  solveCell,
  editCell,
  selectedRowIndex,
  selectedColumnIndex,
}): JSX.Element => {
  const handleClick = (): void => {
    editCell(cell.rowIndex, cell.columnIndex);
  };

  const handleEditKeyUp = (e: any): void => {
    if (!isNaN(e.key)) {
      const solution = parseInt(e.key);
      solveCell(cell.rowIndex, cell.columnIndex, solution);
    }

    editCell(-1, -1);
  };

  const getClassName = (value: string): string => {
    return `${value} row${cell.rowIndex + 1} column${cell.columnIndex + 1}`;
  };

  // If solved, show solution
  if (cell.solution) {
    return (
      <td className={getClassName("solution")} onClick={handleClick}>
        {cell.solution}
      </td>
    );
  }

  // Edit mode?
  if (
    cell.rowIndex === selectedRowIndex &&
    cell.columnIndex === selectedColumnIndex
  ) {
    return (
      <td className={getClassName("edit")}>
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
