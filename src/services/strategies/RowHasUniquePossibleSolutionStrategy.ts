import { CellModel } from "../../models/CellModel";
import { IStrategy } from "../IStrategy";

/**
 * For each row, look for possible solutions that exist in only one cell
 */
export class RowHasUniquePossibleSolutionStrategy implements IStrategy {
    apply(cells: CellModel[]): CellModel[] {

        console.log('RowHasUniquePossibleSolutionStrategy');
        const solvedCells: CellModel[] = [];
        const rows: CellModel[][] = [[], [], [], [], [], [], [], [], []];

        cells.forEach(cell => {
            rows[cell.rowIndex].push(cell);
        });

        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {

            for (let solution = 1; solution < 10; solution++) {

                let count = 0;
                let indexOfSolution: number = -1;

                for (let index = 0; index < 9; index++) {
                    if (rows[rowIndex][index].possibleSolutions.includes(solution)) {
                        count++;
                        indexOfSolution = index;
                    }
                }

                if (count === 1) {
                    const solvedCell = rows[rowIndex][indexOfSolution];

                    if (solvedCell.solution === null) {
                        solvedCell.solution = solution;
                        solvedCell.possibleSolutions = [solution];
                        solvedCells.push(solvedCell);
                        console.log(`Row ${solvedCell.rowIndex + 1}, column ${solvedCell.columnIndex + 1} has to be ${solvedCell.solution} - in this row it's the only cell with that possibility left`);
                    }
                }
            }
        }

        return solvedCells;
    }
}
