import { useCallback, useMemo, useState } from 'react'
import { useMap, useMapEvents } from 'react-leaflet'
import { ZOOM } from '../config'

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Talks to the live Leaflet map for zoom buttons and search “fly to”.
 *
 * IMPORTANT: this hook must run inside a child of `<MapContainer>`, because
 * `useMap()` only works in that React context. The parent toolbar is outside
 * the map, so `MapCameraBridge` calls this hook and passes the API upward.
 */
export function useMapCamera() {
  const map = useMap()
  const [zoomLevel, setZoomLevel] = useState(() => map.getZoom())

  // Keep React state in sync when the user pinches/scrolls the map directly.
  useMapEvents({
    zoomend: () => setZoomLevel(map.getZoom()),
  })

  const zoomIn = useCallback(() => {
    map.setZoom(Math.min(ZOOM.max, map.getZoom() + 1))
  }, [map])

  const zoomOut = useCallback(() => {
    map.setZoom(Math.max(ZOOM.min, map.getZoom() - 1))
  }, [map])

  /**
   * Centers the map on a place.
   * @param {[number, number]} coords `[longitude, latitude]` (our data format)
   */
  const focusOn = useCallback(
    (coords, zoom = ZOOM.school) => {
      const [lng, lat] = coords
      // Leaflet wants [lat, lng]; skip animation if the user prefers reduced motion.
      map.setView([lat, lng], zoom, { animate: !prefersReducedMotion() })
    },
    [map],
  )

  // Memoize so MapCameraBridge does not spam the parent on every render.
  return useMemo(
    () => ({
      isReady: true,
      zoomIn,
      zoomOut,
      focusOn,
      canZoomIn: zoomLevel < ZOOM.max,
      canZoomOut: zoomLevel > ZOOM.min,
    }),
    [zoomIn, zoomOut, focusOn, zoomLevel],
  )
}
