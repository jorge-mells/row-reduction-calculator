import { cloneMatrix } from '../engine/matrix'
import { applyRowOperation, type RowOperation } from '../engine/operations'
import type { AppState } from './appState'

export type AppAction =
  | {
      type: 'APPLY_OPERATION'
      operation: RowOperation
    }
  | {
      type: 'UNDO'
    }
  | {
      type: 'RESTORE_HISTORY'
      index: number
    }
  | {
      type: 'SET_CELL'
      row: number
      column: number
      value: number
    }
  | {
      type: 'RESET'
      matrix: number[][]
    }

export function appReducer(
  state: AppState,
  action: AppAction,
): AppState {
  switch (action.type) {
    case 'APPLY_OPERATION': {
      const nextMatrix = applyRowOperation(
        state.matrix,
        action.operation,
      )

      const nextHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          matrix: cloneMatrix(nextMatrix),
          operation: action.operation,
        },
      ]

      return {
        ...state,
        matrix: nextMatrix,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      }
    }

    case 'UNDO': {
      if (state.historyIndex === 0) {
        return state
      }

      const previousIndex = state.historyIndex - 1

      return {
        ...state,
        matrix: cloneMatrix(
          state.history[previousIndex].matrix,
        ),
        historyIndex: previousIndex,
      }
    }

    case 'RESTORE_HISTORY': {
      if (
        action.index < 0 ||
        action.index >= state.history.length
      ) {
        return state
      }

      return {
        ...state,
        matrix: cloneMatrix(
          state.history[action.index].matrix,
        ),
        historyIndex: action.index,
      }
    }

    case 'SET_CELL': {
      const matrix = cloneMatrix(state.matrix)

      if (
        action.row < 0 ||
        action.row >= matrix.length ||
        action.column < 0 ||
        action.column >= matrix[action.row].length
      ) {
        return state
      }

      matrix[action.row][action.column] = action.value

      return {
        ...state,
        matrix,
      }
    }

    case 'RESET': {
      const matrix = cloneMatrix(action.matrix)

      return {
        matrix,
        history: [
          {
            matrix: cloneMatrix(matrix),
            operation: null,
          },
        ],
        historyIndex: 0,
      }
    }
  }
}
