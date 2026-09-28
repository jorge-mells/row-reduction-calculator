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

interface OperationDialogProps {
  source: number
  target?: number
  dispatch: Dispatch<AppAction>
  onApply: (affectedRow: number) => void
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

  const coefficientRef =
    useRef<HTMLInputElement>(null)

  const targetCoefficientRef =
    useRef<HTMLInputElement>(null)

  const sourceCoefficientRef =
    useRef<HTMLInputElement>(null)

  const addRadioRef =
    useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (singleRow) {
      coefficientRef.current?.focus()
      return
    }

    addRadioRef.current?.focus()
  }, [singleRow])

  function apply() {
    if (singleRow) {
      try {
        const value = new Fraction(coefficient)

        dispatch({
          type: 'APPLY_OPERATION',
          operation: {
            type: 'row-scale',
            row: source,
            coefficient: value,
          },
        })

        onApply(source)
        onClose()
      } catch {
        return
      }

      return
    }

    if (operationType === 'row-swap') {
      dispatch({
        type: 'APPLY_OPERATION',
        operation: {
          type: 'row-swap',
          first: source,
          second: target,
        },
      })

      onApply(target)
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

        dispatch({
          type: 'APPLY_OPERATION',
          operation: {
            type: 'row-linear-combination',
            source,
            target,
            sourceCoefficient: sourceValue,
            targetCoefficient: targetValue,
          },
        })

        onApply(target)
        onClose()
      } catch {
        return
      }

      return
    }

    try {
      const value = new Fraction(coefficient)

      dispatch({
        type: 'APPLY_OPERATION',
        operation: {
          type: 'row-add',
          source,
          target,
          coefficient: value,
        },
      })

      onApply(target)
      onClose()
    } catch {
      return
    }
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
      <div>
        <h2>Scale R{source + 1}</h2>

        <h3>
          R{source + 1} ← cR{source + 1}
        </h3>

        <input
          ref={coefficientRef}
          type="text"
          value={coefficient}
          onChange={(event) => {
            setCoefficient(event.target.value)
          }}
          onBlur={() => {
            if (coefficient === '') {
              setCoefficient('1')
            }
          }}
          onKeyDown={handleCoefficientKeyDown}
          placeholder="Coefficient"
        />

        <button
          type="button"
          onClick={apply}
        >
          Apply
        </button>

        <button
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2>
        R{source + 1} → R{target! + 1}
      </h2>

      <label>
        <input
          ref={addRadioRef}
          type="radio"
          name="operation"
          value="row-add"
          checked={operationType === 'row-add'}
          onChange={() => {
            setOperationType('row-add')
          }}
        />
        Add multiple
      </label>

      <label>
        <input
          type="radio"
          name="operation"
          value="row-swap"
          checked={operationType === 'row-swap'}
          onChange={() => {
            setOperationType('row-swap')
          }}
        />
        Swap
      </label>

      <label>
        <input
          type="radio"
          name="operation"
          value="row-linear-combination"
          checked={
            operationType === 'row-linear-combination'
          }
          onChange={() => {
            setOperationType('row-linear-combination')
          }}
        />
        Advanced
      </label>

      {operationType === 'row-add' && (
        <>
          <h3>
            R{target! + 1} ← R{target! + 1} + cR{source + 1}
          </h3>

          <input
            ref={coefficientRef}
            type="text"
            value={coefficient}
            onChange={(event) => {
              setCoefficient(event.target.value)
            }}
            onBlur={() => {
              if (coefficient === '') {
                setCoefficient('1')
              }
            }}
            onKeyDown={handleCoefficientKeyDown}
            placeholder="Coefficient"
          />
        </>
      )}

      {operationType === 'row-linear-combination' && (
        <>
          <h3>
            R{target! + 1} ← aR{target! + 1} + bR{source + 1}
          </h3>

          <label>
            a:
            <input
              ref={targetCoefficientRef}
              type="text"
              value={targetCoefficient}
              onChange={(event) => {
                setTargetCoefficient(event.target.value)
              }}
              onBlur={() => {
                if (targetCoefficient === '') {
                  setTargetCoefficient('1')
                }
              }}
              onKeyDown={handleTargetCoefficientKeyDown}
            />
          </label>

          <label>
            b:
            <input
              ref={sourceCoefficientRef}
              type="text"
              value={sourceCoefficient}
              onChange={(event) => {
                setSourceCoefficient(event.target.value)
              }}
              onBlur={() => {
                if (sourceCoefficient === '') {
                  setSourceCoefficient('1')
                }
              }}
              onKeyDown={handleSourceCoefficientKeyDown}
              placeholder="Coefficient"
            />
          </label>
        </>
      )}

      {operationType === 'row-swap' && (
        <h3>
          R{source + 1} ↔ R{target! + 1}
        </h3>
      )}

      <button
        type="button"
        onClick={apply}
      >
        Apply
      </button>

      <button
        type="button"
        onClick={onClose}
      >
        Cancel
      </button>
    </div>
  )
}

export default OperationDialog
