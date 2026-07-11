import { sendMessage } from 'webext-bridge/background';
import { TO_DEVTOOLS, type RelayMessage } from '@/utils/protocol';

// See protocol.ts: webext-bridge ships no `types` export condition, so the payload
// is cast to its expected type at the boundary.
type BridgePayload = Parameters<typeof sendMessage>[1];
const asPayload = (message: RelayMessage) => message as unknown as BridgePayload;

/**
 * With webext-bridge the content-script <-> devtools routing is automatic (this module's
 * import wires up the background hub), so the background no longer hand-rolls a relay.
 * The only thing left is our app-specific concern: telling the panel when the inspected
 * tab finishes (re)loading.
 */
export default defineBackground(() => {
  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'complete') {
      // From the background, webext-bridge requires the explicit `@tabId` destination.
      sendMessage(TO_DEVTOOLS, asPayload({ name: 'reloaded' }), `devtools@${tabId}`).catch(() => {
        // No devtools panel open for this tab — nothing to notify.
      });
    }
  });
});
