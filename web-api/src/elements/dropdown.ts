import { uuidv4 } from '../utils'

export interface DropdownDescriptor {
  id: string
  type: 'dropdown'
  label: string
  options: string[]
  cols?: number
  onAction?: (event: { value: string }) => void
}

export const createDropdown = (inputDescriptor: {
  label: string
  options: string[]
  cols?: number
  onAction?: (event: { value: string }) => void
}): DropdownDescriptor => {
  const { label, onAction, options, cols } = inputDescriptor
  return {
    id: uuidv4(),
    type: 'dropdown',
    label,
    onAction,
    options,
    cols,
  }
}
