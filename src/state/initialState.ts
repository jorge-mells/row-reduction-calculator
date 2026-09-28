import type { AppState } from './appState'

const initialMatrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

export const initialState: AppState = {
  matrix: initialMatrix,
  history: [
    {
      matrix: initialMatrix.map((row) => [...row]),
      operation: null,
    },
  ],
  historyIndex: 0,
}
