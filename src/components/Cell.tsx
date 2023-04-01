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
    if (e.code === "Backspace") {
      let rowIndex = cell.rowIndex;
      let columnIndex = cell.columnIndex;

      if (columnIndex > 0) {
        columnIndex--;
      } else {
        rowIndex = rowIndex > 0 ? rowIndex - 1 : 8;
        columnIndex = 8;
      }

      solveCell(rowIndex, columnIndex, 0);
      editCell(rowIndex, columnIndex);
      return;
    }

    if (e.code === "ArrowUp") {
      editCell(cell.rowIndex > 0 ? cell.rowIndex - 1 : 8, cell.columnIndex);
      return;
    }

    if (e.code === "ArrowDown") {
      editCell(cell.rowIndex < 8 ? cell.rowIndex + 1 : 0, cell.columnIndex);
      return;
    }

    if (e.code === "ArrowLeft") {
      editCell(cell.rowIndex, cell.columnIndex > 0 ? cell.columnIndex - 1 : 8);
      return;
    }

    if (e.code === "ArrowRight") {
      editCell(cell.rowIndex, cell.columnIndex < 8 ? cell.columnIndex + 1 : 0);
      return;
    }

    if (e.key === " " || e.key === "0" || isNaN(e.key)) {
      solveCell(cell.rowIndex, cell.columnIndex, 0);
    } else {
      const solution = parseInt(e.key);
      solveCell(cell.rowIndex, cell.columnIndex, solution);
    }

    if (cell.columnIndex < 8) {
      editCell(cell.rowIndex, cell.columnIndex + 1);
    } else if (cell.rowIndex < 8) {
      editCell(cell.rowIndex + 1, 0);
    } else {
      editCell(0, 0);
    }
  };

  const getClassName = (value: string): string => {
    return `${value} row${cell.rowIndex + 1} column${cell.columnIndex + 1} ${
      cell.isValid ? "" : "invalid"
    }`;
  };

  // Edit mode?
  if (
    cell.rowIndex === selectedRowIndex &&
    cell.columnIndex === selectedColumnIndex
  ) {
    return (
      <td className={getClassName("edit")}>
        <input
          type="text"
          autoFocus
          onKeyUpCapture={handleEditKeyUp}
          defaultValue={cell.solution || ""}
        />
      </td>
    );
  }

  // If solved, show solution
  if (cell.solution) {
    return (
      <td className={getClassName("solution")} onClick={handleClick}>
        {cell.solution}
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
