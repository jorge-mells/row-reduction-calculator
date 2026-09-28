import type { Dispatch } from 'react'
import type { Fraction } from 'fraction.js'
import type { RowOperation } from '../engine/operations'
import type { AppAction } from '../state/reducer'
import type { HistoryEntry } from '../state/appState'

interface HistoryPanelProps {
  history: HistoryEntry[]
  historyIndex: number
  dispatch: Dispatch<AppAction>
}

function formatFraction(value: Fraction): string {
  return value.toString()
}

function formatOperation(operation: RowOperation): string {
  switch (operation.type) {
    case 'row-add':
      return `R${operation.target + 1} ← R${operation.target + 1} + ${formatFraction(operation.coefficient)}R${operation.source + 1}`

    case 'row-swap':
      return `R${operation.first + 1} ↔ R${operation.second + 1}`

    case 'row-scale':
      return `R${operation.row + 1} ← ${formatFraction(operation.coefficient)}R${operation.row + 1}`

    case 'row-linear-combination':
      return `R${operation.target + 1} ← ${formatFraction(operation.targetCoefficient)}R${operation.target + 1} + ${formatFraction(operation.sourceCoefficient)}R${operation.source + 1}`
  }
}

function HistoryPanel({
  history,
  historyIndex,
  dispatch,
}: HistoryPanelProps) {
  return (
    <section>
      <h2>History</h2>

      <ol>
        {history.map((entry, index) => {
          const isActive = index === historyIndex

          let label: string

          switch (entry.kind) {
            case 'initial':
              label = 'Initial matrix'
              break

            case 'edit':
              label = 'Matrix edit'
              break

            case 'operation':
              label = formatOperation(entry.operation!)
              break
          }

          return (
            <li key={index}>
              <button
                type="button"
                disabled={isActive}
                onClick={() => {
                  dispatch({
                    type: 'RESTORE_HISTORY',
                    index,
                  })
                }}
              >
                {label}
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default HistoryPanel
