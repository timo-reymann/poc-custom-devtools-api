Proof of Concept - Generic dev tools
===

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

### Application

- contains small JavaScript API wrapper around window messaging
- talks with content script via window messaging

### Extension

- content script
    - injected into application page setting up a connection between the page and the extension itself
    - running in same context as application
- background worker is required to make communication between content script and dev tools work
    - takes care of routing messages to chrome runtime or window depending on direction
- Dev-Tools
    - when opened send an event to content script telling they have been opened
    - communicate only via events with the application (technical limitation)
    - renders devtools based on elements getting registered by application

## Current limitations

- Only supports buttons and basic inputs for now
- no complex structure for layout (yet)

## What is missing for real world usage

- Add stable API interface with typing
- Add error handling
- Support more complex layouts and more UI elements
- Provide instructions on how to use in applications
  - only include devtools in dev builds etc.
- Creating extension for other browsers (moving out the reusable parts for other browsers)
- Publishing npm package for API
