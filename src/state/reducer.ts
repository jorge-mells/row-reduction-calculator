import Fraction from 'fraction.js'
import {
  cloneMatrix,
  resizeMatrix,
  type Matrix,
} from '../engine/matrix'
import {
  applyRowOperation,
  type RowOperation,
} from '../engine/operations'
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
    type: 'REDO'
  }
  | {
    type: 'RESTORE_HISTORY'
    index: number
  }
  | {
    type: 'SET_CELL'
    row: number
    column: number
    value: Fraction
  }
  | {
    type: 'RESET'
    matrix: Matrix
  }
  | {
    type: 'RESIZE_MATRIX'
    rows: number
    columns: number
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
          kind: 'operation' as const,
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

    case 'REDO': {
      if (state.historyIndex === state.history.length - 1) {
        return state
      }

      const nextIndex = state.historyIndex + 1

      return {
        ...state,
        matrix: cloneMatrix(
          state.history[nextIndex].matrix,
        ),
        historyIndex: nextIndex,
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

      const currentEntry = state.history[state.historyIndex]

      if (currentEntry.kind === 'edit') {
        const history = [...state.history]

        history[state.historyIndex] = {
          ...currentEntry,
          matrix: cloneMatrix(matrix),
        }

        return {
          ...state,
          matrix,
          history,
        }
      }

      const nextHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          matrix: cloneMatrix(matrix),
          operation: null,
          kind: 'edit' as const,
        },
      ]

      return {
        ...state,
        matrix,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
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
            kind: 'initial',
          },
        ],
        historyIndex: 0,
      }
    }

    case 'RESIZE_MATRIX': {
      if (
        !Number.isInteger(action.rows) ||
        !Number.isInteger(action.columns) ||
        action.rows < 1 ||
        action.columns < 1
      ) {
        return state
      }

      const matrix = resizeMatrix(
        state.matrix,
        action.rows,
        action.columns,
      )

      const nextHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          matrix: cloneMatrix(matrix),
          operation: null,
          kind: 'edit' as const,
        },
      ]

      return {
        ...state,
        matrix,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      }
    }
  }
}
