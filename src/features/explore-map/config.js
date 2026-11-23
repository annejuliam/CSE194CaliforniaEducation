/**
 * Shared map settings for the Explore Map.
 */

/** Default view: California. Leaflet uses `[lat, lng]`. */
export const MAP_CENTER = [37.2, -119.5]

export const ZOOM = {
  min: 5,
  max: 18,
  default: 6,
  city: 11,
  school: 14,
}

/** Labels for optional A/B comparison pins. */
export const MARKER_LABELS = ['A', 'B']
export const MARKER_COLORS = { A: '#1f2a37', B: '#7a3e9d' }

export const PLACE_TYPE_LABELS = { city: 'Cities', school: 'Schools' }

export const SCHOOLS_DATA_URL = `${import.meta.env.BASE_URL}data/schools.json`

export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

/**
 * FRPM → fill color (EdOpportunity-style diverging scale).
 * Low FRPM (fewer meal-eligible students) ≈ higher-SES communities → blue.
 * High FRPM ≈ lower-SES communities → orange.
 */
export const FRPM_COLOR_STOPS = [
  { upTo: 0.25, color: '#2166ac', label: 'Under 25%' },
  { upTo: 0.4, color: '#67a9cf', label: '25–40%' },
  { upTo: 0.55, color: '#f7f7f7', label: '40–55%' },
  { upTo: 0.7, color: '#ef8a62', label: '55–70%' },
  { upTo: Infinity, color: '#b2182b', label: '70%+' },
]

export function colorForFrpm(share) {
  if (share === null || share === undefined) return '#9aa0a6'
  const stop = FRPM_COLOR_STOPS.find((s) => share < s.upTo) ?? FRPM_COLOR_STOPS.at(-1)
  return stop.color
}
