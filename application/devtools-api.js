const sendEvent = (name, data) => {
    window.postMessage({
        source: "custom-devtools-agent",
        name: name,
        data: data || {}
    })
}

let listeners = {}

const registerElement = (descriptor) => {
    if (descriptor.onAction) {
        listeners[`event:${descriptor.id}:action`] = descriptor.onAction
        delete descriptor.onAction
    }
    sendEvent("registerElement", descriptor)
}

const uuidv4 = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
);

const createButton = (label, onAction) => {
    return {
        id: uuidv4(),
        type: "button",
        label,
        onAction
    }
}

const createInput = (label, onAction) => {
    return {
        id: uuidv4(),
        type: "input",
        label,
        onAction
    }
}

const findListener = (event) => {
    if (Object.keys(listeners).includes(event.name)) {
        return listeners[event.name]
    }

    return null;
}

const registerCustomDevTools = (devTools) => {
    const elementDescriptors = devTools.elementDescriptors

    window.addEventListener("message", (e) => {
        if (e.source !== window || !e.data || e.data.source !== "custom-devtools-devtools") {
            return;
        }

        const event = e.data;
        switch (event.name) {
            case "devtools:open":
                if (elementDescriptors) {
                    elementDescriptors.forEach(descriptor => registerElement(descriptor))
                }
                break;

            default:
                const listener = findListener(event);
                if (listener == null) {
                    console.warn("Unknown event", event)
                } else {
                    listener(event.data)
                }
                break;
        }
    })
}
