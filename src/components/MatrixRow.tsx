import { useEffect, useState } from 'react'
import type { Dispatch, KeyboardEvent } from 'react'
import Fraction from 'fraction.js'
import type { Matrix } from '../engine/matrix'
import type { AppAction } from '../state/reducer'

interface MatrixRowProps {
  row: Matrix[number]
  rowIndex: number
  dispatch: Dispatch<AppAction>
  onScaleRow: (row: number) => void
  onDropRow: (source: number, target: number) => void
  setCellRef: (
    row: number,
    column: number,
    element: HTMLInputElement | null,
  ) => void
  onNavigate: (
    row: number,
    column: number,
    direction: 'up' | 'down' | 'left' | 'right',
  ) => void
  isActive: boolean
}

function MatrixRow({
  row,
  rowIndex,
  dispatch,
  onScaleRow,
  onDropRow,
  setCellRef,
  onNavigate,
  isActive,
}: MatrixRowProps) {
  const [values, setValues] = useState(
    row.map((value) => value.toString()),
  )

  useEffect(() => {
    setValues(row.map((value) => value.toString()))
  }, [row])

  function commitCell(columnIndex: number) {
    try {
      const value = new Fraction(values[columnIndex])

      dispatch({
        type: 'SET_CELL',
        row: rowIndex,
        column: columnIndex,
        value,
      })
    } catch {
      setValues((current) => {
        const next = [...current]
        next[columnIndex] = row[columnIndex].toString()
        return next
      })
    }
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    columnIndex: number,
  ) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        commitCell(columnIndex)

        onNavigate(
          rowIndex,
          columnIndex,
          event.shiftKey ? 'left' : 'right',
        )
        break

      case 'Tab':
        event.preventDefault()
        commitCell(columnIndex)

        onNavigate(
          rowIndex,
          columnIndex,
          event.shiftKey ? 'up' : 'down',
        )
        break

      case 'ArrowUp':
        event.preventDefault()
        commitCell(columnIndex)

        onNavigate(rowIndex, columnIndex, 'up')
        break

      case 'ArrowDown':
        event.preventDefault()
        commitCell(columnIndex)

        onNavigate(rowIndex, columnIndex, 'down')
        break
    }
  }

  return (
    <div
      className={`matrix-row${isActive ? ' active' : ''}`}
    >
      <button
        className="row-header"
        draggable
        onClick={() => {
          onScaleRow(rowIndex)
        }}
        onDragStart={(event) => {
          event.dataTransfer.setData(
            'text/plain',
            String(rowIndex),
          )

          event.dataTransfer.effectAllowed = 'move'
        }}
        onDragOver={(event) => {
          event.preventDefault()
          event.dataTransfer.dropEffect = 'move'
        }}
        onDrop={(event) => {
          event.preventDefault()

          const source = Number(
            event.dataTransfer.getData('text/plain'),
          )

          if (source === rowIndex) {
            return
          }

          onDropRow(source, rowIndex)
        }}
      >
        R{rowIndex + 1}
      </button>

      {values.map((value, columnIndex) => (
        <input
          className="matrix-cell"
          key={columnIndex}
          ref={(element) => {
            setCellRef(rowIndex, columnIndex, element)
          }}
          type="text"
          value={value}
          onChange={(event) => {
            const nextValue = event.target.value

            setValues((current) => {
              const next = [...current]
              next[columnIndex] = nextValue
              return next
            })
          }}
          onFocus={(event) => {
            event.target.select()
          }}
          onBlur={() => {
            commitCell(columnIndex)
          }}
          onKeyDown={(event) => {
            handleKeyDown(event, columnIndex)
          }}
        />
      ))}
    </div>
  )
}

export default MatrixRow
