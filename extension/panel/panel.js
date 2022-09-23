// Adjust theme
const theme = chrome.devtools.panels.themeName
document.body.classList.add(`theme-${theme}`)

const backgroundPageConnection = chrome.runtime.connect({
    name: 'panel'
});

// init messaging connection
backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});

const sendOpen = () => {
    backgroundPageConnection.postMessage({
        name: 'devtools:open',
        tabId: chrome.devtools.inspectedWindow.tabId
    });
}

// signal for hosted page
sendOpen()

// util for sending messages
const sendMessage = (name, data) => {
    backgroundPageConnection.postMessage({
        name: name,
        tabId: chrome.devtools.inspectedWindow.tabId,
        data
    });
}
