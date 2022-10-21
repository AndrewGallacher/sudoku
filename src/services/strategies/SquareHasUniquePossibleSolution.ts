import { CellModel } from "../../models/CellModel";
import { IStrategy } from "../IStrategy";

export class SquareHasUniquePossibleSolution implements IStrategy {
    apply(cells: CellModel[]): CellModel[] {

        const solvedCells: CellModel[] = [];
        const squares: CellModel[][] = [[], [], [], [], [], [], [], [], []];

        cells.forEach(cell => {
            squares[cell.squareIndex].push(cell);
        });

        for (let squareIndex = 0; squareIndex < 9; squareIndex++) {

            for (let solution = 1; solution < 10; solution++) {

                let count = 0;
                let indexOfSolution: number = -1;

                for (let index = 0; index < 9; index++) {
                    if (squares[squareIndex][index].possibleSolutions.includes(solution)) {
                        count++;
                        indexOfSolution = index;
                    }
                }

                if (count === 1) {
                    const solvedCell = squares[squareIndex][indexOfSolution];

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
