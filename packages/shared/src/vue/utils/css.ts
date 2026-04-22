import type { ClassValue } from 'vue'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function for merging CSS class names
 * Uses clsx for conditional classes and tailwind-merge for conflicting Tailwind classes
 */
export function cn (...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
