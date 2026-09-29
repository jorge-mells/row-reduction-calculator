import {
  useEffect,
  useRef,
  useState,
} from 'react'
import type {
  Dispatch,
  KeyboardEvent,
} from 'react'
import Fraction from 'fraction.js'
import type { AppAction } from '../state/reducer'
import type { RowOperation } from '../engine/operations'
import {
  isAtInputEnd,
  isAtInputStart,
  selectInputOnFocus,
} from './inputNavigation'

interface OperationDialogProps {
  source: number
  target?: number
  dispatch: Dispatch<AppAction>
  onApply: (
    operation: RowOperation,
    affectedRow: number,
  ) => void
  onClose: () => void
}

type OperationType =
  | 'row-add'
  | 'row-swap'
  | 'row-linear-combination'

function OperationDialog({
  source,
  target,
  dispatch,
  onApply,
  onClose,
}: OperationDialogProps) {
  const singleRow = target === undefined

  const [operationType, setOperationType] =
    useState<OperationType>('row-add')

  const [coefficient, setCoefficient] = useState('1')
  const [targetCoefficient, setTargetCoefficient] =
    useState('1')
  const [sourceCoefficient, setSourceCoefficient] =
    useState('1')

  const [focusOperationInput, setFocusOperationInput] =
    useState(false)

  const coefficientRef =
    useRef<HTMLInputElement>(null)

  const targetCoefficientRef =
    useRef<HTMLInputElement>(null)

  const sourceCoefficientRef =
    useRef<HTMLInputElement>(null)

  const addRadioRef =
    useRef<HTMLInputElement>(null)

  const swapRadioRef =
    useRef<HTMLInputElement>(null)

  const advancedRadioRef =
    useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (singleRow) {
      coefficientRef.current?.focus()
      return
    }

    addRadioRef.current?.focus()
  }, [singleRow, source, target])

  useEffect(() => {
    if (!focusOperationInput) {
      return
    }

    if (operationType === 'row-add') {
      coefficientRef.current?.focus()
    }

    if (operationType === 'row-linear-combination') {
      targetCoefficientRef.current?.focus()
    }

    setFocusOperationInput(false)
  }, [operationType, focusOperationInput])

  function apply() {
    if (singleRow) {
      try {
        const value = new Fraction(coefficient)

        const operation: RowOperation = {
          type: 'row-scale',
          row: source,
          coefficient: value,
        }

        dispatch({
          type: 'APPLY_OPERATION',
          operation,
        })

        onApply(operation, source)
        onClose()
      } catch {
        return
      }

      return
    }

    if (operationType === 'row-swap') {
      const operation: RowOperation = {
        type: 'row-swap',
        first: source,
        second: target,
      }

      dispatch({
        type: 'APPLY_OPERATION',
        operation,
      })

      onApply(operation, target)
      onClose()
      return
    }

    if (operationType === 'row-linear-combination') {
      try {
        const targetValue = new Fraction(
          targetCoefficient,
        )

        const sourceValue = new Fraction(
          sourceCoefficient,
        )

        const operation: RowOperation = {
          type: 'row-linear-combination',
          source,
          target,
          sourceCoefficient: sourceValue,
          targetCoefficient: targetValue,
        }

        dispatch({
          type: 'APPLY_OPERATION',
          operation,
        })

        onApply(operation, target)
        onClose()
      } catch {
        return
      }

      return
    }

    try {
      const value = new Fraction(coefficient)

      const operation: RowOperation = {
        type: 'row-add',
        source,
        target,
        coefficient: value,
      }

      dispatch({
        type: 'APPLY_OPERATION',
        operation,
      })

      onApply(operation, target)
      onClose()
    } catch {
      return
    }
  }

  function handleRadioKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    type: OperationType,
  ) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    setOperationType(type)

    if (type === 'row-swap') {
      apply()
      return
    }

    setFocusOperationInput(true)
  }

  function handleCoefficientKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    if (event.shiftKey) {
      return
    }

    apply()
  }

  function handleTargetCoefficientKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (
      event.key === 'ArrowRight' &&
      isAtInputEnd(event)
    ) {
      event.preventDefault()
      sourceCoefficientRef.current?.focus()
      return
    }

    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    if (event.shiftKey) {
      return
    }

    sourceCoefficientRef.current?.focus()
  }

  function handleSourceCoefficientKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (
      event.key === 'ArrowLeft' &&
      isAtInputStart(event)
    ) {
      event.preventDefault()
      targetCoefficientRef.current?.focus()
      return
    }

    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    if (event.shiftKey) {
      targetCoefficientRef.current?.focus()
      return
    }

    apply()
  }

  if (singleRow) {
    return (
      <div
        className="dialog-backdrop"
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose()
          }
        }}
      >
        <div
          className="operation-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="operation-dialog-title"
        >
          <div className="dialog-header">
            <div>
              <p className="dialog-eyebrow">
                Row operation
              </p>
              <h2 id="operation-dialog-title">
                Scale R{source + 1}
              </h2>
            </div>

            <button
              type="button"
              className="dialog-close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="operation-preview">
            R{source + 1}{' '}
            <span>←</span>{' '}
            cR{source + 1}
          </div>

          <label className="dialog-field">
            <span>Coefficient</span>
            <input
              ref={coefficientRef}
              type="text"
              value={coefficient}
              onChange={(event) => {
                setCoefficient(event.target.value)
              }}
              onFocus={selectInputOnFocus}
              onBlur={() => {
                if (coefficient === '') {
                  setCoefficient('1')
                }
              }}
              onKeyDown={handleCoefficientKeyDown}
              placeholder="1/3, -2, 5..."
            />
          </label>

          <div className="dialog-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={apply}
            >
              Apply operation
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="operation-dialog operation-dialog-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="operation-dialog-title"
      >
        <div className="dialog-header">
          <div>
            <p className="dialog-eyebrow">
              Row operation
            </p>
            <h2 id="operation-dialog-title">
              R{source + 1} → R{target! + 1}
            </h2>
          </div>

          <button
            type="button"
            className="dialog-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="operation-types">
          <label
            className={`operation-option${operationType === 'row-add'
                ? ' selected'
                : ''
              }`}
          >
            <input
              ref={addRadioRef}
              type="radio"
              name="operation"
              value="row-add"
              checked={operationType === 'row-add'}
              onChange={() => {
                setOperationType('row-add')
              }}
              onKeyDown={(event) => {
                handleRadioKeyDown(event, 'row-add')
              }}
            />

            <span>
              <strong>Add multiple</strong>
              <small>
                Add a multiple of the source row.
              </small>
            </span>
          </label>

          <label
            className={`operation-option${operationType === 'row-swap'
                ? ' selected'
                : ''
              }`}
          >
            <input
              ref={swapRadioRef}
              type="radio"
              name="operation"
              value="row-swap"
              checked={operationType === 'row-swap'}
              onChange={() => {
                setOperationType('row-swap')
              }}
              onKeyDown={(event) => {
                handleRadioKeyDown(event, 'row-swap')
              }}
            />

            <span>
              <strong>Swap rows</strong>
              <small>
                Exchange the two selected rows.
              </small>
            </span>
          </label>

          <label
            className={`operation-option${operationType ===
                'row-linear-combination'
                ? ' selected'
                : ''
              }`}
          >
            <input
              ref={advancedRadioRef}
              type="radio"
              name="operation"
              value="row-linear-combination"
              checked={
                operationType ===
                'row-linear-combination'
              }
              onChange={() => {
                setOperationType(
                  'row-linear-combination',
                )
              }}
              onKeyDown={(event) => {
                handleRadioKeyDown(
                  event,
                  'row-linear-combination',
                )
              }}
            />

            <span>
              <strong>Linear combination</strong>
              <small>
                Scale both rows before combining them.
              </small>
            </span>
          </label>
        </div>

        {operationType === 'row-add' && (
          <div className="operation-form">
            <div className="operation-preview">
              R{target! + 1}{' '}
              <span>←</span>{' '}
              R{target! + 1} + cR{source + 1}
            </div>

            <label className="dialog-field">
              <span>Coefficient c</span>
              <input
                ref={coefficientRef}
                type="text"
                value={coefficient}
                onChange={(event) => {
                  setCoefficient(event.target.value)
                }}
                onFocus={selectInputOnFocus}
                onBlur={() => {
                  if (coefficient === '') {
                    setCoefficient('1')
                  }
                }}
                onKeyDown={handleCoefficientKeyDown}
                placeholder="1/3, -2, 5..."
              />
            </label>
          </div>
        )}

        {operationType ===
          'row-linear-combination' && (
            <div className="operation-form">
              <div className="operation-preview">
                R{target! + 1}{' '}
                <span>←</span>{' '}
                aR{target! + 1} + bR{source + 1}
              </div>

              <div className="coefficient-grid">
                <label className="dialog-field">
                  <span>Target coefficient a</span>
                  <input
                    ref={targetCoefficientRef}
                    type="text"
                    value={targetCoefficient}
                    onChange={(event) => {
                      setTargetCoefficient(
                        event.target.value,
                      )
                    }}
                    onFocus={selectInputOnFocus}
                    onBlur={() => {
                      if (targetCoefficient === '') {
                        setTargetCoefficient('1')
                      }
                    }}
                    onKeyDown={
                      handleTargetCoefficientKeyDown
                    }
                  />
                </label>

                <label className="dialog-field">
                  <span>Source coefficient b</span>
                  <input
                    ref={sourceCoefficientRef}
                    type="text"
                    value={sourceCoefficient}
                    onChange={(event) => {
                      setSourceCoefficient(
                        event.target.value,
                      )
                    }}
                    onFocus={selectInputOnFocus}
                    onBlur={() => {
                      if (sourceCoefficient === '') {
                        setSourceCoefficient('1')
                      }
                    }}
                    onKeyDown={
                      handleSourceCoefficientKeyDown
                    }
                  />
                </label>
              </div>
            </div>
          )}

        {operationType === 'row-swap' && (
          <div className="operation-form">
            <div className="operation-preview">
              R{source + 1}{' '}
              <span>↔</span>{' '}
              R{target! + 1}
            </div>
          </div>
        )}

        <div className="dialog-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={apply}
          >
            Apply operation
          </button>
        </div>
      </div>
    </div>
  )
}

export default OperationDialog
