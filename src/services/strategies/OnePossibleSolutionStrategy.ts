import { CellModel } from "../../models/CellModel";
import { IStrategy } from "../IStrategy";

export class OnePossibleSolutionStrategy implements IStrategy {
    apply(cells: CellModel[]): CellModel[] {

        const solvedCells: CellModel[] = [];

        cells.forEach(cell => {
            if (cell.solution === null && cell.possibleSolutions.length === 1) {
                cell.solution = cell.possibleSolutions[0];
                solvedCells.push(cell);
            }
        });

        return solvedCells;
    }
}
