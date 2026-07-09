const devtoolsHost = document.querySelector("#custom-devtools-host")

let tabsConfig = {}
let tabOrder = []
let activeTabId = null
let tabBar = null
let tabContentArea = null

/**
 * Append nodes bundled together in a row into a given container
 * @param container {Element}
 * @param nodes {Node}
 */
const appendToContainer = (container, ...nodes) => {
    const wrapper = document.createElement("div")
    wrapper.classList.add("devtools--row")
    nodes.forEach(node => wrapper.append(node))
    container.append(wrapper)
}

const activateTab = (tabId) => {
    activeTabId = tabId
    Object.entries(tabsConfig).forEach(([id, cfg]) => {
        cfg.tabButton.classList.toggle("devtools--tab-active", id === tabId)
        cfg.contentContainer.classList.toggle("devtools--tab-panel-active", id === tabId)
    })
}

const registerTabs = (data) => {
    resetState()
    tabBar = document.createElement("div")
    tabBar.classList.add("devtools--tab-bar")
    tabContentArea = document.createElement("div")
    tabContentArea.classList.add("devtools--tab-content")

    data.tabs.forEach((tab, index) => {
        const tabButton = document.createElement("button")
        tabButton.classList.add("devtools--tab")
        tabButton.textContent = tab.label
        tabButton.addEventListener("click", () => activateTab(tab.id))

        const content = document.createElement("div")
        content.classList.add("devtools--tab-panel")
        content.dataset.tabId = tab.id

        tabsConfig[tab.id] = { label: tab.label, tabButton, contentContainer: content }
        tabOrder.push(tab.id)
        tabBar.append(tabButton)
        tabContentArea.append(content)

        if (index === 0) activateTab(tab.id)
    })

    devtoolsHost.append(tabBar, tabContentArea)
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

const getTabContainer = (tabId) => {
    if (tabId && tabsConfig[tabId]) return tabsConfig[tabId].contentContainer
    if (tabOrder.length > 0) return tabsConfig[tabOrder[0]].contentContainer
    return null
}

/**
 * Register element with descriptor
 * @param elementDescriptor {{type:string,label:string,id:string,inputType:string?,tabId:string?}}
 */
const registerElement = (elementDescriptor) => {
    const container = getTabContainer(elementDescriptor.tabId)
    if (!container) return

    switch (elementDescriptor.type) {
        case "button":
            appendToContainer(container, createButton(elementDescriptor))
            break

        case "input":
            appendToContainer(container, ...createInput(elementDescriptor))
            break

        case "dropdown":
            appendToContainer(container, createDropdown(elementDescriptor))
            break

        case "heading":
            container.append(createHeading(elementDescriptor))
            break

        case "table":
            container.append(createTable(elementDescriptor))
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
    tabsConfig = {}
    tabOrder = []
    activeTabId = null
    tabBar = null
    tabContentArea = null
}

const handleEvent = (e) => {
    switch (e.name) {
        case "registerElement":
            registerElement(e.data)
            break

        case "devtools:agent:ready":
            resetState()
            break

        case "reloaded":
            resetState()
            devtoolsHost.innerHTML = "<h1>No Dev tools registered or still loading</h1>"
            break

        case "content-script:ready":
            resetState()
            sendOpen()
            break

        case "registerTabs":
            registerTabs(e.data)
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
