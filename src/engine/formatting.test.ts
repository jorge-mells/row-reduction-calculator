import Fraction from 'fraction.js'
import { describe, expect, it } from 'vitest'
import { formatOperation } from './formatting'
import type { RowOperation } from './operations'

describe('formatOperation', () => {
  it('formats adding a positive multiple of a row', () => {
    const operation: RowOperation = {
      type: 'row-add',
      source: 0,
      target: 1,
      coefficient: new Fraction(2),
    }

    expect(formatOperation(operation)).toBe(
      'R2 ← R2 + 2R1',
    )
  })

  it('formats adding a negative multiple of a row', () => {
    const operation: RowOperation = {
      type: 'row-add',
      source: 0,
      target: 1,
      coefficient: new Fraction(-1),
    }

    expect(formatOperation(operation)).toBe(
      'R2 ← R2 − R1',
    )
  })

  it('formats a fractional coefficient', () => {
    const operation: RowOperation = {
      type: 'row-add',
      source: 0,
      target: 1,
      coefficient: new Fraction(1, 2),
    }

    expect(formatOperation(operation)).toBe(
      'R2 ← R2 + 1/2R1',
    )
  })

  it('formats a row swap', () => {
    const operation: RowOperation = {
      type: 'row-swap',
      first: 0,
      second: 2,
    }

    expect(formatOperation(operation)).toBe(
      'R1 ↔ R3',
    )
  })

  it('formats scaling by one naturally', () => {
    const operation: RowOperation = {
      type: 'row-scale',
      row: 0,
      coefficient: new Fraction(1),
    }

    expect(formatOperation(operation)).toBe(
      'R1 ← R1',
    )
  })

  it('formats scaling by a negative coefficient', () => {
    const operation: RowOperation = {
      type: 'row-scale',
      row: 0,
      coefficient: new Fraction(-3),
    }

    expect(formatOperation(operation)).toBe(
      'R1 ← −3R1',
    )
  })

  it('formats an advanced operation with two positive coefficients', () => {
    const operation: RowOperation = {
      type: 'row-linear-combination',
      source: 0,
      target: 1,
      targetCoefficient: new Fraction(2),
      sourceCoefficient: new Fraction(3),
    }

    expect(formatOperation(operation)).toBe(
      'R2 ← 2R2 + 3R1',
    )
  })

  it('formats an advanced operation with a negative coefficient', () => {
    const operation: RowOperation = {
      type: 'row-linear-combination',
      source: 0,
      target: 1,
      targetCoefficient: new Fraction(2),
      sourceCoefficient: new Fraction(-3),
    }

    expect(formatOperation(operation)).toBe(
      'R2 ← 2R2 − 3R1',
    )
  })

  it('omits zero coefficients', () => {
    const operation: RowOperation = {
      type: 'row-linear-combination',
      source: 0,
      target: 1,
      targetCoefficient: new Fraction(1),
      sourceCoefficient: new Fraction(0),
    }

    expect(formatOperation(operation)).toBe(
      'R2 ← R2',
    )
  })

  it('formats two zero coefficients as zero', () => {
    const operation: RowOperation = {
      type: 'row-linear-combination',
      source: 0,
      target: 1,
      targetCoefficient: new Fraction(0),
      sourceCoefficient: new Fraction(0),
    }

    expect(formatOperation(operation)).toBe(
      'R2 ← 0',
    )
  })
})
