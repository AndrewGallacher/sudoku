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

    constructor(rowIndex: number, columnIndex: number) {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
        this.squareIndex = this.getSquareIndex(rowIndex, columnIndex);
        this.solution = null;
        this.possibleSolutions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
}
