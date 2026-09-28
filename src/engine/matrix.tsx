import Fraction from 'fraction.js'

export type Matrix = Fraction[][]

export function createMatrix(rows: number, columns: number): Matrix {
  return Array.from(
    { length: rows },
    () =>
      Array.from(
        { length: columns },
        () => new Fraction(0),
      ),
  )
}

export function resizeMatrix(
  matrix: Matrix,
  rows: number,
  columns: number,
): Matrix {
  return Array.from(
    { length: rows },
    (_, rowIndex) =>
      Array.from(
        { length: columns },
        (_, columnIndex) =>
          matrix[rowIndex]?.[columnIndex] ?? new Fraction(0),
      ),
  )
}

export function cloneMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) =>
    row.map((value) => new Fraction(value)),
  )
}

export function matricesEqual(a: Matrix, b: Matrix): boolean {
  if (a.length !== b.length) {
    return false
  }

  if (a.some((row, index) => row.length !== b[index].length)) {
    return false
  }

  return a.every((row, rowIndex) =>
    row.every((value, columnIndex) =>
      value.equals(b[rowIndex][columnIndex]),
    ),
  )
}
