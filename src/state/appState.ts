import type { Matrix } from '../engine/matrix'
import type { RowOperation } from '../engine/operations'

export interface HistoryEntry {
  matrix: Matrix
  operation: RowOperation | null
}

export interface AppState {
  matrix: Matrix
  history: HistoryEntry[]
  historyIndex: number
}
