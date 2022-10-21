import { CellModel } from "../models/CellModel";
import { IStrategy } from "./IStrategy";
import { ValidationStrategy, OnePossibleSolutionStrategy } from "./strategies";


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
            new OnePossibleSolutionStrategy()
        ];
    }

    initGrid = (): CellModel[] => {

        let cells: CellModel[] = [];
        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
                cells.push(new CellModel(rowIndex, columnIndex));
            }
        }

        return cells;
    };

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

    solvePuzzle = () => {

        console.log('solvePuzzle');
        let i = 0;

        while (true) {

            i++;
            console.log('index', i);

            for (let index in this._strategies) {
                this._strategies[index].apply(this._cells).forEach(newSolution => this._solvedCells.push(newSolution));
            }

            if (this._solvedCells.length === 0) {
                return;
            }

            while (this._solvedCells.length > 0) {
                console.log('solvedCells', this._solvedCells.length);
                const solvedCell: any = this._solvedCells.pop();

                if (solvedCell !== null && solvedCell?.solution) {
                    this.applyCellSolution(solvedCell!.rowIndex, solvedCell!.columnIndex, solvedCell!.solution);
                }
            }
        }
    };

    applyCellSolution = (rowIndex: number, columnIndex: number, value: number): Puzzle => {
   
        const thisCell = new CellModel(rowIndex, columnIndex);
        let squareIndex = thisCell.getSquareIndex(rowIndex, columnIndex);

        this.cells.forEach(cell => {

            if (cell.columnIndex === columnIndex && cell.rowIndex === rowIndex) {
                cell.solution = value;
                cell.possibleSolutions = [value];
            }

            if (cell.columnIndex === columnIndex && cell.rowIndex !== rowIndex) {
                this.removeSolutionFromOtherCells(cell, value);
            }

            if (cell.rowIndex === rowIndex && cell.columnIndex !== columnIndex) {
                this.removeSolutionFromOtherCells(cell, value);
            }

            if (cell.squareIndex === squareIndex && (cell.rowIndex !== rowIndex || cell.columnIndex !== columnIndex)) {
                this.removeSolutionFromOtherCells(cell, value);
            }
        });

        return this;
    };

    removeSolutionFromOtherCells = (cell: CellModel, value: number): void => {
        const remainingSolutions: number[] = [];

        while (cell.possibleSolutions.length > 0) {
            const possibleSolution = cell.possibleSolutions.pop();
            if (possibleSolution !== undefined && possibleSolution !== value) {
                remainingSolutions.push(possibleSolution);
            }
        }

        while (remainingSolutions.length > 0) {
            const remainingSolution = remainingSolutions.pop();
            if (remainingSolution !== undefined) {
                cell.possibleSolutions.push(remainingSolution);
            }
        }
    };

    get cells(): CellModel[] {
        return this._cells;
    }
}

export default Puzzle;
