// Registers the "Devtoolster" panel and picks its icon to match the DevTools theme.
const isDarkTheme = browser.devtools.panels.themeName === 'dark';

browser.devtools.panels.create(
  'Devtoolster',
  `/icons/settings-gears-${isDarkTheme ? 'gray' : 'black'}.png`,
  '/panel.html',
);
