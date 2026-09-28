import { describe, expect, it } from 'vitest'
import Fraction from 'fraction.js'
import { matricesEqual } from './matrix'
import {
  addMultipleOfRow,
  applyRowOperation,
  linearCombinationOfRows,
  scaleRow,
  swapRows,
} from './operations'

describe('row operations', () => {
  const matrix = [
    [new Fraction(1), new Fraction(2)],
    [new Fraction(3), new Fraction(4)],
  ]

  it('adds a multiple of one row to another', () => {
    const result = addMultipleOfRow(
      matrix,
      0,
      1,
      new Fraction(2),
    )

    expect(matricesEqual(result, [
      [new Fraction(1), new Fraction(2)],
      [new Fraction(5), new Fraction(8)],
    ])).toBe(true)
  })

  it('swaps two rows', () => {
    const result = swapRows(matrix, 0, 1)

    expect(matricesEqual(result, [
      [new Fraction(3), new Fraction(4)],
      [new Fraction(1), new Fraction(2)],
    ])).toBe(true)
  })

  it('scales a row', () => {
    const result = scaleRow(
      matrix,
      1,
      new Fraction(3),
    )

    expect(matricesEqual(result, [
      [new Fraction(1), new Fraction(2)],
      [new Fraction(9), new Fraction(12)],
    ])).toBe(true)
  })

  it('forms a linear combination of two rows', () => {
    const result = linearCombinationOfRows(
      matrix,
      0,
      1,
      new Fraction(2),
      new Fraction(3),
    )

    expect(matricesEqual(result, [
      [new Fraction(1), new Fraction(2)],
      [new Fraction(11), new Fraction(16)],
    ])).toBe(true)
  })

  it('applies a row operation', () => {
    const result = applyRowOperation(matrix, {
      type: 'row-add',
      source: 0,
      target: 1,
      coefficient: new Fraction(-3),
    })

    expect(matricesEqual(result, [
      [new Fraction(1), new Fraction(2)],
      [new Fraction(0), new Fraction(-2)],
    ])).toBe(true)
  })

  it('applies a linear combination as one operation', () => {
    const result = applyRowOperation(matrix, {
      type: 'row-linear-combination',
      source: 0,
      target: 1,
      sourceCoefficient: new Fraction(2),
      targetCoefficient: new Fraction(3),
    })

    expect(matricesEqual(result, [
      [new Fraction(1), new Fraction(2)],
      [new Fraction(11), new Fraction(16)],
    ])).toBe(true)
  })

  it('performs exact fractional arithmetic', () => {
    const result = scaleRow(
      matrix,
      1,
      new Fraction(1, 3),
    )

    expect(matricesEqual(result, [
      [new Fraction(1), new Fraction(2)],
      [new Fraction(1), new Fraction(4, 3)],
    ])).toBe(true)
  })

  it('does not mutate the original matrix', () => {
    addMultipleOfRow(
      matrix,
      0,
      1,
      new Fraction(10),
    )

    expect(matricesEqual(matrix, [
      [new Fraction(1), new Fraction(2)],
      [new Fraction(3), new Fraction(4)],
    ])).toBe(true)
  })
})
