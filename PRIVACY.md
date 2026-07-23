Privacy Policy
===

_Last updated: 2026-07-23_

Devtoolster is a browser extension that lets web applications register custom panels inside the browser's built-in DevTools. It is designed to work entirely locally.

## Summary

**Devtoolster does not collect, store, or transmit any data. Nothing ever leaves your browser.**

## Data collection

Devtoolster does not:

- Collect any personal information
- Collect analytics, telemetry, or usage statistics
- Send any data to external servers — the extension makes no network requests at all
- Store any data persistently (no cookies, no local storage, no extension storage)
- Track your browsing activity

## How the extension works

All communication happens locally inside your browser:

1. A web application registers controls via the `@devtoolster/web-api` package using `window.postMessage`.
2. The extension's content script bridges these messages to the extension runtime.
3. The background worker routes messages between the content script and the DevTools panel.

This message passing occurs exclusively within your browser. No data is transmitted to the extension authors or any third party.

## Permissions

The extension requests the following permissions, used solely to provide its core functionality:

- **`scripting` / `activeTab`** — to inject the content script that bridges the page and the DevTools panel
- **Host permissions (`http://*/*`, `https://*/*`)** — so the content script can run on pages that use the Devtoolster API

None of these permissions are used to read, collect, or transmit your data.

## Third-party services

Devtoolster does not integrate with or send data to any third-party services.

## Changes to this policy

If this policy ever changes (for example, if a future feature requires storing settings locally), the update will be reflected in this document in the project repository.

## Contact

For questions about this privacy policy, please open an issue in the project repository.
