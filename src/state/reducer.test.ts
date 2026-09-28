import { describe, expect, it } from 'vitest'
import Fraction from 'fraction.js'
import {
  createMatrix,
  matricesEqual,
} from '../engine/matrix'
import { appReducer, type AppAction } from './reducer'
import type { AppState } from './appState'

function createTestState(): AppState {
  const matrix = [
    [new Fraction(1), new Fraction(2)],
    [new Fraction(3), new Fraction(4)],
  ]

  return {
    matrix,
    history: [
      {
        matrix: matrix.map((row) =>
          row.map((value) => new Fraction(value)),
        ),
        operation: null,
        kind: 'initial',
      },
    ],
    historyIndex: 0,
  }
}

function reduce(
  state: AppState,
  action: AppAction,
): AppState {
  return appReducer(state, action)
}

describe('appReducer', () => {
  it('applies a row operation and adds it to history', () => {
    const state = createTestState()

    const next = reduce(state, {
      type: 'APPLY_OPERATION',
      operation: {
        type: 'row-add',
        source: 0,
        target: 1,
        coefficient: new Fraction(-3),
      },
    })

    expect(
      matricesEqual(next.matrix, [
        [new Fraction(1), new Fraction(2)],
        [new Fraction(0), new Fraction(-2)],
      ]),
    ).toBe(true)

    expect(next.history).toHaveLength(2)
    expect(next.historyIndex).toBe(1)
    expect(next.history[1].kind).toBe('operation')
  })

  it('undoes an operation', () => {
    const state = createTestState()

    const afterOperation = reduce(state, {
      type: 'APPLY_OPERATION',
      operation: {
        type: 'row-add',
        source: 0,
        target: 1,
        coefficient: new Fraction(-3),
      },
    })

    const afterUndo = reduce(afterOperation, {
      type: 'UNDO',
    })

    expect(
      matricesEqual(afterUndo.matrix, state.matrix),
    ).toBe(true)

    expect(afterUndo.historyIndex).toBe(0)
  })

  it('redoes an undone operation', () => {
    const state = createTestState()

    const afterOperation = reduce(state, {
      type: 'APPLY_OPERATION',
      operation: {
        type: 'row-add',
        source: 0,
        target: 1,
        coefficient: new Fraction(-3),
      },
    })

    const afterUndo = reduce(afterOperation, {
      type: 'UNDO',
    })

    const afterRedo = reduce(afterUndo, {
      type: 'REDO',
    })

    expect(
      matricesEqual(afterRedo.matrix, afterOperation.matrix),
    ).toBe(true)

    expect(afterRedo.historyIndex).toBe(1)
  })

  it('does nothing when undoing the initial state', () => {
    const state = createTestState()

    const next = reduce(state, {
      type: 'UNDO',
    })

    expect(next).toBe(state)
  })

  it('does nothing when redoing the latest history entry', () => {
    const state = createTestState()

    const next = reduce(state, {
      type: 'REDO',
    })

    expect(next).toBe(state)
  })

  it('restores a previous history entry', () => {
    const state = createTestState()

    const afterOperation = reduce(state, {
      type: 'APPLY_OPERATION',
      operation: {
        type: 'row-scale',
        row: 0,
        coefficient: new Fraction(2),
      },
    })

    const restored = reduce(afterOperation, {
      type: 'RESTORE_HISTORY',
      index: 0,
    })

    expect(
      matricesEqual(restored.matrix, state.matrix),
    ).toBe(true)

    expect(restored.historyIndex).toBe(0)
  })

  it('edits a cell and adds an edit history entry', () => {
    const state = createTestState()

    const next = reduce(state, {
      type: 'SET_CELL',
      row: 0,
      column: 1,
      value: new Fraction(5, 2),
    })

    expect(
      matricesEqual(next.matrix, [
        [new Fraction(1), new Fraction(5, 2)],
        [new Fraction(3), new Fraction(4)],
      ]),
    ).toBe(true)

    expect(next.history).toHaveLength(2)
    expect(next.historyIndex).toBe(1)
    expect(next.history[1].kind).toBe('edit')
  })

  it('batches consecutive cell edits into one history entry', () => {
    const state = createTestState()

    const afterFirstEdit = reduce(state, {
      type: 'SET_CELL',
      row: 0,
      column: 0,
      value: new Fraction(10),
    })

    const afterSecondEdit = reduce(afterFirstEdit, {
      type: 'SET_CELL',
      row: 1,
      column: 1,
      value: new Fraction(20),
    })

    expect(afterSecondEdit.history).toHaveLength(2)

    expect(
      matricesEqual(afterSecondEdit.matrix, [
        [new Fraction(10), new Fraction(2)],
        [new Fraction(3), new Fraction(20)],
      ]),
    ).toBe(true)
  })

  it('ignores an invalid cell edit', () => {
    const state = createTestState()

    const next = reduce(state, {
      type: 'SET_CELL',
      row: 10,
      column: 10,
      value: new Fraction(5),
    })

    expect(next).toBe(state)
  })

  it('resets the matrix and history', () => {
    const state = createTestState()

    const nextMatrix = createMatrix(3, 1)

    const next = reduce(state, {
      type: 'RESET',
      matrix: nextMatrix,
    })

    expect(
      matricesEqual(next.matrix, nextMatrix),
    ).toBe(true)

    expect(next.history).toHaveLength(1)
    expect(next.historyIndex).toBe(0)
    expect(next.history[0].kind).toBe('initial')
  })

  it('resizes the matrix and preserves existing values', () => {
    const state = createTestState()

    const next = reduce(state, {
      type: 'RESIZE_MATRIX',
      rows: 3,
      columns: 1,
    })

    expect(
      matricesEqual(next.matrix, [
        [new Fraction(1)],
        [new Fraction(3)],
        [new Fraction(0)],
      ]),
    ).toBe(true)

    expect(next.history).toHaveLength(2)
    expect(next.historyIndex).toBe(1)
    expect(next.history[1].kind).toBe('edit')
  })

  it('discards future history when applying an operation after undo', () => {
    const state = createTestState()

    const afterFirstOperation = reduce(state, {
      type: 'APPLY_OPERATION',
      operation: {
        type: 'row-add',
        source: 0,
        target: 1,
        coefficient: new Fraction(-1),
      },
    })

    const afterSecondOperation = reduce(
      afterFirstOperation,
      {
        type: 'APPLY_OPERATION',
        operation: {
          type: 'row-scale',
          row: 0,
          coefficient: new Fraction(2),
        },
      },
    )

    const afterUndo = reduce(afterSecondOperation, {
      type: 'UNDO',
    })

    const afterNewOperation = reduce(afterUndo, {
      type: 'APPLY_OPERATION',
      operation: {
        type: 'row-scale',
        row: 1,
        coefficient: new Fraction(3),
      },
    })

    expect(afterNewOperation.history).toHaveLength(3)
    expect(afterNewOperation.history[1].operation?.type).toBe(
      'row-add',
    )
    expect(afterNewOperation.history[2].operation?.type).toBe(
      'row-scale',
    )
    expect(afterNewOperation.historyIndex).toBe(2)
  })

  it('discards future history when applying an operation after restoring history', () => {
    const state = createTestState()

    const afterFirstOperation = reduce(state, {
      type: 'APPLY_OPERATION',
      operation: {
        type: 'row-add',
        source: 0,
        target: 1,
        coefficient: new Fraction(-1),
      },
    })

    const afterSecondOperation = reduce(
      afterFirstOperation,
      {
        type: 'APPLY_OPERATION',
        operation: {
          type: 'row-scale',
          row: 0,
          coefficient: new Fraction(2),
        },
      },
    )

    const restored = reduce(afterSecondOperation, {
      type: 'RESTORE_HISTORY',
      index: 1,
    })

    const afterNewOperation = reduce(restored, {
      type: 'APPLY_OPERATION',
      operation: {
        type: 'row-scale',
        row: 1,
        coefficient: new Fraction(3),
      },
    })

    expect(afterNewOperation.history).toHaveLength(3)
    expect(afterNewOperation.history[1].operation?.type).toBe(
      'row-add',
    )
    expect(afterNewOperation.history[2].operation?.type).toBe(
      'row-scale',
    )
    expect(afterNewOperation.historyIndex).toBe(2)
  })

})
