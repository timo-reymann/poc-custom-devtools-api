export const AGENT_SOURCE = 'devtoolster-agent'

export const DEVTOOLS_SOURCE = 'devtoolster-devtools'

export interface WindowMessage {
  source: typeof AGENT_SOURCE | typeof DEVTOOLS_SOURCE
  name: string
  data?: Record<string, unknown>
}
