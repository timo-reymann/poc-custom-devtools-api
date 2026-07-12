/**
 * Shared wire-protocol definitions for the devtoolster message relay.
 *
 * The application side (`application/devtools-api.js`) is intentionally NOT part of this
 * WXT project and stays vanilla JS, so these names/markers MUST stay byte-for-byte
 * compatible with it.
 */

/** `window.postMessage` source markers exchanged between the page and the content script. */
export const AGENT_SOURCE = 'devtoolster-agent' as const;
export const DEVTOOLS_SOURCE = 'devtoolster-devtools' as const;

/** A message as it travels over the runtime / port relay. */
export interface RelayMessage {
  name: string;
  /** Present on messages the panel sends; identifies the inspected tab. */
  tabId?: number;
  data?: unknown;
}

/** A message as it travels over the page <-> content-script `window` bridge. */
export interface WindowMessage extends RelayMessage {
  source: typeof AGENT_SOURCE | typeof DEVTOOLS_SOURCE;
}

/** Tab metadata registered by the application via `registerTabs`. */
export interface TabMeta {
  id: string;
  label: string;
}

/** Element descriptors the application registers into a panel tab. */
export interface BaseDescriptor {
  id: string;
  label: string;
  /** Assigned by the application when tagging an element to its tab. */
  tabId?: string;
  /** Number of columns this element spans in the 12-column grid (1–12, defaults to 12). */
  cols?: number;
}

export interface ButtonDescriptor extends BaseDescriptor {
  type: 'button';
}

export interface HeadingDescriptor extends BaseDescriptor {
  type: 'heading';
}

export interface InputDescriptor extends BaseDescriptor {
  type: 'input';
  inputType?: string;
}

export interface DropdownDescriptor extends BaseDescriptor {
  type: 'dropdown';
  options: string[];
}

export interface TableDescriptor extends BaseDescriptor {
  type: 'table';
  columns: string[];
  rows: string[][];
}

export interface ToggleDescriptor extends BaseDescriptor {
  type: 'toggle';
  checked?: boolean;
}

export interface SliderDescriptor extends BaseDescriptor {
  type: 'slider';
  min: number;
  max: number;
  step: number;
  value: number;
}

export type ElementDescriptor =
  | ButtonDescriptor
  | HeadingDescriptor
  | InputDescriptor
  | DropdownDescriptor
  | TableDescriptor
  | ToggleDescriptor
  | SliderDescriptor;

/** Payload of the `updateTable` event. */
export interface UpdateTablePayload {
  id: string;
  rows: string[][];
}

/**
 * webext-bridge message IDs for the internal content-script <-> devtools relay.
 * Both carry the RelayMessage envelope, so the dynamic event names it wraps
 * (e.g. `event:<id>:action`) survive unchanged.
 *
 * NOTE: ideally these would be typed via webext-bridge's `ProtocolMap`
 * augmentation, but webext-bridge v6's package.json declares no `types` export
 * condition, so under WXT's `moduleResolution: "Bundler"` the augmentation target
 * cannot be resolved. Callers therefore cast the RelayMessage payload at the
 * boundary instead.
 */
export const TO_DEVTOOLS = 'to-devtools';
export const TO_CONTENT_SCRIPT = 'to-content-script';
