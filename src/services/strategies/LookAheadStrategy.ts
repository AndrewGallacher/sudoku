import { CellModel } from "../../models/CellModel";
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


    clonePuzzle = (): Puzzle => {

        // create a new puzzle to work with 
        const puzzle = new Puzzle();

        this.startingPosition.forEach(cell => {
            // Clone the current situation to the new puzzle
            if (cell.solution) {
                puzzle.applyCellSolution(cell.rowIndex, cell.columnIndex, cell.solution);
            }
        });

        return puzzle;
    };


    apply(cells: CellModel[]): CellModel[] {
        console.log('LookAheadStrategy');

        this.captureStartingPosition(cells);

        // and get a list of all the unsolved cells
        const unsolvedCells = new Map<number, CellModel[]>();
        for (let count = 2; count < 9; count++) {
            unsolvedCells.set(count, []);
        }
        cells.forEach(cell => {

            // ... and populate the list of unsolved cells 
            if (cell.possibleSolutions.length > 1) {
                unsolvedCells.get(cell.possibleSolutions.length)!.push(cell);
            }
        });

        let outcomeUncertain = true;
        let solutionCount = 2;
        while (outcomeUncertain) {

            console.log('solutionCount', solutionCount);
            //         debugger;

            while (unsolvedCells.get(solutionCount)!.length > 0) {

                const tryThisCell = unsolvedCells.get(solutionCount)!.pop(); ///  ?? throw new Error('asdsa');
                if (tryThisCell) {
                    console.log(`Trying row ${tryThisCell.rowIndex + 1}, column ${tryThisCell.columnIndex + 1} `);

                    for (var solutionIndex in tryThisCell.possibleSolutions) {
                        const tryThisSolution: number = tryThisCell.possibleSolutions[solutionIndex];
                        console.log(`Trying solution ${tryThisSolution}`);

                        tryThisCell.solution = tryThisSolution;

                        // at this point we need to clone the puzzle we started with and apply this solution to that puzzle 
                        const puzzle = this.clonePuzzle();
                        puzzle.applyCellSolution(tryThisCell.rowIndex, tryThisCell.columnIndex, tryThisCell.solution!);

                        try {
                            puzzle.solvePuzzle();

                            if (puzzle.isSolved()) {

                                debugger;
                                for (let index in cells) {
                                    if (cells[index].rowIndex === tryThisCell.rowIndex && cells[index].columnIndex === tryThisCell.columnIndex) {

                                        cells[index].solution = tryThisSolution;
                                        cells[index].possibleSolutions = [tryThisSolution];

                                        return [cells[index]];
                                    }
                                }

                                debugger;
                            }
                        } catch (error) {
                            debugger;
                            console.error(error);
                            tryThisCell.solution = null;
                            // tryThisCell.possibleSolutions.push(tryThisSolution);
                        }
                    }
                }
            }

            solutionCount++;
            if (solutionCount > 8) {
                outcomeUncertain = false;
            }
        }

        debugger;
        return [];
    }
}
