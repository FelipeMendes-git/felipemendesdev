import { createContext, useContext } from 'react';

/**
 * Contexto e hook vivem separados do <ThemeProvider> para que o arquivo do
 * componente exporte apenas componentes (requisito do Fast Refresh).
 */
export const ThemeContext = createContext(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme precisa estar dentro de <ThemeProvider>.');
  return context;
}
