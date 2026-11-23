import { useCallback, useMemo, useRef, useState } from 'react'
import { Box } from '@mui/material'
import VisuallyHidden from '../../components/VisuallyHidden'
import LeafletMapView from './components/LeafletMapView'
import MapSearch from './components/MapSearch'
import MapZoomControls from './components/MapZoomControls'
import { MARKER_LABELS, ZOOM } from './config'
import { buildSearchablePlaces } from './places'
import { assignSchoolSlot } from './selection'

/** No-op camera used until MapCameraBridge attaches the real Leaflet map. */
const IDLE_CAMERA = {
  isReady: false,
  zoomIn: () => {},
  zoomOut: () => {},
  focusOn: () => {},
  canZoomIn: true,
  canZoomOut: true,
}

/**
 * Orchestrates the Explore Map UI.
 *
 * State owned here:
 * - `selectedSchools` — up to two schools shown as markers A and B
 * - `zoomFlags` — whether +/- buttons should look enabled
 *
 * Camera actions (zoom / fly-to) are stored in a *ref*, not React state.
 * That way search always calls the current map instance, even if the toolbar
 * has not re-rendered since the map mounted.
 */
export default function InteractiveMap({ schools }) {
  const [selectedSchools, setSelectedSchools] = useState([])
  const [zoomFlags, setZoomFlags] = useState({
    canZoomIn: true,
    canZoomOut: true,
  })
  const cameraRef = useRef(IDLE_CAMERA)

  // Cities + schools for the search box (rebuilt only when school data changes).
  const searchOptions = useMemo(() => buildSearchablePlaces(schools), [schools])

  // Called by MapCameraBridge whenever zoom level or map readiness changes.
  const handleCameraChange = useCallback((nextCamera) => {
    cameraRef.current = nextCamera
    setZoomFlags({
      canZoomIn: nextCamera.canZoomIn,
      canZoomOut: nextCamera.canZoomOut,
    })
  }, [])

  const handleSelectPlace = (place) => {
    // Cities only pan/zoom; schools also fill an A/B comparison slot.
    const zoom = place.type === 'school' ? ZOOM.school : ZOOM.city
    cameraRef.current.focusOn(place.coords, zoom)
    if (place.type === 'school') {
      setSelectedSchools((current) => assignSchoolSlot(current, place))
    }
  }

  const markers = selectedSchools.map((school, index) => ({
    label: MARKER_LABELS[index],
    school,
  }))

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2 }}>
        <Box role="search" sx={{ flex: 1, minWidth: 0 }}>
          <MapSearch options={searchOptions} onSelect={handleSelectPlace} />
        </Box>
        <MapZoomControls
          onZoomIn={() => cameraRef.current.zoomIn()}
          onZoomOut={() => cameraRef.current.zoomOut()}
          canZoomIn={zoomFlags.canZoomIn}
          canZoomOut={zoomFlags.canZoomOut}
        />
      </Box>

      <LeafletMapView
        selectedSchools={selectedSchools}
        onCameraChange={handleCameraChange}
      />

      {/* Markers are drawn on the map image, so announce A/B changes for screen readers. */}
      <VisuallyHidden role="status" aria-live="polite">
        {markers.map(({ label, school }) => `${label}: ${school.name}. `)}
      </VisuallyHidden>
    </>
  )
}
