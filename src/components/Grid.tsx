import React, { useCallback, useEffect, useState } from 'react';
import { CellModel } from '../models/CellModel';
import Puzzle from '../services/puzzle';
import Row from './Row';

const Grid = (props: any) => {

    const [iteration, setIteration] = useState<number>(0);
    const [puzzle, setPuzzle] = useState<Puzzle>();
    const [rows, setRows] = useState<CellModel[][]>([]);

    const solveCell = useCallback((rowIndex: number, columnIndex: number, solution: number): void => {

        console.log('solveCell', `row: ${rowIndex}, coludmn: ${columnIndex}, solution: ${solution}`)

        if (!puzzle) {
            throw Error('No puzzle to solve');
        }

        setPuzzle(puzzle.applyCellSolution(rowIndex, columnIndex, solution));
        setIteration((i: number) => { return (i + 1); });
    }, [puzzle]);

    useEffect(() => {
        console.log('useEffect A');
        setPuzzle(new Puzzle());


    }, [props]);

    useEffect(() => {
        console.log('useEffect C');

        if (!puzzle) {
            return;
        }

        // moderate
        // const init = [
        //     [3, 8, 0, 0, 0, 4, 0, 7, 0],
        //     [4, 0, 0, 0, 6, 0, 0, 5, 1],
        //     [0, 0, 0, 0, 9, 3, 0, 0, 0],
        //     [0, 0, 0, 5, 0, 2, 6, 0, 4],
        //     [0, 1, 7, 0, 0, 0, 5, 2, 0],
        //     [2, 0, 5, 9, 0, 6, 0, 0, 0],
        //     [0, 0, 0, 7, 4, 0, 0, 0, 0],
        //     [5, 3, 0, 0, 8, 0, 0, 0, 7],
        //     [0, 7, 0, 3, 0, 0, 0, 4, 6]
        // ];

        // challenging
        const init = [
            [0, 0, 0, 0, 8, 2, 0, 0, 0],
            [0, 0, 0, 0, 5, 9, 4, 3, 2],
            [0, 3, 0, 0, 0, 0, 0, 0, 5],
            [6, 0, 0, 1, 9, 0, 5, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 4, 0, 7, 5, 0, 0, 6],
            [1, 0, 0, 0, 0, 0, 0, 9, 0],
            [5, 7, 3, 9, 6, 0, 0, 0, 0],
            [0, 0, 0, 8, 4, 0, 0, 0, 0]
        ];

        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
                const solution = init[rowIndex][columnIndex];
                if (solution > 0) {
                    solveCell(rowIndex, columnIndex, solution);
                }
            }
        }

        /*
        solveCell(0, 0, 6);
        solveCell(0, 1, 5);
        solveCell(0, 3, 8);
        solveCell(0, 7, 4);

        solveCell(1, 0, 7);
        solveCell(1, 6, 9);
        solveCell(1, 7, 2);
        solveCell(1, 8, 6);

        solveCell(2, 3, 6);
        solveCell(2, 4, 7);
        solveCell(2, 5, 1);
        solveCell(2, 7, 5);

        solveCell(3, 0, 4);
        solveCell(3, 2, 7);
        solveCell(3, 4, 3);
        solveCell(3, 6, 8);

        solveCell(4, 2, 5);
        solveCell(4, 3, 7);
        solveCell(4, 5, 8);
        solveCell(4, 6, 4);

        solveCell(5, 2, 8);
        solveCell(5, 4, 6);
        solveCell(5, 6, 5);
        solveCell(5, 8, 9);

        solveCell(6, 1, 9);
        solveCell(6, 3, 2);
        solveCell(6, 4, 8);
        solveCell(6, 5, 7);

        solveCell(7, 0, 3);
        solveCell(7, 1, 7);
        solveCell(7, 2, 4);
        solveCell(7, 8, 5);

        solveCell(8, 1, 1);
        solveCell(8, 5, 3);
        solveCell(8, 7, 9);
        solveCell(8, 8, 7);
*/
    }, [puzzle, solveCell]);

    useEffect(() => {

        console.log('useEffect B');

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

    const handleSolveClick = (): void => {
        puzzle?.solvePuzzle();
        setIteration((i: number) => { return (i + 1); });
    };

    return (
        <>
            <table>
                <tbody>
                    {rows.map((row, index) => <Row key={index} cells={row} solveCell={solveCell} />)}
                </tbody>
            </table>
            <input type='button' value='Solve' onClick={handleSolveClick} />
        </>
    );
}

export default Grid;
