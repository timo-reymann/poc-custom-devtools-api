import type { ElementDescriptor, RelayMessage, TabMeta, UpdateTablePayload } from '@/utils/protocol';
import { store } from './store.svelte';

// Runtime connection used to exchange events with the inspected page via the background relay.
const port = browser.runtime.connect({ name: 'panel' });

/** Send an event towards the application (panel -> background -> content script -> page). */
export function sendMessage(name: string, data?: unknown): void {
  port.postMessage({
    name,
    tabId: browser.devtools.inspectedWindow.tabId,
    data,
  });
}

/** Ask the application to (re-)register its dev tools for the inspected window. */
export const sendOpen = (): void => sendMessage('devtools:open');

/** Report an error from the dev tools back to the application. */
export const sendError = (message: string): void => sendMessage('devtools:error', message);

function handleEvent(event: RelayMessage): void {
  switch (event.name) {
    case 'registerElement': {
      const descriptor = event.data as ElementDescriptor;
      if (store.registerElement(descriptor) === 'unknown-type') {
        sendError(`Unsupported element type ${descriptor.type}`);
      }
      break;
    }

    case 'devtools:agent:ready':
      store.reset();
      break;

    case 'reloaded':
      if (!store.contentScriptReady) {
        store.reset();
      }
      break;

    case 'content-script:ready':
      store.contentScriptReady = true;
      store.reset();
      sendOpen();
      break;

    case 'registerTabs':
      store.registerTabs((event.data as { tabs: TabMeta[] }).tabs);
      break;

    case 'updateTable': {
      const payload = event.data as UpdateTablePayload;
      if (!store.updateTable(payload)) {
        sendError(`Table with id "${payload.id}" not found`);
      }
      break;
    }

    default:
      sendError(`Unsupported event name ${event.name}`);
      break;
  }
}

/** Wire up the port listener and trigger the initial registration handshake. */
export function initMessaging(): void {
  port.onMessage.addListener((message) => handleEvent(message as RelayMessage));

  // init messaging connection, then trigger initial registration.
  sendMessage('init');
  sendOpen();
}
