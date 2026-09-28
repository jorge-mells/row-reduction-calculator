import {
  useEffect,
  useRef,
} from 'react'
import type { Dispatch } from 'react'
import type { Matrix } from '../engine/matrix'
import type { AppAction } from '../state/reducer'
import MatrixRow from './MatrixRow'

interface MatrixEditorProps {
  matrix: Matrix
  dispatch: Dispatch<AppAction>
  onScaleRow: (row: number) => void
  onDropRow: (source: number, target: number) => void
  focusFirstCellRequest: number
  focusRowRequest: {
    id: number
    row: number
  }
  activeRow: number | null
}

function MatrixEditor({
  matrix,
  dispatch,
  onScaleRow,
  onDropRow,
  focusFirstCellRequest,
  focusRowRequest,
  activeRow,
}: MatrixEditorProps) {
  const cellRefs = useRef<HTMLInputElement[][]>([])

  function setCellRef(
    row: number,
    column: number,
    element: HTMLInputElement | null,
  ) {
    if (!cellRefs.current[row]) {
      cellRefs.current[row] = []
    }

    cellRefs.current[row][column] = element!
  }

  function focusCell(row: number, column: number) {
    const rowCount = matrix.length
    const columnCount = matrix[0]?.length ?? 0

    if (rowCount === 0 || columnCount === 0) {
      return
    }

    let nextRow = row
    let nextColumn = column

    if (nextRow < 0) {
      nextRow = rowCount - 1
    }

    if (nextRow >= rowCount) {
      nextRow = 0
    }

    if (nextColumn < 0) {
      nextColumn = columnCount - 1
    }

    if (nextColumn >= columnCount) {
      nextColumn = 0
    }

    cellRefs.current[nextRow]?.[nextColumn]?.focus()
  }

  function navigateCell(
    row: number,
    column: number,
    direction: 'up' | 'down' | 'left' | 'right',
  ) {
    const rowCount = matrix.length
    const columnCount = matrix[0]?.length ?? 0

    if (rowCount === 0 || columnCount === 0) {
      return
    }

    let nextRow = row
    let nextColumn = column

    switch (direction) {
      case 'up':
        nextRow--
        if (nextRow < 0) {
          nextRow = rowCount - 1
        }
        break

      case 'down':
        nextRow++
        if (nextRow >= rowCount) {
          nextRow = 0
        }
        break

      case 'left':
        nextColumn--
        if (nextColumn < 0) {
          nextColumn = columnCount - 1
          nextRow--
          if (nextRow < 0) {
            nextRow = rowCount - 1
          }
        }
        break

      case 'right':
        nextColumn++
        if (nextColumn >= columnCount) {
          nextColumn = 0
          nextRow++
          if (nextRow >= rowCount) {
            nextRow = 0
          }
        }
        break
    }

    focusCell(nextRow, nextColumn)
  }

  useEffect(() => {
    if (focusFirstCellRequest === 0) {
      return
    }

    focusCell(0, 0)
  }, [focusFirstCellRequest])

  useEffect(() => {
    if (focusRowRequest.id === 0) {
      return
    }

    focusCell(focusRowRequest.row, 0)
  }, [focusRowRequest.id])

  return (
    <div className="matrix">
      {matrix.map((row, rowIndex) => (
        <MatrixRow
          key={rowIndex}
          row={row}
          rowIndex={rowIndex}
          dispatch={dispatch}
          onScaleRow={onScaleRow}
          onDropRow={onDropRow}
          setCellRef={setCellRef}
          onNavigate={navigateCell}
          isActive={rowIndex === activeRow}
        />
      ))}
    </div>
  )
}

export default MatrixEditor
