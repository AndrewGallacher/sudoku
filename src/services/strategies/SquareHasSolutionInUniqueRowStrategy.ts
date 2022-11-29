import { CellModel } from "../CellModel";
import { IStrategy } from "../IStrategy";

/**
 * Look for square with a solution in only one row and remove that solution from the same row of other squares
 */
export class SquareHasSolutionInUniqueRowStrategy implements IStrategy {
  somePossibilitiesEliminated: boolean = false;

  setSomePossibilitiesEliminated = (value: boolean) => {
    this.somePossibilitiesEliminated = value;
  };

  name(): string {
    return "SquareHasSolutionInUniqueRowStrategy";
  }

  apply(cells: CellModel[]): CellModel[] {
    // This strategy may eliminate some possible solutions but will not necessarily solve any cells
    this.setSomePossibilitiesEliminated(false);

    // for each square
    for (let squareIndex = 0; squareIndex < 9; squareIndex++) {
      const rowIndicesContainingSolution = new Map<number, number[]>();
      for (let solution = 1; solution < 10; solution++) {
        rowIndicesContainingSolution.set(solution, []);
        const solutionsThatCanAlreadyBeWorkedOut: number[] = [];

        // Work out the row indices containing each unknown solution in this square
        cells.forEach((cell) => {
          if (cell.squareIndex === squareIndex) {
            // Kepp track of solutions we can get some other way
            if (cell.solution) {
              solutionsThatCanAlreadyBeWorkedOut.push(cell.solution);
            } else if (cell.possibleSolutions.length === 1) {
              solutionsThatCanAlreadyBeWorkedOut.push(
                cell.possibleSolutions[0]
              );
            }

            if (cell.possibleSolutions.includes(solution)) {
              if (
                !rowIndicesContainingSolution
                  .get(solution)!
                  .includes(cell.rowIndex)
              ) {
                rowIndicesContainingSolution.get(solution)!.push(cell.rowIndex);
              }
            }
          }
        });

        // Clear out solutions we can work out elsewhere
        solutionsThatCanAlreadyBeWorkedOut.forEach((s) => {
          rowIndicesContainingSolution.set(s, []);
        });
      }

      // At this stage, we have an array of all the row indices with each unknown solution in this square
      rowIndicesContainingSolution.forEach((rowIndices, solution) => {
        // If we know which row the solution is in
        if (rowIndices.length === 1) {
          // we can eliminate it from other cells in the same row but different square
          cells.forEach((cell) => {
            // Same row
            if (cell.rowIndex === rowIndices[0]) {
              // Different square
              if (cell.squareIndex !== squareIndex) {
                // Any this cell has this as a possible solution
                if (cell.possibleSolutions.includes(solution)) {
                  // Eliminate
                  console.log(
                    `Square ${
                      squareIndex + 1
                    } (by row) eliminates ${solution} from row ${
                      cell.rowIndex + 1
                    } column ${cell.columnIndex + 1}`
                  );
                  cell.eliminatePossibility(solution);
                  this.setSomePossibilitiesEliminated(true);
                }
              }
            }
          });
        }
      });
    }

    // If we managed to remove any possibilities, return a dummy solution so that we can keep going
    if (this.somePossibilitiesEliminated) {
      console.log("*** return dummy solution *** ");
      const dummySolution = new CellModel(-1, -1);
      return [dummySolution];
    }

    return [];
  }
}
