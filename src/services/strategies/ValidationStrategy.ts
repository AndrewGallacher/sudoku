import { CellModel } from "../../models/CellModel";
import { IStrategy } from "../IStrategy";

/**
 * This doesn't solve anything but checks that the current status is still valid and that a full solution is still possible
 */
export class ValidationStrategy implements IStrategy {

    unsolvedCellCount = 0;

    incrementUnslovedCellCount = (): void => {

        this.unsolvedCellCount++;

    }



    apply(cells: CellModel[]): CellModel[] {

        console.log('ValidationStrategy');

        const rowSolutionCounts: number[][] = [];
        const columnSolutionCounts: number[][] = [];
        const squareSolutionCounts: number[][] = [];

        // Set up array of the count of each solution
        for (let i = 0; i < 9; i++) {
            rowSolutionCounts.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
            columnSolutionCounts.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
            squareSolutionCounts.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }

        cells.forEach(cell => {
            // Have we run out of possible solutions?
            if (cell.possibleSolutions.length === 0) {
                throw new Error(`Row ${cell.rowIndex + 1}, column ${cell.columnIndex + 1} has no possible solutions`);
            }

            // Do we have a duplicate solution
            if (cell.possibleSolutions.length === 1) {

                const solutionIndex = cell.possibleSolutions[0] - 1;

                // Check row
                if (rowSolutionCounts[cell.rowIndex][solutionIndex] > 0) {
                    throw new Error(`Row ${cell.rowIndex + 1} has duplicate solution for ${solutionIndex + 1}`);
                }

                // Check column
                if (columnSolutionCounts[cell.columnIndex][solutionIndex] > 0) {
                    throw new Error(`Column ${cell.columnIndex + 1} has duplicate solution for ${solutionIndex + 1}`);
                }

                // Check square
                if (squareSolutionCounts[cell.squareIndex][solutionIndex] > 0) {
                    throw new Error(`Square ${cell.squareIndex + 1} has duplicate solution for ${solutionIndex + 1}`);
                }

                rowSolutionCounts[cell.rowIndex][solutionIndex] = 1;
                columnSolutionCounts[cell.columnIndex][solutionIndex] = 1;
                squareSolutionCounts[cell.squareIndex][solutionIndex] = 1;
            }
            else {
                this.incrementUnslovedCellCount();
            }

        });

        console.log('unsolvedCellCount', this.unsolvedCellCount);
        if (this.unsolvedCellCount === 0) {
            debugger;
        }

        return [];
    }
}
