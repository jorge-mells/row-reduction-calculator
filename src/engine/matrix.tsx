export type Matrix = number[][]

export function createMatrix(rows: number, columns: number): Matrix {
  return Array.from(
    { length: rows },
    () => Array(columns).fill(0),
  )
}

export function cloneMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => [...row])
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
      value === b[rowIndex][columnIndex],
    ),
  )
}
