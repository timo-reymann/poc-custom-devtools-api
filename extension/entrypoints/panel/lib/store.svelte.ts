import type { ElementDescriptor, TabMeta, UpdateTablePayload } from '@/utils/protocol';

const KNOWN_TYPES = new Set(['button', 'heading', 'input', 'dropdown', 'table']);

export type RegisterResult = 'ok' | 'no-tab' | 'unknown-type';

/**
 * Reactive panel state. Replaces the imperative DOM builder in the old panel-ui.js:
 * elements live in per-tab buckets and the Svelte components render from them, so
 * `updateTable` becomes a plain reactive mutation instead of a `getElementById` patch.
 */
class PanelStore {
  tabs = $state<TabMeta[]>([]);
  elementsByTab = $state<Record<string, ElementDescriptor[]>>({});
  activeTabId = $state<string | null>(null);
  contentScriptReady = $state(false);

  reset(): void {
    this.tabs = [];
    this.elementsByTab = {};
    this.activeTabId = null;
  }

  registerTabs(tabs: TabMeta[]): void {
    this.reset();
    this.tabs = tabs;
    const buckets: Record<string, ElementDescriptor[]> = {};
    for (const tab of tabs) buckets[tab.id] = [];
    this.elementsByTab = buckets;
    if (tabs.length > 0) this.activeTabId = tabs[0].id;
  }

  registerElement(descriptor: ElementDescriptor): RegisterResult {
    // Fall back to the first tab, mirroring the old getTabContainer() behaviour.
    const tabId = descriptor.tabId && descriptor.tabId in this.elementsByTab
      ? descriptor.tabId
      : this.tabs[0]?.id;

    if (!tabId || !(tabId in this.elementsByTab)) return 'no-tab';
    if (!KNOWN_TYPES.has(descriptor.type)) return 'unknown-type';

    this.elementsByTab[tabId] = [...this.elementsByTab[tabId], descriptor];
    return 'ok';
  }

  /** Updates an existing table's rows in place. Returns false if no such table exists. */
  updateTable({ id, rows }: UpdateTablePayload): boolean {
    for (const bucket of Object.values(this.elementsByTab)) {
      const element = bucket.find((el) => el.id === id);
      if (element && element.type === 'table') {
        element.rows = rows;
        return true;
      }
    }
    return false;
  }

  setActiveTab(id: string): void {
    this.activeTabId = id;
  }
}

export const store = new PanelStore();
