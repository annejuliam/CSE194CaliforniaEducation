/** Display helpers. Shares in the data are 0–1; format as percents only here. */

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
})

const numberFormatter = new Intl.NumberFormat('en-US')

const signedFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
})

export function formatShare(share) {
  if (share === null || share === undefined || Number.isNaN(share)) return 'Unavailable'
  return percentFormatter.format(share)
}

export function formatEnrollment(count) {
  if (count === null || count === undefined) return 'Unavailable'
  return numberFormatter.format(count)
}

/** Dashboard “Distance from Standard” (points above/below standard). */
export function formatDistanceFromStandard(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'Unavailable'
  return signedFormatter.format(value)
}
