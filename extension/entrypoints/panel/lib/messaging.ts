import { onMessage, sendMessage as bridgeSend } from 'webext-bridge/devtools';
import {
  TO_CONTENT_SCRIPT,
  TO_DEVTOOLS,
  type ElementDescriptor,
  type RelayMessage,
  type TabMeta,
  type UpdateTablePayload,
} from '@/utils/protocol';
import { store } from './store.svelte';

// See protocol.ts: webext-bridge ships no `types` export condition, so the payload
// is cast to its expected type at the boundary.
type BridgePayload = Parameters<typeof bridgeSend>[1];

/**
 * Send an event towards the application. webext-bridge auto-scopes the bare
 * `content-script` destination to the inspected tab (the devtools endpoint is
 * registered as `devtools@<inspectedTabId>`), and the content script then relays
 * it to the page over `window.postMessage`.
 */
export function sendMessage(name: string, data?: unknown): void {
  bridgeSend(TO_CONTENT_SCRIPT, { name, data } as unknown as BridgePayload, 'content-script').catch(() => {
    // No content script listening (e.g. inspecting chrome:// or about: pages).
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

/** Wire up the incoming listener and trigger the initial registration handshake. */
export function initMessaging(): void {
  // No `init` handshake needed — webext-bridge manages the connection itself.
  onMessage(TO_DEVTOOLS, ({ data }) => handleEvent(data as unknown as RelayMessage));
  sendOpen();
}
