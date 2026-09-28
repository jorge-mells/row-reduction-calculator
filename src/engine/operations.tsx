import type { Matrix } from './matrix'

export type RowOperation =
  | {
      type: 'row-add'
      source: number
      target: number
      coefficient: number
    }
  | {
      type: 'row-swap'
      first: number
      second: number
    }
  | {
      type: 'row-scale'
      row: number
      coefficient: number
    }

export function addMultipleOfRow(
  matrix: Matrix,
  source: number,
  target: number,
  coefficient: number,
): Matrix {
  const result = matrix.map((row) => [...row])

  for (let column = 0; column < result[target].length; column++) {
    result[target][column] += coefficient * result[source][column]
  }

  return result
}

export function swapRows(
  matrix: Matrix,
  first: number,
  second: number,
): Matrix {
  const result = matrix.map((row) => [...row])

  ;[result[first], result[second]] = [result[second], result[first]]

  return result
}

export function scaleRow(
  matrix: Matrix,
  row: number,
  coefficient: number,
): Matrix {
  const result = matrix.map((values) => [...values])

  for (let column = 0; column < result[row].length; column++) {
    result[row][column] *= coefficient
  }

  return result
}

export function applyRowOperation(
  matrix: Matrix,
  operation: RowOperation,
): Matrix {
  switch (operation.type) {
    case 'row-add':
      return addMultipleOfRow(
        matrix,
        operation.source,
        operation.target,
        operation.coefficient,
      )

    case 'row-swap':
      return swapRows(matrix, operation.first, operation.second)

    case 'row-scale':
      return scaleRow(
        matrix,
        operation.row,
        operation.coefficient,
      )
  }
}
