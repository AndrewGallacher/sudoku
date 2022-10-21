import { CellModel } from "../models/CellModel";

export interface IStrategy {
    apply(cells: CellModel[]): CellModel[];
}
