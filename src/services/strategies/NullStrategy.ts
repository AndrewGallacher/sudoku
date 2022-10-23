import { CellModel } from "../../models/CellModel";
import { IStrategy } from "../IStrategy";

export class NullStrategy implements IStrategy {
    apply(cells: CellModel[]): CellModel[] {
        console.log('NullStrategy');
        return [];
    }
}
