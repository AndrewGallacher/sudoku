import { CellModel } from "../../models/CellModel";
import { IStrategy } from "../IStrategy";

/**
 * This is a dummy strategy that doesn't do anything
 */
export class NullStrategy implements IStrategy {
    apply(cells: CellModel[]): CellModel[] {
        console.log('NullStrategy');
        return [];
    }
}
