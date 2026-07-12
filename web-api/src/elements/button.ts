import { uuidv4 } from '../utils'

export interface ButtonDescriptor {
  id: string
  type: 'button'
  label: string
  cols?: number
  onAction?: () => void
}

export const createButton = (label: string, onAction?: () => void, cols?: number): ButtonDescriptor => ({
  id: uuidv4(),
  type: 'button',
  label,
  cols,
  onAction,
})
