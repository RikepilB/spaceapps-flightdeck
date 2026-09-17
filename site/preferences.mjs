const themeKey = 'flightdeck-theme';
const colors = {light: '#f7f8f2', dark: '#0b1718'};

function applyTheme(theme, save = false) {
  const selected = ['light', 'dark'].includes(theme) ? theme : 'light';
  document.documentElement.dataset.theme = selected;
  document.documentElement.style.colorScheme = selected;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colors[selected]);
  document.querySelectorAll('button[data-theme]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.theme === selected));
  });
  if (save) {
    try { localStorage.setItem(themeKey, selected); } catch {}
  }
}

document.querySelectorAll('button[data-theme]').forEach(button => {
  button.addEventListener('click', () => applyTheme(button.dataset.theme, true));
});

applyTheme(document.documentElement.dataset.theme);
