const devtoolsHost = document.querySelector("#custom-devtools-host")

/**
 * Append nodes bundled together in a row
 * @param nodes {Node}
 */
const appendToDevToolsHost = (...nodes) => {
    const wrapper = document.createElement("div")
    wrapper.classList.add("devtools--row")
    nodes.forEach(node => wrapper.append(node))
    devtoolsHost.append(wrapper)
}

const createButton = (elementDescriptor) => {
    const actionButton = document.createElement("button")
    actionButton.textContent = elementDescriptor.label
    actionButton.addEventListener("click", () => sendMessage(`event:${elementDescriptor.id}:action`))
    return actionButton;
}

const createInput = (elementDescriptor) => {
    // create input
    const inputField = document.createElement("input")
    inputField.placeholder = elementDescriptor.label
    inputField.type = elementDescriptor.inputType || "text"
    inputField.addEventListener("keyup", e => {
        if (e.key === "Enter") {
            submitButton.click()
        }
    })

    // create button to submit
    const submitButton = document.createElement("button")
    submitButton.classList.add("devtools--submit-button")
    submitButton.innerText = "Submit"
    submitButton.addEventListener("click", () => {
        sendMessage(`event:${elementDescriptor.id}:action`, {
            value: inputField.value || ""
        })
        inputField.value = ""
    })

    return [inputField, submitButton]
}

const createHeading = (elementDescriptor) => {
    const heading = document.createElement("h1")
    heading.innerText = elementDescriptor.label
    heading.id = elementDescriptor.id
    return heading;
}

const createTable = (elementDescriptor) => {
    const wrapper = document.createElement("div")
    wrapper.classList.add("devtools--table-wrapper")

    const heading = document.createElement("h2")
    heading.textContent = elementDescriptor.label
    wrapper.append(heading)

    const table = document.createElement("table")
    table.id = elementDescriptor.id
    wrapper.append(table)

    const thead = document.createElement("thead")
    const headerRow = document.createElement("tr")
    elementDescriptor.columns.forEach(col => {
        const th = document.createElement("th")
        th.textContent = col
        headerRow.append(th)
    })
    thead.append(headerRow)
    table.append(thead)

    const tbody = document.createElement("tbody")
    table.append(tbody)
    renderTableRows(tbody, elementDescriptor.rows)

    return wrapper
}

const renderTableRows = (tbody, rows) => {
    tbody.innerHTML = ""
    if (!rows || rows.length === 0) {
        const noData = document.createElement("td")
        noData.textContent = "No data"
        noData.colSpan = 999
        noData.classList.add("devtools--table-no-data")
        const row = document.createElement("tr")
        row.append(noData)
        tbody.append(row)
        return
    }
    rows.forEach((cells, rowIndex) => {
        const tr = document.createElement("tr")
        if (rowIndex % 2 === 1) {
            tr.classList.add("devtools--table-row-striped")
        }
        cells.forEach(cell => {
            const td = document.createElement("td")
            td.textContent = cell
            tr.append(td)
        })
        tbody.append(tr)
    })
}

const updateTable = (data) => {
    const table = document.getElementById(data.id)
    if (!table) {
        sendError(`Table with id "${data.id}" not found`)
        return
    }
    const tbody = table.querySelector("tbody")
    if (!tbody) return
    renderTableRows(tbody, data.rows)
}

const createDropdown = (elementDescriptor) => {
    const select = document.createElement("select")
    const options = elementDescriptor.options.map(o => `<option value="${o}">${o}</option>`)
    select.innerHTML = `<option selected disabled>${elementDescriptor.label}</option>`
    select.innerHTML += options.join("\n")
    select.addEventListener("change", e => sendMessage(`event:${elementDescriptor.id}:action`, {
        value: select.value || ""
    }))
    return select
}

/**
 * Register element with descriptor
 * @param elementDescriptor {{type:string,label:string,id:string,inputType:string?}}
 */
const registerElement = (elementDescriptor) => {
    switch (elementDescriptor.type) {
        case "button":
            appendToDevToolsHost(createButton(elementDescriptor))
            break

        case "input":
            appendToDevToolsHost(...createInput(elementDescriptor))
            break

        case "dropdown":
            appendToDevToolsHost(createDropdown(elementDescriptor))
            break

        case "heading":
            appendToDevToolsHost(createHeading(elementDescriptor))
            break

        case "table":
            devtoolsHost.append(createTable(elementDescriptor))
            break

        default:
            sendError(`Unsupported element type ${elementDescriptor.type}`)
            break
    }
}

/**
 * Reset UI state and treat as opened again
 */
const resetState = () => {
    devtoolsHost.innerHTML = ""
}

let contentScriptReady = false

const handleEvent = (e) => {
    switch (e.name) {
        case "registerElement":
            registerElement(e.data)
            break

        case "devtools:agent:ready":
            resetState()
            break

        case "reloaded":
            if (!contentScriptReady) {
                resetState()
            }
            break

        case "content-script:ready":
            contentScriptReady = true
            resetState()
            sendOpen()
            break

        case "updateTable":
            updateTable(e.data)
            break

        default:
            sendError(`Unsupported event name ${e.name}`)
            break
    }
}

backgroundPageConnection.onMessage.addListener(e => handleEvent(e))

// Clear default placeholder text once panel is set up
resetState()
