import { uuidv4 } from '../utils'

export interface InputDescriptor {
  id: string
  type: 'input'
  inputType?: string
  label: string
  cols?: number
  onAction?: (event: { value: string }) => void
}

export const createInput = (inputDescriptor: {
  label: string
  type?: string
  cols?: number
  onAction?: (event: { value: string }) => void
}): InputDescriptor => {
  const { label, onAction, type, cols } = inputDescriptor
  return {
    id: uuidv4(),
    type: 'input',
    inputType: type,
    label,
    cols,
    onAction,
  }
}
