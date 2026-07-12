import { uuidv4 } from '../utils'

export interface HeadingDescriptor {
  id: string
  type: 'heading'
  label: string
}

export const createHeading = (label: string): HeadingDescriptor => ({
  id: uuidv4(),
  type: 'heading',
  label,
})
