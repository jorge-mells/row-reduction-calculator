import { useEffect, useRef, useState } from 'react'
import type { Dispatch, KeyboardEvent } from 'react'
import { createMatrix } from '../engine/matrix'
import type { AppAction } from '../state/reducer'
import {
  isAtInputEnd,
  isAtInputStart,
  selectInputOnFocus,
} from './inputNavigation'

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

    onSubmit()
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
    if (event.key === 'ArrowRight' && isAtInputEnd(event)) {
      event.preventDefault()
      columnInputRef.current?.focus()
      return
    }

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
    if (
      event.key === 'ArrowLeft' &&
      isAtInputStart(event)
    ) {
      event.preventDefault()
      rowInputRef.current?.focus()
      return
    }

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
    <div className="matrix-setup">
      <div className="setup-title">
        <span className="section-eyebrow">Setup</span>
        <strong>Matrix dimensions</strong>
      </div>

      <div className="dimension-fields">
        <label className="dimension-field">
          <span>Rows</span>
          <input
            ref={rowInputRef}
            type="text"
            inputMode="numeric"
            value={rowInput}
            onChange={(event) => {
              setRowInput(event.target.value)
            }}
            onFocus={selectInputOnFocus}
            onBlur={() => {
              if (rowInput === '') {
                setRowInput(String(rows))
              }
            }}
            onKeyDown={handleRowKeyDown}
            aria-label="Number of rows"
          />
        </label>

        <span className="dimension-separator">×</span>

        <label className="dimension-field">
          <span>Columns</span>
          <input
            ref={columnInputRef}
            type="text"
            inputMode="numeric"
            value={columnInput}
            onChange={(event) => {
              setColumnInput(event.target.value)
            }}
            onFocus={selectInputOnFocus}
            onBlur={() => {
              if (columnInput === '') {
                setColumnInput(String(columns))
              }
            }}
            onKeyDown={handleColumnKeyDown}
            aria-label="Number of columns"
          />
        </label>
      </div>

      <div className="setup-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={resize}
          disabled={!dimensionsChanged}
        >
          Resize
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={create}
        >
          New matrix
        </button>
      </div>
    </div>
  )
}

export default MatrixSetup
