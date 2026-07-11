Proof of Concept - Generic dev tools
===

> :warning: DISCLAIMER: This is a very minimal proof of concept, with **no error handling or tests** at all.
> 
> It is a pure evaluation for now. Feel free to reuse this work for other projects.

This repository contains a proof of concept for registering devtools directly from the running application in the
browser.

## Background

Especially in larger applications or enterprise web applications tests and development requires adjusting values or
mocking states to show it to stakeholders.

In some cases the framework tools provided are enough, but a bit cumbersome to use. Some developers start to write their
own dev tools. Most of the time containing some kind of page overlay, setting query parameters to toggle specific
behaviour. Sometimes even providing step-by-step documentation using the framework provided dev tools.

## Motivation

As mentioned in background there are many way to handle this: but all require some effort that is not always
reasonable. The goal is to provide a really slim API exposing a way to register custom features inside the browser
builtin dev tools.

## Implementation

![](./docs/implementation.png)

The extension is built with [WXT](https://wxt.dev) (Vite-based) in TypeScript, with a
Svelte-based DevTools panel. WXT generates the Chrome (`service_worker`) and Firefox
(`background.scripts`) Manifest V3 files from a single config, so there is no manual
per-browser manifest swap. The `application/` demo and its `devtools-api.js` wrapper
remain framework-free vanilla JavaScript.

### Application

- Contains small JavaScript API wrapper around window messaging
- Talks with content script via window messaging

### Extension

- Content script
    - Injected into application page setting up a connection between the page and the extension itself
    - Running in same context as application
- Background worker is required to make communication between content script and dev tools work
    - Takes care of routing messages to chrome runtime or window depending on direction
- Dev-Tools
    - When opened send an event to content script telling they have been opened
    - Communicate only via events with the application (technical limitation)
    - Renders devtools based on elements getting registered by application

## Screenshots

### Chrome

| Dark | Light |
|------|-------|
| ![](./docs/chrome_dark.png) | ![](./docs/chrome_light.png) |

### Firefox

| Dark | Light |
|------|-------|
| ![](./docs/firefox_dark.png) | ![](./docs/firefox_light.png) |

## Current limitations

- No keyboard shortcuts or focus management
- No sorting or filtering for table data
- Stale devtools content persists when navigating the inspected window to a page without a matching content script (e.g. <code>chrome://</code>, <code>about:</code>, or pages that do not inject the content script)

## What is missing for real world usage

- Stable, typed API surface for the application-facing `devtools-api.js` (the extension itself is now TypeScript, but the app wrapper is still untyped vanilla JS)
- Proper error handling and user-facing error states
- More UI elements (toggles, sliders, color pickers, etc.)
- Instructions on including devtools only in dev/staging builds
- npm package for the <code>application/devtools-api.js</code> library
- Automated tests (e2e and unit)
- User approval prompt before rendering — ideally per-session consent so the devtools panel only activates when the user explicitly allows it for the current session

## Try out

### Requirements
- Node.js 18+ and npm
- Chrome **or** Firefox with Manifest V3 support (Firefox 109+, Chrome 88+)

WXT builds the correct Manifest V3 file for each browser automatically — no manual manifest selection.

The repository is an **npm workspace** with two packages: `extension` (the WXT extension)
and `application` (the demo page). A single install from the root covers both, and the root
`package.json` exposes convenience scripts that delegate to the right workspace.

## Instructions

### 1. Install dependencies

```bash
npm install            # from the repo root — installs both workspaces
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

> All commands above can be run from the repo root (they delegate to the `extension` workspace)
> or from inside `extension/` directly.

- **Chrom(ium)** - including Chrome, new Edge, Opera etc.
  - Go to _Extensions_ (`chrome://extensions`)
  - Toggle developer mode
  - Click _Load unpacked_ and select `extension/.output/chrome-mv3`
- **Firefox**
  - Go to `about:debugging` → _This Firefox_
  - Click _Load Temporary Add-on_ and select `extension/.output/firefox-mv3/manifest.json`

### 3. Open the demo

- Serve the demo with the bundled local web server (from the repo root):

  ```bash
  npm run demo     # serves http://localhost:8080
  ```

- Open http://localhost:8080 in your browser
- Open DevTools and go to tab _Custom Dev Tools_
- You should see a tabbed panel with two tabs: **Table** (shows the demo table) and **Controls** (buttons, inputs, dropdown, headings)
- Click between the tabs to switch views

## Smoke test checklist

After loading the extension and opening the demo page + DevTools panel:

- [ ] Tab bar shows two tabs: **Table** and **Controls**
- [ ] Clicking each tab switches the visible content
- [ ] The active tab has a highlighted bottom border
- [ ] **Controls** tab: Heading "Communication" and "Manipulate page" are visible
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
