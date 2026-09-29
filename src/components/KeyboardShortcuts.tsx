function KeyboardShortcuts() {
  return (
    <div className="operation-help">
      <div className="help-icon">⌨</div>

      <div className="shortcut-content">
        <strong>Keyboard shortcuts</strong>

        <div className="shortcut-list">
          <div className="shortcut-item">
            <span className="shortcut-label">Navigate</span>

            <span className="shortcut-keys">
              <kbd>↑</kbd>
              <kbd>↓</kbd>
              <kbd>←</kbd>
              <kbd>→</kbd>
            </span>
          </div>

          <div className="shortcut-item">
            <span className="shortcut-label">Next cell</span>

            <span className="shortcut-keys">
              <kbd>Enter</kbd>
            </span>
          </div>

          <div className="shortcut-item">
            <span className="shortcut-label">
              Previous cell
            </span>

            <span className="shortcut-keys">
              <kbd>Shift</kbd>
              <span>+</span>
              <kbd>Enter</kbd>
            </span>
          </div>

          <div className="shortcut-item">
            <span className="shortcut-label">Undo</span>

            <span className="shortcut-keys">
              <kbd>Ctrl</kbd>
              <span>+</span>
              <kbd>Z</kbd>
            </span>
          </div>

          <div className="shortcut-item">
            <span className="shortcut-label">Redo</span>

            <span className="shortcut-keys">
              <kbd>Ctrl</kbd>
              <span>+</span>
              <kbd>Y</kbd>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KeyboardShortcuts
