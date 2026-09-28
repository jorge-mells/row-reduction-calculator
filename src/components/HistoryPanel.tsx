import type { Dispatch } from 'react'
import type { AppAction } from '../state/reducer'
import type { HistoryEntry } from '../state/appState'
import { formatOperation } from '../engine/formatting'

interface HistoryPanelProps {
  history: HistoryEntry[]
  historyIndex: number
  dispatch: Dispatch<AppAction>
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
          const isFuture = index > historyIndex

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
            <li
              className={[
                'history-entry',
                isActive ? 'active' : '',
                isFuture ? 'future' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={index}
            >
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

              {isActive && (
                <span className="history-current">
                  Current
                </span>
              )}

              <div className="history-matrix">
                {entry.matrix.map((row, rowIndex) => (
                  <div
                    className="history-matrix-row"
                    key={rowIndex}
                  >
                    {row.map((value, columnIndex) => (
                      <span
                        className="history-matrix-cell"
                        key={columnIndex}
                      >
                        {value.toString()}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default HistoryPanel
