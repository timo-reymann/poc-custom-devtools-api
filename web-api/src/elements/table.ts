import { sendEvent } from '../api'
import { uuidv4 } from '../utils'

export interface TableDescriptor {
  id: string
  type: 'table'
  label: string
  columns: string[]
  rows: string[][]
}

export const createTable = (tableDescriptor: {
  label: string
  columns: string[]
  rows: string[][]
}): TableDescriptor => {
  const { label, columns, rows } = tableDescriptor
  return {
    id: uuidv4(),
    type: 'table',
    label,
    columns,
    rows,
  }
}

export const updateTable = (id: string, rows: string[][]) => {
  sendEvent('updateTable', { id, rows })
}
