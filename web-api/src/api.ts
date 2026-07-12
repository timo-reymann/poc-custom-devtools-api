import { AGENT_SOURCE, DEVTOOLS_SOURCE, type WindowMessage } from './protocol'
import type { DevToolsConfig } from './types'

export const sendEvent = (name: string, data?: Record<string, unknown>) => {
  window.postMessage(
    {
      source: AGENT_SOURCE,
      name,
      data: data || {},
    },
    '*',
  )
}

interface ListenerFn {
  (payload: unknown): void
}

const listeners: Record<string, ListenerFn> = {}

const registerElement = (descriptor: Record<string, unknown>) => {
  const onAction = descriptor.onAction as ListenerFn | undefined
  if (onAction) {
    listeners[`event:${descriptor.id as string}:action`] = onAction
    delete descriptor.onAction
  }
  sendEvent('registerElement', descriptor)
}

const findListener = (eventName: string): ListenerFn | null => {
  if (Object.keys(listeners).includes(eventName)) {
    return listeners[eventName]
  }
  return null
}

export const registerCustomDevTools = (devTools: DevToolsConfig) => {
  const tabs = devTools.tabs || []
  const tabMeta = tabs.map((tab, i) => ({
    id: `tab-${i}`,
    label: tab.label,
  }))

  window.addEventListener('message', (e: MessageEvent) => {
    if (e.source !== window || !e.data || (e.data as WindowMessage).source !== DEVTOOLS_SOURCE) {
      return
    }

    const event = e.data as WindowMessage
    switch (event.name) {
      case 'devtools:open':
        sendEvent('devtools:agent:ready')
        sendEvent('registerTabs', { tabs: tabMeta })
        tabs.forEach((tab, i) => {
          const tabId = tabMeta[i].id
          ;(tab.elements || []).forEach((descriptor) => {
            registerElement({ ...descriptor, tabId } as Record<string, unknown>)
          })
        })
        break

      case 'devtools:error':
        console.error('Got error from custom devtools', event)
        break

      default: {
        const listener = findListener(event.name)
        if (listener == null) {
          console.warn('Unknown event', event)
        } else {
          listener(event.data)
        }
        break
      }
    }
  })
}
