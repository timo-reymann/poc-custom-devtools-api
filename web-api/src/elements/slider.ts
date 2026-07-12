import { uuidv4 } from '../utils'

export interface SliderDescriptor {
  id: string
  type: 'slider'
  label: string
  min: number
  max: number
  step: number
  value: number
  cols?: number
  onAction?: (event: { value: number }) => void
}

export const createSlider = (options: {
  label: string
  min?: number
  max?: number
  step?: number
  value?: number
  cols?: number
  onAction?: (event: { value: number }) => void
}): SliderDescriptor => {
  const { label, onAction, cols } = options
  return {
    id: uuidv4(),
    type: 'slider',
    label,
    min: options.min ?? 0,
    max: options.max ?? 100,
    step: options.step ?? 1,
    value: options.value ?? options.min ?? 0,
    cols,
    onAction,
  }
}
