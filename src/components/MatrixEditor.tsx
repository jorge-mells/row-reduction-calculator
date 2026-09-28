import type { Dispatch } from 'react'
import type { Matrix } from '../engine/matrix'
import type { AppAction } from '../state/reducer'
import MatrixRow from './MatrixRow'

interface MatrixEditorProps {
  matrix: Matrix
  dispatch: Dispatch<AppAction>
}

function MatrixEditor({
  matrix,
  dispatch,
}: MatrixEditorProps) {
  return (
    <div className="matrix">
      {matrix.map((row, rowIndex) => (
        <MatrixRow
          key={rowIndex}
          row={row}
          rowIndex={rowIndex}
          dispatch={dispatch}
        />
      ))}
    </div>
  )
}

export default MatrixEditor
