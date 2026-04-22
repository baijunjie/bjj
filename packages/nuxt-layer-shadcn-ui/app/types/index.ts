/**
 * Re-export `ClassValue` as a globally auto-imported type.
 *
 * Nuxt auto-imports everything exported from `app/types/**\/*.ts`. This file
 * makes `ClassValue` available without explicit import across the layer.
 */
export type { ClassValue } from 'vue'
