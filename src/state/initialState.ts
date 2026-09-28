import Fraction from 'fraction.js'
import type { AppState } from './appState'

const initialMatrix = [
  [new Fraction(1), new Fraction(2), new Fraction(3)],
  [new Fraction(4), new Fraction(5), new Fraction(6)],
  [new Fraction(7), new Fraction(8), new Fraction(9)],
]

export const initialState: AppState = {
  matrix: initialMatrix,
  history: [
    {
      matrix: initialMatrix.map((row) =>
        row.map((value) => new Fraction(value)),
      ),
      operation: null,
      kind: 'initial',
    },
  ],
  historyIndex: 0,
}
