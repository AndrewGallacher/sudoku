import { CellModel } from "../CellModel";
import { IStrategy } from "../IStrategy";
import Puzzle from "../puzzle";

/**
 * This strategy is used if the combination of all other strategies does not lead to a solution.
 * We pick a cell with 2 possible solutions, try one of those solutions, and see if it leads to
 * a solution or an invalid situation.  If it leads to a solution then our work is done.
 * If it leads to an invalid situation then we can eliminate that possibility and then keep going
 * with all of our other strategies.
 *
 * Instead, if we end at another particla solution that is not invalid, then we need to move on to
 * the next possible solution or the next cell with 2 opssible solutions and try again.
 */
export class LookAheadStrategy implements IStrategy {
  startingPosition: CellModel[] = [];

  captureStartingPosition = (cells: CellModel[]): void => {
    this.startingPosition = cells;
  };

  // create a new puzzle to work with
  clonePuzzle = (): Puzzle => {
    const puzzle = new Puzzle(false);
    this.startingPosition.forEach((cell) => {
      if (cell.solution) {
        puzzle.applyCellSolution(
          cell.rowIndex,
          cell.columnIndex,
          cell.solution
        );
      }
    });

    return puzzle;
  };

  name(): string {
    return "LookAheadStrategy";
  }

  apply(cells: CellModel[]): CellModel[] {
    this.captureStartingPosition(cells);

    // and get a list of all the unsolved cells
    const unsolvedCells = new Map<number, CellModel[]>();
    for (let count = 2; count < 9; count++) {
      unsolvedCells.set(count, []);
    }

    cells.forEach((cell) => {
      // Populate the list of unsolved cells
      if (cell.possibleSolutions.length > 1) {
        unsolvedCells.get(cell.possibleSolutions.length)!.push(cell);
      }
    });

    let outcomeUncertain = true;
    let solutionCount = 2;
    while (outcomeUncertain) {
      console.log("solutionCount", solutionCount);

      while (unsolvedCells.get(solutionCount)!.length > 0) {
        // We are going to try each of the solutions for this cell
        const tryThisCell = unsolvedCells.get(solutionCount)!.pop()!;

        // Capture the possible solutions so that we can reset second time round
        const originalSolutions: number[] = [...tryThisCell.possibleSolutions];

        if (tryThisCell) {
          console.log(
            `Trying row ${tryThisCell.rowIndex + 1}, column ${
              tryThisCell.columnIndex + 1
            }`
          );

          for (var solutionIndex in originalSolutions) {
            const tryThisSolution: number = originalSolutions[solutionIndex];
            console.log(`- with solution ${tryThisSolution}`);

            // at this point we need to clone the puzzle we started with and apply this solution to that puzzle
            const puzzle = this.clonePuzzle();
            puzzle.applyCellSolution(
              tryThisCell.rowIndex,
              tryThisCell.columnIndex,
              tryThisSolution!
            );

            try {
              puzzle.solvePuzzle();
              if (puzzle.isSolved()) {
                return puzzle._cells;
              }
            } catch (error) {
              // Do nothing
            }

            tryThisCell.solution = null;
            tryThisCell.possibleSolutions = [...originalSolutions];
          }
        }
      }

      solutionCount++;
      if (solutionCount > 5) {
        outcomeUncertain = false;
      }
    }

    return [];
  }
}
