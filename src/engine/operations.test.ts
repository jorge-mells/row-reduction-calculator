import { describe, expect, it } from 'vitest'
import { matricesEqual } from './matrix'
import {
  addMultipleOfRow,
  applyRowOperation,
  scaleRow,
  swapRows,
} from './operations'

describe('row operations', () => {
  const matrix = [
    [1, 2],
    [3, 4],
  ]

  it('adds a multiple of one row to another', () => {
    const result = addMultipleOfRow(matrix, 0, 1, 2)

    expect(matricesEqual(result, [
      [1, 2],
      [5, 8],
    ])).toBe(true)
  })

  it('swaps two rows', () => {
    const result = swapRows(matrix, 0, 1)

    expect(matricesEqual(result, [
      [3, 4],
      [1, 2],
    ])).toBe(true)
  })

  it('scales a row', () => {
    const result = scaleRow(matrix, 1, 3)

    expect(matricesEqual(result, [
      [1, 2],
      [9, 12],
    ])).toBe(true)
  })

  it('applies a row operation', () => {
    const result = applyRowOperation(matrix, {
      type: 'row-add',
      source: 0,
      target: 1,
      coefficient: -3,
    })

    expect(matricesEqual(result, [
      [1, 2],
      [0, -2],
    ])).toBe(true)
  })

  it('does not mutate the original matrix', () => {
    addMultipleOfRow(matrix, 0, 1, 10)

    expect(matricesEqual(matrix, [
      [1, 2],
      [3, 4],
    ])).toBe(true)
  })
})
