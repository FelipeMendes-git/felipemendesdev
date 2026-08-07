import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/theme-context';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
      className={[
        'grid size-10 place-items-center rounded-xl border border-line bg-surface text-muted',
        'transition-[color,border-color,transform] duration-300 ease-smooth',
        'hover:-rotate-[24deg] hover:border-accent-line hover:text-ink',
      ].join(' ')}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'lua' : 'sol'}
          initial={reduced ? false : { opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="flex"
        >
          {isDark ? <Moon size={17} strokeWidth={1.8} /> : <Sun size={17} strokeWidth={1.8} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
