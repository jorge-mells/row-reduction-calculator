import { useReducer, useState } from 'react'
import MatrixEditor from './components/MatrixEditor'
import OperationDialog from './components/OperationDialog'
import HistoryPanel from './components/HistoryPanel'
import MatrixSetup from './components/MatrixSetup'
import type { RowOperation } from './engine/operations'
import { formatOperation } from './engine/formatting'
import { initialState } from './state/initialState'
import { appReducer } from './state/reducer'

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

  function undo() {
    if (state.historyIndex === 0) {
      return
    }

    dispatch({ type: 'UNDO' })
    focusFirstCell()
  }

  function redo() {
    if (
      state.historyIndex ===
      state.history.length - 1
    ) {
      return
    }

    dispatch({ type: 'REDO' })
    focusFirstCell()
  }

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
    <main>
      <h1>Row Reduction Calculator</h1>

      <button
        onClick={undo}
        disabled={state.historyIndex === 0}
      >
        Undo
      </button>

      <button
        onClick={redo}
        disabled={
          state.historyIndex === state.history.length - 1
        }
      >
        Redo
      </button>

      <MatrixSetup
        dispatch={dispatch}
        rows={state.matrix.length}
        columns={state.matrix[0]?.length ?? 0}
        onSubmit={() => {
          setFocusFirstCellRequest((request) => request + 1)
        }}
      />

      {lastOperation !== null && (
        <div className="last-operation">
          {formatOperation(lastOperation)}
        </div>
      )}

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
        focusFirstCellRequest={focusFirstCellRequest}
        focusRowRequest={focusRowRequest}
        activeRow={activeRow}
      />

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
