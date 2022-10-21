import React from 'react';
import { CellModel } from '../models/CellModel';
import Cell from './Cell';

interface RowProps {
    cells: CellModel[],
    solveCell: (arg0: number, arg1: number, arg2: number) => void
}

const Row: React.FunctionComponent<RowProps> = ({ cells, solveCell }: RowProps): any => {

    return (
        <tr>
            {cells.map((cell, index) =>
                <Cell
                    cell={cell}
                    solveCell={solveCell}
                    key={index}
                />) ?? <td>building...</td>}
        </tr>
    );
}

export default Row;
