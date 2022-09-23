const devtoolsHost = document.querySelector("#custom-devtools-host")

const appendToHost = (...nodes) => {
    const wrapper = document.createElement("div")
    wrapper.classList.add("devtools--row")
    nodes.forEach(node => wrapper.append(node))
    devtoolsHost.append(wrapper)
}

const registerElement = (elementDescriptor) => {
    switch (elementDescriptor.type) {
        case "button":
            const button = document.createElement("button")
            button.textContent = elementDescriptor.label
            button.addEventListener("click", () => sendMessage(`event:${elementDescriptor.id}:action`))
            appendToHost(button)
            break;

        case "input":
            // create input
            const input = document.createElement("input")
            input.placeholder = elementDescriptor.label

            // create button to submit
            const inputButton = document.createElement("button")
            inputButton.innerText = "Submit"
            inputButton.addEventListener("click", () => {
                sendMessage(`event:${elementDescriptor.id}:action`, {
                    value: input.value || "bla"
                })
            })
            appendToHost(input, inputButton)
            break;

        default:
            console.warn(`Unsupported element type ${elementDescriptor.type}`)
            break;
    }
}

const handleEvent = (e) => {
    switch (e.name) {
        case "registerElement":
            registerElement(e.data)
            break;

        case "reloaded":
            // handle reload by sending open event again + resetting UI
            sendOpen()
            devtoolsHost.innerHTML = ""
            break;

        default:
            console.warn("Unknown event", e)
            break;
    }
}

backgroundPageConnection.onMessage.addListener(e => handleEvent(e))
