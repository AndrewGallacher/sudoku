import { CellModel } from "../../models/CellModel";
import { IStrategy } from "../IStrategy";

/**
 * 
 */
export class OnePossibleSolutionStrategy implements IStrategy {
    apply(cells: CellModel[]): CellModel[] {

        console.log('OnePossibleSolutionStrategy');
        const solvedCells: CellModel[] = [];

        cells.forEach(cell => {
            if (cell.solution === null && cell.possibleSolutions.length === 1) {
                cell.solution = cell.possibleSolutions[0];
                solvedCells.push(cell);
                console.log(`Row ${cell.rowIndex + 1}, column ${cell.columnIndex + 1} has to be ${cell.solution} - it's the only possibility`);
            }
        });

        return solvedCells;
    }
}
