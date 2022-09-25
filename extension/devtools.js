const browserAPI = browser || chrome

browserAPI.devtools.panels.create("Custom Dev-Tools",
    "panel/settings-gears.png",
    "panel/panel.html",
     (panel) => {
    }
)
