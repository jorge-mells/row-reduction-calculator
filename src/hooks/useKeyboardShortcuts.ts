import { useEffect } from 'react'

interface KeyboardShortcutActions {
  undo: () => void
  redo: () => void
}

export function useKeyboardShortcuts({
  undo,
  redo,
}: KeyboardShortcutActions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!event.ctrlKey) {
        return
      }

      const key = event.key.toLowerCase()

      if (key === 'z') {
        event.preventDefault()

        if (event.shiftKey) {
          redo()
        } else {
          undo()
        }

        return
      }

      if (key === 'y') {
        event.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [undo, redo])
}
