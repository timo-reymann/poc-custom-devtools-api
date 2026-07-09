(function() {
    var isFirefox = navigator.userAgent.indexOf("Firefox") !== -1
    var theme = (chrome || browser).devtools.panels.themeName
    var vars

    if (isFirefox) {
        if (theme === "dark") {
            vars = "--bg-primary:#232327;--text-primary:#f9f9fa;--text-secondary:#b1b1b3;--border-color:#555558;--bg-input:#363639;--bg-button:#38383d;--bg-button-hover:#4a4a4f;--accent:#0a84ff;--striped-bg:rgba(255,255,255,0.05)"
        } else {
            vars = "--bg-primary:#ffffff;--text-primary:#0c0c0d;--text-secondary:#737373;--border-color:#b1b1b3;--bg-input:#ffffff;--bg-button:#f9f9fa;--bg-button-hover:#e1e1e2;--accent:#0060df;--striped-bg:rgba(0,0,0,0.04)"
        }
    } else {
        if (theme === "dark") {
            vars = "--bg-primary:#202124;--text-primary:#e8eaed;--text-secondary:#9aa0a6;--border-color:#5f6368;--bg-input:#303134;--bg-button:#3c4043;--bg-button-hover:#4a4d51;--accent:#8ab4f8;--striped-bg:rgba(255,255,255,0.04)"
        } else {
            vars = "--bg-primary:#ffffff;--text-primary:#202124;--text-secondary:#5f6368;--border-color:#dadce0;--bg-input:#ffffff;--bg-button:#f8f9fa;--bg-button-hover:#f1f3f4;--accent:#1a73e8;--striped-bg:rgba(0,0,0,0.04)"
        }
    }

    var style = document.createElement("style")
    style.textContent = ":root{" + vars + "}"
    document.head.appendChild(style)
})()
