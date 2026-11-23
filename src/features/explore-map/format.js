/**
 * Display helpers for school metrics.
 * FRPM shares in the data are 0–1; format them as percents only here.
 */

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
})

/** @param {number | null | undefined} share value in 0–1 */
export function formatShare(share) {
  if (share === null || share === undefined || Number.isNaN(share)) return 'Unavailable'
  return percentFormatter.format(share)
}

export function formatEnrollment(count) {
  if (count === null || count === undefined) return 'Unavailable'
  return new Intl.NumberFormat('en-US').format(count)
}
