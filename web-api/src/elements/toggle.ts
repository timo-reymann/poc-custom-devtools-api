import { uuidv4 } from '../utils'

export interface ToggleDescriptor {
  id: string
  type: 'toggle'
  label: string
  cols?: number
  checked?: boolean
  onAction?: (event: { value: boolean }) => void
}

export const createToggle = (options: {
  label: string
  cols?: number
  checked?: boolean
  onAction?: (event: { value: boolean }) => void
}): ToggleDescriptor => {
  const { label, onAction, cols, checked } = options
  return {
    id: uuidv4(),
    type: 'toggle',
    label,
    cols,
    checked,
    onAction,
  }
}
