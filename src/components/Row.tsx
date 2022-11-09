import React from "react";
import { CellModel } from "../models/CellModel";
import Cell from "./Cell";

interface RowProps {
  cells: CellModel[];
  solveCell: (arg0: number, arg1: number, arg2: number) => void;
  editCell: (rowIndex: number, columnIndex: number) => void;
  selectedRowIndex: number;
  selectedColumnIndex: number;
}

const Row: React.FunctionComponent<RowProps> = ({
  cells,
  solveCell,
  editCell,
  selectedRowIndex,
  selectedColumnIndex,
}: RowProps): any => {
  return (
    <tr>
      {cells.map((cell, index) => (
        <Cell
          cell={cell}
          solveCell={solveCell}
          editCell={editCell}
          selectedRowIndex={selectedRowIndex}
          selectedColumnIndex={selectedColumnIndex}
          key={index}
        />
      )) ?? <td>building...</td>}
    </tr>
  );
};

export default Row;
