import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina múltiples clases de Tailwind de manera condicional
 * Utiliza clsx para procesar las condiciones y twMerge para combinar y resolver conflictos de clases
 * 
 * @param inputs - Lista de clases o expresiones condicionales
 * @returns String con las clases combinadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 