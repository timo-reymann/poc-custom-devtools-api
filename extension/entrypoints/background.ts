import type { RelayMessage } from '@/utils/protocol';

/**
 * Routes messages between the page (via the content script) and the DevTools panel.
 * WXT builds this as a service worker for Chrome and as a background script for Firefox.
 */
export default defineBackground(() => {
  const connections: Record<number, Browser.runtime.Port> = {};

  /*
   * agent api -> content script -> background script -> dev tools
   */
  browser.runtime.onMessage.addListener((request: RelayMessage, sender) => {
    if (sender.tab) {
      const tabId = sender.tab.id;
      if (tabId !== undefined && tabId in connections) {
        connections[tabId].postMessage(request);
      } else {
        console.debug('[background-script] Tab not found in connection list.');
      }
    } else {
      console.warn('[background-script] Failed to send message: sender.tab not defined.');
    }
  });

  /*
   * agent api <- content script <- background script <- dev tools
   */
  browser.runtime.onConnect.addListener((port) => {
    // Listen to messages sent from the DevTools page
    port.onMessage.addListener((request: RelayMessage) => {
      console.debug('[background-script] Forwarding message from dev tools to page', request);

      // Register initial connection
      if (request.name === 'init') {
        if (request.tabId !== undefined) {
          connections[request.tabId] = port;
        }

        port.onDisconnect.addListener(() => {
          for (const [connectedTabId, connectedPort] of Object.entries(connections)) {
            if (connectedPort === port) {
              delete connections[Number(connectedTabId)];
              break;
            }
          }
        });

        return;
      }

      // Otherwise, broadcast to agent
      if (request.tabId !== undefined) {
        browser.tabs.sendMessage(request.tabId, {
          name: request.name,
          data: request.data,
        });
      }
    });
  });

  /*
   * Propagate reloads to be able to simulate a open to page making sure the event is always fired
   */
  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (tabId in connections && changeInfo.status === 'complete') {
      connections[tabId].postMessage({
        name: 'reloaded',
      });
    }
  });
});
