import { CellModel } from "../CellModel";
import { IStrategy } from "../IStrategy";

/**
 * For each square, look for possible solutions that exist in only one cell
 */
export class SquareHasUniquePossibleSolutionStrategy implements IStrategy {
  name(): string {
    return "SquareHasUniquePossibleSolutionStrategy";
  }

  apply(cells: CellModel[]): CellModel[] {
    const solvedCells: CellModel[] = [];
    const squares: CellModel[][] = [[], [], [], [], [], [], [], [], []];

    cells.forEach((cell) => {
      squares[cell.squareIndex].push(cell);
    });

    for (let squareIndex = 0; squareIndex < 9; squareIndex++) {
      for (let solution = 1; solution < 10; solution++) {
        let count = 0;
        let indexOfSolution: number = -1;

        for (let index = 0; index < 9; index++) {
          if (
            squares[squareIndex][index].possibleSolutions.includes(solution)
          ) {
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
            console.log(
              `Row ${solvedCell.rowIndex + 1}, column ${
                solvedCell.columnIndex + 1
              } has to be ${
                solvedCell.solution
              } - in this square it's the only cell with that possibility left`
            );
          }
        }
      }
    }

    return solvedCells;
  }
}
