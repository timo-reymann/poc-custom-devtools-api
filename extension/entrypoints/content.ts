import { onMessage, sendMessage } from 'webext-bridge/content-script';
import {
  AGENT_SOURCE,
  DEVTOOLS_SOURCE,
  TO_CONTENT_SCRIPT,
  TO_DEVTOOLS,
  type RelayMessage,
  type WindowMessage,
} from '@/utils/protocol';

// See protocol.ts: webext-bridge ships no `types` export condition, so the payload
// is cast to its expected type at the boundary.
type BridgePayload = Parameters<typeof sendMessage>[1];
const toDevtools = (message: RelayMessage) =>
  sendMessage(TO_DEVTOOLS, message as unknown as BridgePayload, 'devtools').catch(() => {
    // No devtools panel listening for this tab.
  });

/**
 * Bridges the page's `window.postMessage` API (hop 1, unchanged) and the panel.
 * The content-script <-> devtools hop (hop 2) now goes over webext-bridge instead of
 * a hand-rolled background relay. Destinations use bare context names — webext-bridge
 * auto-scopes them to this content script's own tab.
 */
export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  main() {
    /*
     * agent (page) -> content script -> devtools
     */
    window.addEventListener('message', (event) => {
      // Only accept messages from same frame
      if (event.source !== window) {
        return;
      }

      const message = event.data as WindowMessage | null;

      // Only accept messages of correct format (our messages)
      if (typeof message !== 'object' || message === null || message.source !== AGENT_SOURCE) {
        return;
      }

      toDevtools({ name: message.name, data: message.data });
    });

    /*
     * agent (page) <- content script <- devtools
     */
    onMessage(TO_CONTENT_SCRIPT, ({ data }) => {
      const message = data as unknown as RelayMessage;
      window.postMessage({ name: message.name, data: message.data, source: DEVTOOLS_SOURCE }, '*');
    });

    // Signal readiness to the panel (delivered only if a panel is already open for this tab).
    toDevtools({ name: 'content-script:ready' });
  },
});
