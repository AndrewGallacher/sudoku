export class CellModel {

    rowIndex: number;

    columnIndex: number;

    squareIndex: number;

    solution: number | null;

    possibleSolutions: number[];

    getSquareIndex = (rowIndex: number, columnIndex: number): number => {
        if (rowIndex < 3) {
            return Math.floor(columnIndex / 3);
        }

        if (rowIndex < 6) {
            return Math.floor(columnIndex / 3) + 3;
        }

        return Math.floor(columnIndex / 3) + 6;
    };

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


    constructor(rowIndex: number, columnIndex: number) {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
        this.squareIndex = this.getSquareIndex(rowIndex, columnIndex);
        this.solution = null;
        this.possibleSolutions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
}
