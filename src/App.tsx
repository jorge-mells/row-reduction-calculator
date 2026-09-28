import { useReducer, useState } from 'react'
import MatrixEditor from './components/MatrixEditor'
import OperationDialog from './components/OperationDialog'
import HistoryPanel from './components/HistoryPanel'
import MatrixSetup from './components/MatrixSetup'
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

  const [focusRowRequest, setFocusRowRequest] =
    useState<FocusRowRequest>({
      id: 0,
      row: 0,
    })

  return (
    <main>
      <h1>Row Reduction Calculator</h1>

      <button
        onClick={() => {
          dispatch({ type: 'UNDO' })
        }}
        disabled={state.historyIndex === 0}
      >
        Undo
      </button>

      <button
        onClick={() => {
          dispatch({ type: 'REDO' })
        }}
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

      <MatrixEditor
        matrix={state.matrix}
        dispatch={dispatch}
        onScaleRow={(row) => {
          setOperationSelection({
            source: row,
          })
        }}
        onDropRow={(source, target) => {
          setOperationSelection({
            source,
            target,
          })
        }}
        focusFirstCellRequest={focusFirstCellRequest}
        focusRowRequest={focusRowRequest}
      />

      <HistoryPanel
        history={state.history}
        historyIndex={state.historyIndex}
        dispatch={dispatch}
      />

      {operationSelection !== null && (
        <OperationDialog
          source={operationSelection.source}
          target={operationSelection.target}
          dispatch={dispatch}
          onApply={(affectedRow) => {
            setFocusRowRequest((request) => ({
              id: request.id + 1,
              row: affectedRow,
            }))
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
