import Fraction from 'fraction.js'
import type { RowOperation } from './operations'

function formatFraction(value: Fraction): string {
  if (value.d === 1n) {
    return value.n.toString()
  }

  return `${value.n}/${value.d}`
}

function formatTerm(
  coefficient: Fraction,
  row: number,
): string {
  const absolute = coefficient.abs()

  if (absolute.equals(1)) {
    return `R${row + 1}`
  }

  return `${formatFraction(absolute)}R${row + 1}`
}

function formatSignedTerms(
  terms: Array<{
    coefficient: Fraction
    row: number
  }>,
): string {
  const nonZeroTerms = terms.filter(
    ({ coefficient }) => !coefficient.equals(0),
  )

  if (nonZeroTerms.length === 0) {
    return '0'
  }

  return nonZeroTerms
    .map(({ coefficient, row }, index) => {
      const negative = coefficient.lt(0)
      const term = formatTerm(coefficient, row)

      if (index === 0) {
        return negative ? `−${term}` : term
      }

      return negative ? ` − ${term}` : ` + ${term}`
    })
    .join('')
}

export function formatOperation(
  operation: RowOperation,
): string {
  switch (operation.type) {
    case 'row-add':
      return `R${operation.target + 1} ← ${formatSignedTerms([
        {
          coefficient: new Fraction(1),
          row: operation.target,
        },
        {
          coefficient: operation.coefficient,
          row: operation.source,
        },
      ])}`

    case 'row-swap':
      return `R${operation.first + 1} ↔ R${operation.second + 1}`

    case 'row-scale':
      return `R${operation.row + 1} ← ${formatSignedTerms([
        {
          coefficient: operation.coefficient,
          row: operation.row,
        },
      ])}`

    case 'row-linear-combination':
      return `R${operation.target + 1} ← ${formatSignedTerms([
        {
          coefficient: operation.targetCoefficient,
          row: operation.target,
        },
        {
          coefficient: operation.sourceCoefficient,
          row: operation.source,
        },
      ])}`
  }
}
