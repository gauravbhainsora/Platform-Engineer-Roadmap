import { STORAGE_KEY } from './progress';

// Run before the page paints, so a saved dark preference never flashes light.
// Only a validated enum is applied; storage contents are never inserted into HTML.
export const THEME_INIT_SCRIPT = `(() => {
  let theme = 'light';
  try {
    const progress = JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)}) || 'null');
    if (progress?.theme === 'dark') theme = 'dark';
  } catch {}
  document.documentElement.dataset.theme = theme;
})();`;
