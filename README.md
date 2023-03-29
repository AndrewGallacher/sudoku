# Sudoku Solver

This project is a React app for solving sudoku puzzles and displaying the solution.
It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
using TypeScript.

## Getting Started

Create a JSON file in `/src/components/puzzles` with a starting position represented as an array or arrays.

Set the `position` property of the `Grid` component in `App.tsx` with the name of this JSON file.

`yarn start`

Select `Solve`

## Terminology

There are many squares in a sudoku puzzle.
The smallest squares in a puzzle are the 81 individual squares that can each hold one digit.
This project uses the word "cell" for this component.
The word "square" is used to described the 3 x 3 squares, each of which must have the digits from 1 to 9 exactly one time.
There are 9 squares.
Similarly, there are 9 "rows" and 9 "columns", each of which must also have the digits 1 to 9 exactly once for the puzzle to be solved.
The word "puzzle" is used to describe the overall grid.

So, one puzzle has:

- 9 squares,
- 9 rows,
- 9 columns, and
- 81 cells.
  
## Strategies

The solver uses a collection of "strategies" to solve a puzzle.
There are four types of stategy:

### Solve individual cells

These strategies will identify a list of cells that have a definite solution.

`OnePossibleSolutionStrategy` identifies unsolved cells that have only one solution.

For each row, `RowHasUniquePossibleSolutionStrategy` identifies solutions that only
exist as a possible solution for one cell in that row.
That must be the solution for that cell.
`ColumnHasUniquePossibleSolutionStrategy` and `SquareHasUniquePossibleSolutionStrategy` do the same operation
but for each column and square respectively.

### Eliminate Possibilities

These strategies may not identify any cells that can be solved now,
but do identify possible solutions that can be eliminated.
This may help other strategies to solve those cells.

For each square, `SquareHasSolutionInUniqueRowStrategy` identifies solutions that only exist in one row.
That solution, therefore, cannot be a solution for any cell in the same row in a different square.
`SquareHasSolutionInUniqueColumnStrategy` performs the same operation but looks for solution that only
exists in a single column of a square.

### Look Ahead Strategy

There is one special strategy called the look ahead strategy.
This is only used when all of the above strategies cannot arrive at a final solution.
Starting with the cells that have the fewest number of possible solutions remaining, we try each solution
for each cell, one at a time, and see if that solution leads to a final solution.

At this stage of development, the engine only supports one level of look ahead.
The assumption is that any puzzle can be solved by using this strategy only once.

### Dummy Stategies

There are two special strategies that do not help to solve the puzzle in any way.

`ValidationStrategy` tests the current status of a puzzle for the following invalidities:

- Are there any unsolved cells with no remaining possible solutions?
- Has any solution been used more than once in any row, column or square

The `NullStrategy` does not do anything.

Solving the puzzle involves iterating through all the strategies and solving all of the cells that they identify.
Where no new solvable cells are identified we use the look ahead strategy.
The validation strategy is used in each iteration to check that we have not arrived at an invalid and impossible sitaution.
