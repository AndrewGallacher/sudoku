/**
 *  Models a single cell in a Sudoku puzzle 
 */
export class CellModel {

    rowIndex: number;

    columnIndex: number;

    squareIndex: number;

    solution: number | null;

    possibleSolutions: number[];

    /**
     * Works out the 0-based sqaure index of the current cell 
     * @returns 0 to 8 (left-to-right, then top-to-bottom)
     */
    getSquareIndex = () :number => {
        if (this.rowIndex < 3) {
            return Math.floor(this.columnIndex / 3);
        }

        if (this.rowIndex < 6) {
            return Math.floor(this.columnIndex / 3) + 3;
        }

        return Math.floor(this.columnIndex / 3) + 6;
    };

    /**
     * Removes the given solution from the array of possible solutions  
     * @param solution - the solution (1 - 9) to be eliminated
     */
    eliminatePossibility = (solution: number): void => {
        const remainingSolutions: number[] = [];

        while (this.possibleSolutions.length > 0) {
            const possibleSolution = this.possibleSolutions.pop();
            if (possibleSolution !== undefined && possibleSolution !== solution) {
                remainingSolutions.push(possibleSolution);
            }
        }

        while (remainingSolutions.length > 0) {
            const remainingSolution = remainingSolutions.pop();
            if (remainingSolution !== undefined) {
                this.possibleSolutions.push(remainingSolution);
            }
        }
    };

    /**
     * Constructs a new CellModel object
     * @param rowIndex - 0-based index of the row
     * @param columnIndex - 0-based index of the column
     */
    constructor(rowIndex: number, columnIndex: number) {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
        this.squareIndex = this.getSquareIndex();
        this.solution = null;
        this.possibleSolutions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
}
