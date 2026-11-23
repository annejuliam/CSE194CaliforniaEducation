/**
 * Shared map settings.
 *
 * Keep numbers and URLs here (not scattered in components) so zoom behavior,
 * marker labels, and the tile server can be changed in one place.
 */

/** Default camera: statewide California view. Leaflet uses `[lat, lng]`. */
export const CALIFORNIA_CENTER = [36.7783, -119.4179]

export const ZOOM = {
  min: 5,
  max: 18,
  default: 6,
  /** Zoom level after selecting a city from search. */
  city: 11,
  /** Zoom level after selecting a school from search (closer than city). */
  school: 14,
}

/** Labels for the two comparison school pins on the map. */
export const MARKER_LABELS = ['A', 'B']

/** Fill colors for those pins (deliberately distinct from map tiles). */
export const MARKER_COLORS = { A: '#1f2a37', B: '#7a3e9d' }

/** Display names for Autocomplete groups, keyed by place.type. */
export const PLACE_TYPE_LABELS = { city: 'Cities', school: 'Schools' }

/** Pilot school list served from /public (accurate CDE lon/lat). */
export const SCHOOLS_DATA_URL = `${import.meta.env.BASE_URL}data/schools.json`

/**
 * OpenStreetMap raster tiles — accurate geography, no API key.
 * OSM requires attribution (see OSM_ATTRIBUTION on the TileLayer).
 */
export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
