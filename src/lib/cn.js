import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Junta classes condicionais e resolve conflitos do Tailwind (o último vence). */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
