import Fraction from 'fraction.js'
import type { Matrix } from './matrix'

export type RowOperation =
  | {
    type: 'row-add'
    source: number
    target: number
    coefficient: Fraction
  }
  | {
    type: 'row-swap'
    first: number
    second: number
  }
  | {
    type: 'row-scale'
    row: number
    coefficient: Fraction
  }
  | {
    type: 'row-linear-combination'
    source: number
    target: number
    sourceCoefficient: Fraction
    targetCoefficient: Fraction
  }

export function addMultipleOfRow(
  matrix: Matrix,
  source: number,
  target: number,
  coefficient: Fraction,
): Matrix {
  const result = matrix.map((row) => [...row])

  for (let column = 0; column < result[target].length; column++) {
    result[target][column] = result[target][column].add(
      result[source][column].mul(coefficient),
    )
  }

  return result
}

export function swapRows(
  matrix: Matrix,
  first: number,
  second: number,
): Matrix {
  const result = matrix.map((row) => [...row])

    ;[result[first], result[second]] = [
      result[second],
      result[first],
    ]

  return result
}

export function scaleRow(
  matrix: Matrix,
  row: number,
  coefficient: Fraction,
): Matrix {
  const result = matrix.map((values) => [...values])

  for (let column = 0; column < result[row].length; column++) {
    result[row][column] = result[row][column].mul(coefficient)
  }

  return result
}

export function linearCombinationOfRows(
  matrix: Matrix,
  source: number,
  target: number,
  sourceCoefficient: Fraction,
  targetCoefficient: Fraction,
): Matrix {
  const result = matrix.map((row) => [...row])

  for (let column = 0; column < result[target].length; column++) {
    result[target][column] = result[target][column]
      .mul(targetCoefficient)
      .add(
        result[source][column].mul(sourceCoefficient),
      )
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
      return swapRows(
        matrix,
        operation.first,
        operation.second,
      )

    case 'row-scale':
      return scaleRow(
        matrix,
        operation.row,
        operation.coefficient,
      )

    case 'row-linear-combination':
      return linearCombinationOfRows(
        matrix,
        operation.source,
        operation.target,
        operation.sourceCoefficient,
        operation.targetCoefficient,
      )
  }
}
