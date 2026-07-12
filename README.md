Devtoolster
===

> :construction: This project is under active development. Expect rough edges, missing features, and breaking changes.

Devtoolster is a browser extension that lets web applications register custom panels directly inside the browser's built-in DevTools — no overlays, no query-parameter hacks, just a clean panel alongside the native tools.

## Background

In larger or enterprise web applications, development and QA often requires adjusting values or mocking state to demonstrate behaviour to stakeholders. Framework-provided tools are sometimes enough, but frequently cumbersome. Many teams end up writing their own dev tools — page overlays, query-parameter toggles, step-by-step guides bolted onto existing panels.

## Motivation

All of those approaches require effort that isn't always justified. Devtoolster aims to provide a slim, consistent API that lets any web application register custom controls inside the browser's native DevTools with minimal setup.

## Implementation

![](./docs/implementation.png)

The extension is built with [WXT](https://wxt.dev) (Vite-based) in TypeScript, with a Svelte-based DevTools panel. WXT generates the Chrome (`service_worker`) and Firefox (`background.scripts`) Manifest V3 files from a single config — no manual per-browser manifest swap. The page-facing API lives in `@devtoolster/web-api`, a TypeScript package built with Vite (library mode) and published through the same npm workspace.

### Application side

- Typed TypeScript API (`@devtoolster/web-api`) wrapping `window.postMessage`
- Talks to the content script via window messaging

### Extension

- **Content script** — injected into the page, bridges `window` messaging to the extension runtime
- **Background worker** — routes messages between the content script and the DevTools panel
- **DevTools panel** — registers the _Devtoolster_ tab, listens for `devtools:open`, and renders controls registered by the application

## Screenshots

### Chrome

| Dark | Light |
|------|-------|
| ![](./docs/chrome_dark.png) | ![](./docs/chrome_light.png) |

### Firefox

| Dark | Light |
|------|-------|
| ![](./docs/firefox_dark.png) | ![](./docs/firefox_light.png) |

## Known limitations

- No keyboard shortcuts or focus management
- No sorting or filtering for table data
- Stale panel content persists when navigating to a page without a matching content script (e.g. `chrome://`, `about:`, or pages that don't inject the content script)

## Planned / in progress

- ~~Stable, typed API surface for the application-facing `devtools-api.js`~~ — done in `@devtoolster/web-api`
- Proper error handling and user-facing error states
- More UI controls (toggles, sliders, color pickers, …)
- ~~npm package for `application/devtools-api.js`~~ — done as `@devtoolster/web-api`
- Automated tests (e2e and unit)
- User approval prompt — per-session consent before the panel activates

## Getting started

### Requirements

- Node.js 18+ and npm
- Chrome **or** Firefox with Manifest V3 support (Firefox 109+, Chrome 88+)

The repository is an **npm workspace** with three packages: `@devtoolster/extension` (the WXT extension), `@devtoolster/web-api` (the typed page-facing API), and `@devtoolster/demo` (the demo page). A single install from the root covers all three.

### 1. Install dependencies

```bash
npm install
```

### 2. Run the extension

**Development (recommended)** — launches a browser with the extension loaded and hot-reload enabled:

```bash
npm run dev            # Chrome
npm run dev:firefox    # Firefox
```

**Or build and load manually:**

```bash
npm run build          # -> extension/.output/chrome-mv3
npm run build:firefox  # -> extension/.output/firefox-mv3
```

- **Chrom(ium)** (Chrome, Edge, Opera, …)
  - Go to `chrome://extensions`
  - Enable developer mode
  - Click _Load unpacked_ and select `extension/.output/chrome-mv3`
- **Firefox**
  - Go to `about:debugging` → _This Firefox_
  - Click _Load Temporary Add-on_ and select `extension/.output/firefox-mv3/manifest.json`

### 3. Open the demo

```bash
npm run demo     # serves http://localhost:8080
```

- Open http://localhost:8080 in your browser
- Open DevTools and go to the _Devtoolster_ tab
- You should see a tabbed panel with two tabs: **Table** and **Controls**

## Smoke test checklist

After loading the extension and opening the demo page + DevTools panel:

- [ ] Tab bar shows two tabs: **Table** and **Controls**
- [ ] Clicking each tab switches the visible content
- [ ] The active tab has a highlighted bottom border
- [ ] **Controls** tab: Headings "Communication" and "Manipulate page" are visible
- [ ] **Controls** tab: "Hi from your todays host" button triggers an alert dialog
- [ ] **Controls** tab: "Log it baby one more time" logs to the page's console
- [ ] **Controls** tab: Dropdown "Select something" sends a selection event
- [ ] **Controls** tab: "Set random background" changes the page background color
- [ ] **Controls** tab: "Your name here" input submits the typed value
- [ ] **Controls** tab: Color picker "Overwrite background color" works
- [ ] **Table** tab: Table with columns Name/Age/City and 3 rows is visible
- [ ] **Controls** tab: "Cycle table data" button — switch to **Table** tab to see data change
- [ ] **Controls** tab: Unsupported element `{type: "test"}` logs an error (expected)
- [ ] Reloading the page (F5) resets and re-registers all controls under both tabs
- [ ] No "message port closed before a response was received" warnings in the background service-worker console (Chrome: inspect service worker from `chrome://extensions`)
