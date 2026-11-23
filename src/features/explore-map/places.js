/**
 * Places the Explore Map can search for and fly to.
 *
 * Coordinate order throughout this feature is `[longitude, latitude]`
 * (GeoJSON style). Leaflet itself wants `[lat, lng]`, so call sites swap
 * when talking to the map.
 */

/**
 * Reference cities always available in search.
 * Coords are approximate city centroids (not school locations).
 */
export const CITIES = [
  { id: 'city-redding', name: 'Redding', detail: 'California', coords: [-122.3917, 40.5865] },
  { id: 'city-sacramento', name: 'Sacramento', detail: 'California', coords: [-121.4944, 38.5816] },
  { id: 'city-san-francisco', name: 'San Francisco', detail: 'California', coords: [-122.4194, 37.7749] },
  { id: 'city-fresno', name: 'Fresno', detail: 'California', coords: [-119.7871, 36.7378] },
  { id: 'city-bakersfield', name: 'Bakersfield', detail: 'California', coords: [-119.0187, 35.3733] },
  { id: 'city-los-angeles', name: 'Los Angeles', detail: 'California', coords: [-118.2437, 34.0522] },
  { id: 'city-san-diego', name: 'San Diego', detail: 'California', coords: [-117.1611, 32.7157] },
]

/**
 * Merges cities + loaded schools into one Autocomplete list.
 * Cities first, then schools — MUI `groupBy` expects options sorted by group.
 */
export function buildSearchablePlaces(schools) {
  return [
    ...CITIES.map((city) => ({ ...city, type: 'city' })),
    ...schools.map((school) => ({ ...school, type: 'school' })),
  ]
}
