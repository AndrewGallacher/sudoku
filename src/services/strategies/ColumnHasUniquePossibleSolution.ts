import { CellModel } from "../../models/CellModel";
import { IStrategy } from "../IStrategy";

export class ColumnHasUniquePossibleSolution implements IStrategy {
    apply(cells: CellModel[]): CellModel[] {

        const solvedCells: CellModel[] = [];
        const columns: CellModel[][] = [[], [], [], [], [], [], [], [], []];

        cells.forEach(cell => {
            columns[cell.columnIndex].push(cell);
        });

        for (let columnIndex = 0; columnIndex < 9; columnIndex++) {

            for (let solution = 1; solution < 10; solution++) {

                let count = 0;
                let indexOfSolution: number = -1;

                for (let index = 0; index < 9; index++) {
                    if (columns[columnIndex][index].possibleSolutions.includes(solution)) {
                        count++;
                        indexOfSolution = index;
                    }
                }

                if (count === 1) {
                    const solvedCell = columns[columnIndex][indexOfSolution];

                    if (solvedCell.solution === null) {
                        solvedCell.solution = solution;
                        solvedCell.possibleSolutions = [solution];
                        solvedCells.push(solvedCell);
                    }
                }
            }
        }

        return solvedCells;
    }
}
