import React, { useCallback, useEffect, useState } from 'react';
import { CellModel } from '../models/CellModel';
import Puzzle from '../services/puzzle';
import Row from './Row';

const Grid = (props: any) => {

    const [iteration, setIteration] = useState<number>(0);
    const [puzzle, setPuzzle] = useState<Puzzle>();
    const [rows, setRows] = useState<CellModel[][]>([]);

    const solveCell = useCallback((rowIndex: number, columnIndex: number, solution: number): void => {

      //   console.log('solveCell', `row: ${rowIndex}, coludmn: ${columnIndex}, solution: ${solution}`)
    
        if (!puzzle) {
            throw Error('No puzzle to solve');
        }

        setPuzzle(puzzle.applyCellSolution(rowIndex, columnIndex, solution));
        setIteration((i: number) => { return (i + 1); });
    }, [puzzle]);

    useEffect(() => {
        //      console.log('useEffect A');
        setPuzzle(new Puzzle());


    }, [props]);

    useEffect(() => {
        //     console.log('useEffect C');

        if (!puzzle) {
            return;
        }

        // easy 
        const easy = [
            [6, 5, 0, 8, 0, 0, 0, 4, 0],
            [7, 0, 0, 0, 0, 0, 9, 2, 6],
            [0, 0, 0, 6, 7, 1, 0, 5, 0],
            [4, 0, 7, 0, 3, 0, 8, 0, 0],
            [0, 0, 5, 7, 0, 8, 4, 0, 0],
            [0, 0, 8, 0, 6, 0, 5, 0, 9],
            [0, 9, 0, 2, 8, 7, 0, 0, 0],
            [3, 7, 4, 0, 0, 0, 0, 0, 5],
            [0, 1, 0, 0, 0, 3, 0, 9, 7]
        ];
        // moderate
        const moderate = [
            [3, 8, 0, 0, 0, 4, 0, 7, 0],
            [4, 0, 0, 0, 6, 0, 0, 5, 1],
            [0, 0, 0, 0, 9, 3, 0, 0, 0],
            [0, 0, 0, 5, 0, 2, 6, 0, 4],
            [0, 1, 7, 0, 0, 0, 5, 2, 0],
            [2, 0, 5, 9, 0, 6, 0, 0, 0],
            [0, 0, 0, 7, 4, 0, 0, 0, 0],
            [5, 3, 0, 0, 8, 0, 0, 0, 7],
            [0, 7, 0, 3, 0, 0, 0, 4, 6]
        ];

        // challenging
        const challenging1 = [
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

        const challenging2 = [
            [0, 7, 0, 0, 3, 0, 0, 2, 0],
            [0, 5, 0, 1, 0, 7, 0, 0, 0],
            [0, 0, 9, 0, 0, 0, 0, 0, 6],
            [7, 0, 2, 5, 0, 0, 0, 8, 0],
            [0, 0, 1, 0, 0, 0, 2, 0, 0],
            [0, 9, 0, 0, 0, 2, 6, 0, 5],
            [1, 0, 0, 0, 0, 0, 9, 0, 0],
            [0, 0, 0, 7, 0, 6, 0, 3, 0],
            [0, 3, 0, 0, 8, 0, 0, 6, 0]
        ];

        const fiendish = [
            [0, 0, 0, 0, 5, 0, 0, 1, 0],
            [0, 0, 0, 9, 0, 0, 5, 0, 0],
            [0, 0, 4, 0, 0, 0, 0, 0, 6],
            [0, 3, 0, 0, 0, 5, 0, 0, 0],
            [7, 0, 0, 0, 0, 0, 4, 6, 2],
            [0, 0, 0, 2, 0, 0, 0, 9, 5],
            [0, 1, 0, 0, 7, 0, 0, 8, 0],
            [2, 0, 0, 0, 1, 3, 6, 0, 7],
            [0, 0, 3, 0, 2, 6, 0, 5, 0]
        ];

        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
                const solution = fiendish[rowIndex][columnIndex];
                if (solution > 0) {
                    solveCell(rowIndex, columnIndex, solution);
                }
            }
        }
    }, [puzzle, solveCell]);

    useEffect(() => {

        console.log('Rebuild the rows collection...');

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
