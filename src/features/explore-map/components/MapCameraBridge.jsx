import { useEffect } from 'react'
import { useMapCamera } from '../hooks/useMapCamera'

/**
 * Tiny adapter: runs inside `<MapContainer>` and reports camera helpers up.
 *
 * Search + zoom controls live *outside* the map (for layout), but Leaflet’s
 * `useMap()` only works *inside* it. This bridge is the glue between them.
 *
 * @param {(camera: ReturnType<typeof useMapCamera>) => void} onCameraChange
 */
export default function MapCameraBridge({ onCameraChange }) {
  const camera = useMapCamera()

  useEffect(() => {
    onCameraChange(camera)
  }, [camera, onCameraChange])

  // Renders nothing — side-effect only.
  return null
}
