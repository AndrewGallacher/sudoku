import { CellModel } from "./CellModel";

/**
 * Interface for all strategies for solving sudoku
 */
export interface IStrategy {
  /**
   * Apply this strategyu
   * @param cells - the current status as a collection of cells
   * @returns The collection of cells that can now be solved
   */
  apply(cells: CellModel[]): CellModel[];

  /**
   * Return the name of the strategy for documentary purposes
   */
  name(): string;
}
