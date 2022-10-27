import React, { useCallback, useEffect, useState } from 'react';
import { CellModel } from '../models/CellModel';
import Puzzle from '../services/puzzle';
import Row from './Row';

const Grid = ({ position }: any) => {

    const [iteration, setIteration] = useState<number>(0);
    const [puzzle, setPuzzle] = useState<Puzzle>();
    const [rows, setRows] = useState<CellModel[][]>([]);

    const solveCell = useCallback((rowIndex: number, columnIndex: number, solution: number): void => {

        if (!puzzle) {
            throw Error('No puzzle to solve');
        }

        setPuzzle(puzzle.applyCellSolution(rowIndex, columnIndex, solution));
        setIteration((i: number) => { return (i + 1); });
    }, [puzzle]);

    useEffect(() => {
        // Start a new puzzle, allowing for look ahead
        setPuzzle(new Puzzle(true));
    }, []);

    useEffect(() => {
        if (puzzle && position) {
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
    }, [position, puzzle, solveCell]);

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
