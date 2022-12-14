import { CellModel } from "./CellModel";
import { IStrategy } from "./IStrategy";
import {
  ValidationStrategy,
  OnePossibleSolutionStrategy,
  RowHasUniquePossibleSolutionStrategy,
  ColumnHasUniquePossibleSolutionStrategy,
  SquareHasUniquePossibleSolutionStrategy,
  SquareHasSolutionInUniqueRowStrategy,
  SquareHasSolutionInUniqueColumnStrategy,
  LookAheadStrategy,
} from "./strategies";
import { NullStrategy } from "./strategies/NullStrategy";

class Puzzle {
  _useLookAhead: boolean;
  _cells: CellModel[];
  _rows: CellModel[][];
  _columns: CellModel[][];
  _squares: CellModel[][];
  _solvedCells: CellModel[];
  _strategies: IStrategy[];
  _lookAheadStrategy: IStrategy = new LookAheadStrategy();

  constructor(useLookAhead: boolean) {
    this._useLookAhead = useLookAhead;
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
    console.log("solvePuzzle");
    let iteration = 0;

    const strategies: IStrategy[] = [];

    while (true) {
      iteration++;
      console.log("Iteration", iteration);
      console.log("count of cells to be solved", this._solvedCells.length);

      for (let index in strategies) {
        const strategy = strategies[index];
        console.log("*** Strategy", strategy.name());
        const solvedCells = strategy.apply(this._cells);
        solvedCells.forEach((newSolution) =>
          this._solvedCells.push(newSolution)
        );
      }

      if (this._solvedCells.length === 0) {
        if (this._strategies.length > 0) {
          strategies.unshift(this._strategies.shift() ?? new NullStrategy());
        } else if (this._useLookAhead) {
          const lookAheadSolutions: CellModel[] = this._lookAheadStrategy.apply(
            this._cells
          );
          if (lookAheadSolutions.length === 0) {
            return;
          }

          lookAheadSolutions.forEach((newSolution) =>
            this._solvedCells.push(newSolution)
          );
          this._useLookAhead = false;
        } else {
          return;
        }
      }

      while (this._solvedCells.length > 0) {
        const solvedCell: any = this._solvedCells.pop();

        if (solvedCell !== null && solvedCell.solution) {
          this.applyCellSolution(
            solvedCell.rowIndex,
            solvedCell.columnIndex,
            solvedCell.solution
          );
        }
      }
    }
  };

  isSolved = (): boolean => {
    for (let index in this._cells) {
      if (this._cells[index].solution === null) {
        return false;
      }
    }

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
  applyCellSolution = (
    rowIndex: number,
    columnIndex: number,
    solution: number
  ): Puzzle => {
    // Allow for dummy solution. Needed for strategies that elimenate possibilities without solving any cells.
    if (rowIndex < 0 && columnIndex < 0) {
      return this;
    }

    // Find the cell to be solved
    const thisCell = this._rows[rowIndex][columnIndex];
    const squareIndex = thisCell.squareIndex;

    // If we were not told the solution, work it out or fail if we can't
    if (solution === null) {
      if (thisCell.possibleSolutions.length === 1) {
        solution = thisCell.possibleSolutions[0];
      } else {
        throw new Error("No identifiable solution");
      }
    }

    this.cells.forEach((cell) => {
      if (cell.columnIndex === columnIndex && cell.rowIndex === rowIndex) {
        // Apply the solution to the cell in question
        cell.solution = solution;
        cell.possibleSolutions = [solution];
      } else {
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
