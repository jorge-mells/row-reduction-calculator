import { useCallback, useReducer, useState } from 'react'
import MatrixEditor from './components/MatrixEditor'
import OperationDialog from './components/OperationDialog'
import HistoryPanel from './components/HistoryPanel'
import MatrixSetup from './components/MatrixSetup'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import type { RowOperation } from './engine/operations'
import { formatOperation } from './engine/formatting'
import { initialState } from './state/initialState'
import { appReducer } from './state/reducer'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

interface OperationSelection {
  source: number
  target?: number
}

interface FocusRowRequest {
  id: number
  row: number
}

function App() {
  const [state, dispatch] = useReducer(
    appReducer,
    initialState,
  )

  const [operationSelection, setOperationSelection] =
    useState<OperationSelection | null>(null)

  const [focusFirstCellRequest, setFocusFirstCellRequest] =
    useState(0)

  const [activeRow, setActiveRow] = useState<number | null>(
    null,
  )

  const [focusRowRequest, setFocusRowRequest] =
    useState<FocusRowRequest>({
      id: 0,
      row: 0,
    })

  const [lastOperation, setLastOperation] =
    useState<RowOperation | null>(null)

  function focusFirstCell() {
    setActiveRow(null)

    setFocusFirstCellRequest((request) => request + 1)
  }

  function activateRow(row: number) {
    setActiveRow(row)
  }

  function focusRow(row: number) {
    setActiveRow(row)

    setFocusRowRequest((request) => ({
      id: request.id + 1,
      row,
    }))
  }

  const undo = useCallback(() => {
    if (state.historyIndex === 0) {
      return
    }

    dispatch({ type: 'UNDO' })
    focusFirstCell()
  }, [state.historyIndex])

  const redo = useCallback(() => {
    if (
      state.historyIndex ===
      state.history.length - 1
    ) {
      return
    }

    dispatch({ type: 'REDO' })
    focusFirstCell()
  }, [
    state.historyIndex,
    state.history.length,
  ])

  useKeyboardShortcuts({
    undo,
    redo,
  })

  function restoreHistory(index: number) {
    if (index === state.historyIndex) {
      return
    }

    dispatch({
      type: 'RESTORE_HISTORY',
      index,
    })

    focusFirstCell()
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-kicker">Linear algebra tool</p>

          <h1>Row Reduction Calculator</h1>

          <p className="app-description">
            Perform exact row operations and keep a complete
            history of your matrix transformations.
          </p>
        </div>

        <div className="history-controls">
          <button
            className="toolbar-button"
            type="button"
            onClick={undo}
            disabled={state.historyIndex === 0}
          >
            <span>↶</span>
            Undo
          </button>

          <button
            className="toolbar-button"
            type="button"
            onClick={redo}
            disabled={
              state.historyIndex ===
              state.history.length - 1
            }
          >
            <span>↷</span>
            Redo
          </button>
        </div>
      </header>

      <div className="workspace">
        <div className="workspace-main">
          <div className="matrix-toolbar">
            <MatrixSetup
              dispatch={dispatch}
              rows={state.matrix.length}
              columns={state.matrix[0]?.length ?? 0}
              onSubmit={() => {
                setFocusFirstCellRequest(
                  (request) => request + 1,
                )
              }}
            />
          </div>

          <section className="matrix-card">
            <div className="matrix-card-header">
              <h2>Matrix</h2>

              <span className="matrix-hint">
                Click a row label to scale · Drag between
                rows to operate
              </span>
            </div>

            <div className="matrix-stage">
              <div className="matrix-scroll">
                <MatrixEditor
                  matrix={state.matrix}
                  dispatch={dispatch}
                  onScaleRow={(row) => {
                    activateRow(row)

                    setOperationSelection({
                      source: row,
                    })
                  }}
                  onDropRow={(source, target) => {
                    activateRow(target)

                    setOperationSelection({
                      source,
                      target,
                    })
                  }}
                  focusFirstCellRequest={
                    focusFirstCellRequest
                  }
                  focusRowRequest={focusRowRequest}
                  activeRow={activeRow}
                />
              </div>
            </div>

            {lastOperation !== null && (
              <div className="last-operation">
                <span className="last-operation-label">
                  Last operation
                </span>

                <span className="last-operation-value">
                  {formatOperation(lastOperation)}
                </span>
              </div>
            )}
          </section>

          <KeyboardShortcuts />
        </div>

        <aside className="history-sidebar">
          <HistoryPanel
            history={state.history}
            historyIndex={state.historyIndex}
            dispatch={(action) => {
              if (action.type === 'RESTORE_HISTORY') {
                restoreHistory(action.index)
                return
              }

              dispatch(action)
            }}
          />
        </aside>
      </div>

      {operationSelection !== null && (
        <OperationDialog
          source={operationSelection.source}
          target={operationSelection.target}
          dispatch={dispatch}
          onApply={(operation, affectedRow) => {
            setLastOperation(operation)
            focusRow(affectedRow)
          }}
          onClose={() => {
            setOperationSelection(null)
          }}
        />
      )}
    </main>
  )
}

export default App
