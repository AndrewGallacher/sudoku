import { devNull } from "os";
import { CellModel } from "../models/CellModel";
import { IStrategy } from "./IStrategy";
import {
    ValidationStrategy,
    OnePossibleSolutionStrategy,
    RowHasUniquePossibleSolutionStrategy,
    ColumnHasUniquePossibleSolutionStrategy,
    SquareHasUniquePossibleSolutionStrategy,
    SquareHasSolutionInUniqueRowStrategy,
    SquareHasSolutionInUniqueColumnStrategy,
    LookAheadStrategy
} from "./strategies";
import { NullStrategy } from "./strategies/NullStrategy";

class Puzzle {

    _cells: CellModel[];
    _rows: CellModel[][];
    _columns: CellModel[][];
    _squares: CellModel[][];
    _solvedCells: CellModel[];
    _strategies: IStrategy[];

    constructor() {
        this._cells = this.initGrid();

        this._rows = [];
        this._columns = [];
        this._squares = [];
        this.buildArrays();

        this._solvedCells = [];
        this._strategies = [
            new ValidationStrategy(),
            new OnePossibleSolutionStrategy(),
            new RowHasUniquePossibleSolutionStrategy(),
            new ColumnHasUniquePossibleSolutionStrategy(),
            new SquareHasUniquePossibleSolutionStrategy(),
            new SquareHasSolutionInUniqueRowStrategy(),
            new SquareHasSolutionInUniqueColumnStrategy(),
           new LookAheadStrategy()
        ];
    }

    /**
     * 
     * @returns 
     */
    initGrid = (): CellModel[] => {

        let cells: CellModel[] = [];
        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
                cells.push(new CellModel(rowIndex, columnIndex));
            }
        }

        return cells;
    };

    /**
     * 
     */
    buildArrays = (): void => {
        for (let i = 0; i < 9; i++) {
            this._rows.push([]);
            this._columns.push([]);
            this._squares.push([]);
        }

        for (let i in this.cells) {
            const cell = this.cells[i];
            this._rows[cell.rowIndex].push(cell);
            this._columns[cell.columnIndex].push(cell);
            this._squares[cell.squareIndex].push(cell);
        }
    };

    /**
     * 
     * @returns 
     */
    solvePuzzle = (): void => {

        console.log('solvePuzzle');
        let iteration = 0;

        const strategies: IStrategy[] = [];

        while (true) {

            iteration++;
            console.log('iteration', iteration);
            console.log('count or cells to be solved (before)', this._solvedCells.length);

            for (let index in strategies) {
                strategies[index].apply(this._cells).forEach(newSolution => this._solvedCells.push(newSolution));
            }

            console.log('count or cells to be solved (after)', this._solvedCells.length);

            if (this._solvedCells.length === 0) {

                if (this._strategies.length > 0) {
                    console.log('*** ADD NEW STRATEGY ***')
                    strategies.unshift(this._strategies.shift() ?? new NullStrategy());
                }
                else {
                    //   this.tryLookAhead();
                    return;
                }
            }

            while (this._solvedCells.length > 0) {
                // console.log('solvedCells', this._solvedCells.length);
                const solvedCell: any = this._solvedCells.pop();

                if (solvedCell !== null && solvedCell.solution) {
                    this.applyCellSolution(solvedCell.rowIndex, solvedCell.columnIndex, solvedCell.solution);
                }
            }
        }
    };
    /*
        tryLookAhead = () => {
    
            const strategy = new LookAheadStrategy();
            strategy.apply(this._cells).forEach(cell => this.applyCellSolution(cell.rowIndex, cell.columnIndex, cell.solution ?? 0));
    
        }
    */

    isSolved = (): boolean => {
        this._cells.forEach(cell => {
            if (cell.solution === null) {
                return false;
            }
        });

        debugger;
        const strategy = new ValidationStrategy();
        strategy.apply(this._cells);

        return true;
    };

    /**
     * 
     * @param rowIndex 
     * @param columnIndex 
     * @param solution 
     * @returns 
     */
    applyCellSolution = (rowIndex: number, columnIndex: number, solution: number): Puzzle => {

        // Allow for dummy solution. Needed for strategies that elimenate possibilities without solving any cells.
        if (rowIndex < 0 && columnIndex < 0) {
            console.log('*** DUMMY SOLUTION ***');
            return this;
        }

        // Find the cell to be solved
        const thisCell = this._rows[rowIndex][columnIndex];
        const squareIndex = thisCell.squareIndex;

        // If we were not told the solution, work it out or fail if we can't
        if (solution === null) {
            if (thisCell.possibleSolutions.length === 1) {
                solution = thisCell.possibleSolutions[0];
            }
            else {
                throw new Error('No identifiable solution');
            }
        }

        this.cells.forEach(cell => {

            if (cell.columnIndex === columnIndex && cell.rowIndex === rowIndex) {
                // Apply the solution to the cell in question
                cell.solution = solution;
                cell.possibleSolutions = [solution];
            }
            else {
                // Eliminate from other cells in same row, ...
                if (cell.columnIndex === columnIndex) {
                    cell.eliminatePossibility(solution);
                }

                // same column, ...
                if (cell.rowIndex === rowIndex) {
                    cell.eliminatePossibility(solution);
                }

                // or same square.
                if (cell.squareIndex === squareIndex) {
                    cell.eliminatePossibility(solution);
                }
            }
        });

        return this;
    };

    get cells(): CellModel[] {
        return this._cells;
    }
}

export default Puzzle;
