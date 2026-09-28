import { useEffect, useRef, useState } from 'react'
import type { Dispatch, KeyboardEvent } from 'react'
import { createMatrix } from '../engine/matrix'
import type { AppAction } from '../state/reducer'

interface MatrixSetupProps {
  dispatch: Dispatch<AppAction>
  rows: number
  columns: number
  onSubmit: () => void
}

function MatrixSetup({
  dispatch,
  rows,
  columns,
  onSubmit,
}: MatrixSetupProps) {
  const [rowInput, setRowInput] = useState(String(rows))
  const [columnInput, setColumnInput] = useState(
    String(columns),
  )

  const rowInputRef = useRef<HTMLInputElement>(null)
  const columnInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setRowInput(String(rows))
    setColumnInput(String(columns))
  }, [rows, columns])

  function getDimensions() {
    const nextRows = Number(rowInput)
    const nextColumns = Number(columnInput)

    if (
      !Number.isInteger(nextRows) ||
      nextRows < 1 ||
      !Number.isInteger(nextColumns) ||
      nextColumns < 1
    ) {
      return null
    }

    return {
      rows: nextRows,
      columns: nextColumns,
    }
  }

  function create() {
    const dimensions = getDimensions()

    if (dimensions === null) {
      return
    }

    dispatch({
      type: 'RESET',
      matrix: createMatrix(
        dimensions.rows,
        dimensions.columns,
      ),
    })
  }

  function resize() {
    const dimensions = getDimensions()

    if (dimensions === null) {
      return false
    }

    if (
      dimensions.rows === rows &&
      dimensions.columns === columns
    ) {
      return true
    }

    dispatch({
      type: 'RESIZE_MATRIX',
      rows: dimensions.rows,
      columns: dimensions.columns,
    })

    return true
  }

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    if (event.shiftKey) {
      return
    }

    columnInputRef.current?.focus()
  }

  function handleColumnKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    if (event.shiftKey) {
      rowInputRef.current?.focus()
      return
    }

    if (resize()) {
      onSubmit()
    }
  }

  const dimensionsChanged =
    Number(rowInput) !== rows ||
    Number(columnInput) !== columns

  return (
    <section>
      <h2>Matrix</h2>

      <label>
        Rows:
        <input
          ref={rowInputRef}
          type="number"
          min="1"
          value={rowInput}
          onChange={(event) => {
            setRowInput(event.target.value)
          }}
          onBlur={() => {
            if (rowInput === '') {
              setRowInput(String(rows))
            }
          }}
          onKeyDown={handleRowKeyDown}
        />
      </label>

      <label>
        Columns:
        <input
          ref={columnInputRef}
          type="number"
          min="1"
          value={columnInput}
          onChange={(event) => {
            setColumnInput(event.target.value)
          }}
          onBlur={() => {
            if (columnInput === '') {
              setColumnInput(String(columns))
            }
          }}
          onKeyDown={handleColumnKeyDown}
        />
      </label>

      <button
        type="button"
        onClick={resize}
        disabled={!dimensionsChanged}
      >
        Resize
      </button>

      <button
        type="button"
        onClick={create}
      >
        Create matrix
      </button>
    </section>
  )
}

export default MatrixSetup
