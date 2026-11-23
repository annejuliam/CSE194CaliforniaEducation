import { MARKER_LABELS } from './config'

/**
 * Pure helper for comparison slots A then B.
 *
 * Rules:
 * - Re-selecting an already-chosen school changes nothing.
 * - Empty slots fill in order: first school → A, second → B.
 * - When both slots are full, a new school replaces B so A stays the anchor.
 *
 * Kept outside React so the rule is easy to unit-test later.
 */
export function assignSchoolSlot(current, school) {
  if (current.some((selected) => selected.id === school.id)) return current
  if (current.length < MARKER_LABELS.length) return [...current, school]
  return [current[0], school]
}
