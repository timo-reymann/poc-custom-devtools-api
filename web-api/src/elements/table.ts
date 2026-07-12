import { sendEvent } from '../api'
import { uuidv4 } from '../utils'

export interface TableDescriptor {
  id: string
  type: 'table'
  label: string
  columns: string[]
  rows: string[][]
  cols?: number
}

export const createTable = (tableDescriptor: {
  label: string
  columns: string[]
  rows: string[][]
  cols?: number
}): TableDescriptor => {
  const { label, columns, rows, cols } = tableDescriptor
  return {
    id: uuidv4(),
    type: 'table',
    label,
    columns,
    rows,
    cols,
  }
}

export const updateTable = (id: string, rows: string[][]) => {
  sendEvent('updateTable', { id, rows })
}
