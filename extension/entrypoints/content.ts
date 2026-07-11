import { AGENT_SOURCE, DEVTOOLS_SOURCE, type RelayMessage, type WindowMessage } from '@/utils/protocol';

/**
 * Bridges the page's `window.postMessage` API and the extension runtime.
 * Runs in the default ISOLATED world; `window.postMessage` still crosses to the page
 * because both share the same DOM window.
 */
export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  main() {
    /*
     * agent -> content script -> background script -> dev tools
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

      console.debug('[Custom DevTools] Forwarding message from agent to dev tools', event.data);
      browser.runtime.sendMessage(message);
    });

    /*
     * agent <- content script <- background script <- dev tools
     */
    browser.runtime.onMessage.addListener((request: RelayMessage) => {
      console.debug('[Custom DevTools] Got message from dev tools', request);
      window.postMessage({ ...request, source: DEVTOOLS_SOURCE }, '*');
    });

    // Signal that content script is fully initialized and ready to route messages
    browser.runtime.sendMessage({ name: 'content-script:ready' });
  },
});
