const browserAPI = browser || chrome

browserAPI.devtools.panels.create("Custom Dev-Tools",
    "",
    "panel/panel.html",
     (panel) => {
    }
)
