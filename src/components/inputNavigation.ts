import type {
  FocusEvent,
  KeyboardEvent,
} from 'react'

export function selectInputOnFocus(
  event: FocusEvent<HTMLInputElement>,
) {
  event.target.select()
}

export function isAtInputStart(
  event: KeyboardEvent<HTMLInputElement>,
): boolean {
  return (
    event.currentTarget.selectionStart === 0 &&
    event.currentTarget.selectionEnd === 0
  )
}

export function isAtInputEnd(
  event: KeyboardEvent<HTMLInputElement>,
): boolean {
  const input = event.currentTarget

  return (
    input.selectionStart === input.value.length &&
    input.selectionEnd === input.value.length
  )
}
