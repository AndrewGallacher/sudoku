import React from 'react';
import { CellModel } from '../models/CellModel';

interface CellProps {
    cell: CellModel,
    solveCell: (arg0: number, arg1: number, arg2: number) => void
}

const Cell: React.FunctionComponent<CellProps> = ({ cell, solveCell }): JSX.Element => {

    const handleClick = () => {
        const solution = parseInt(window.prompt('Solution?') ?? '0');
        solveCell(cell.rowIndex, cell.columnIndex, solution);
    };

    const getClassName = (value: string): string => {
        return `${value} row${cell.rowIndex + 1} column${cell.columnIndex + 1}`;
    };

    // If solved, show solution
    if (cell.solution) {
        return (
            <td className={getClassName('solution')}>{cell.solution}</td>
        );
    }

    // otherwise, show possibles
    return (
        <td className={getClassName('pencil')} onClick={handleClick}>
            {cell.possibleSolutions.map((solution, index) => (
                <span key={`r${cell.rowIndex}c${cell.columnIndex}s${solution}`}>
                    <span>{solution}</span>
                    <span> </span>
                </span>
            ))}
        </td>
    );
}

export default Cell;
