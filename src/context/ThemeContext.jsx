import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './theme-context';

const STORAGE_KEY = 'tema';

/** Lê o tema já aplicado ao <html> pelo script anti-flash do index.html. */
function readInitialTheme() {
  return document.documentElement.classList.contains('light') ? 'claro' : 'escuro';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'claro');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* localStorage bloqueado: o tema vale só para esta sessão */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'escuro' ? 'claro' : 'escuro'));
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, isDark: theme === 'escuro' }),
    [theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
