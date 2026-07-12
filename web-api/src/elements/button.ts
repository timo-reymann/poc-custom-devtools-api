import { uuidv4 } from '../utils'

export interface ButtonDescriptor {
  id: string
  type: 'button'
  label: string
  onAction?: () => void
}

export const createButton = (label: string, onAction?: () => void): ButtonDescriptor => ({
  id: uuidv4(),
  type: 'button',
  label,
  onAction,
})
