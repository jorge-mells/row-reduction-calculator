import type { Matrix } from '../engine/matrix'
import type { RowOperation } from '../engine/operations'

export type HistoryEntryKind =
  | 'initial'
  | 'operation'
  | 'edit'

export interface HistoryEntry {
  matrix: Matrix
  operation: RowOperation | null
  kind: HistoryEntryKind
}

export interface AppState {
  matrix: Matrix
  history: HistoryEntry[]
  historyIndex: number
}
