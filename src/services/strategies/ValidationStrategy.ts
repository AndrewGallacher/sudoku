import { CellModel } from "../../models/CellModel";
import { IStrategy } from "../IStrategy";

export class ValidationStrategy implements IStrategy {
    apply(cells: CellModel[]): CellModel[] {



        cells.forEach(cell => {

            if (cell.possibleSolutions.length === 0) {
                throw new Error(`Row ${cell.rowIndex + 1}, column ${cell.columnIndex + 1} has no possible solutions`);

            }
        });

        return [];
    }
}
