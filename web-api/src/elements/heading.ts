import { uuidv4 } from '../utils'

export interface HeadingDescriptor {
  id: string
  type: 'heading'
  label: string
  cols?: number
}

export const createHeading = (label: string, cols?: number): HeadingDescriptor => ({
  id: uuidv4(),
  type: 'heading',
  label,
  cols,
})
