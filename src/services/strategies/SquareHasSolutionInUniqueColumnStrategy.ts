import { CellModel } from "../../models/CellModel";
import { IStrategy } from "../IStrategy";

export class SquareHasSolutionInUniqueColumnStrategy implements IStrategy {

    somePossibilitiesEliminated: boolean = false;
    setSomePossibilitiesEliminated = (value: boolean) => {
        this.somePossibilitiesEliminated = value;
    };

    apply(cells: CellModel[]): CellModel[] {

        console.log('SquareHasSolutionInUniqueColumnStrategy');

        // This strategy may eliminate some possible solutions but will not necessarily solve any cells
        this.setSomePossibilitiesEliminated(false);

        // for each square 
        for (let squareIndex = 0; squareIndex < 9; squareIndex++) {

            const columnIndicesContainingSolution = new Map<number, number[]>();
            for (let solution = 1; solution < 10; solution++) {

                columnIndicesContainingSolution.set(solution, []);
                const solutionsThatCanAlreadyBeWorkedOut: number[] = [];

                // Work out the column indices containing each unknown solution in this square
                cells.forEach(cell => {
                    if (cell.squareIndex === squareIndex) {

                        // Kepp track of solutions we can get some other way 
                        if (cell.solution) {
                            solutionsThatCanAlreadyBeWorkedOut.push(cell.solution)
                        }
                        else if (cell.possibleSolutions.length === 1) {
                            solutionsThatCanAlreadyBeWorkedOut.push(cell.possibleSolutions[0])
                        }

                        if (cell.possibleSolutions.includes(solution)) {
                            if (!columnIndicesContainingSolution.get(solution)!.includes(cell.columnIndex)) {
                                columnIndicesContainingSolution.get(solution)!.push(cell.columnIndex);
                            }
                        }
                    }
                });

                // Clear out solutions we can work out elsewhere
                solutionsThatCanAlreadyBeWorkedOut.forEach(s => { columnIndicesContainingSolution.set(s, []); });
            }

            // At this stage, we have an array of all the column indices with each unknown solution in this square
            columnIndicesContainingSolution.forEach((columnIndices, solution) => {
                // If we know which column the solution is in
                if (columnIndices.length === 1) {
                    // we can eliminate it from other cells in the same column but different square
                    cells.forEach(cell => {
                        // Same column
                        if (cell.columnIndex === columnIndices[0]) {
                            // Different square
                            if (cell.squareIndex !== squareIndex) {
                                // Any this cell has this as a possible solution
                                if (cell.possibleSolutions.includes(solution)) {
                                    // Eliminate 
                                    console.log(`Square ${squareIndex + 1} (by column) eliminates ${solution} from row ${cell.rowIndex + 1} column ${cell.columnIndex + 1}`);
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
            console.log('*** return dummy solution *** ')
            const dummySolution = new CellModel(-1, -1);
            return [dummySolution];
        }

        return [];
    }
}
