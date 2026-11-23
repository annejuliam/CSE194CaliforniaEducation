import { useCallback, useMemo, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import VisuallyHidden from '../../components/VisuallyHidden'
import LeafletMapView from './components/LeafletMapView'
import MapLegend from './components/MapLegend'
import MapSearch from './components/MapSearch'
import MapZoomControls from './components/MapZoomControls'
import SchoolStatsPanel from './components/SchoolStatsPanel'
import { ZOOM } from './config'
import { buildSearchablePlaces } from './places'

const IDLE_CAMERA = {
  isReady: false,
  zoomIn: () => {},
  zoomOut: () => {},
  focusOn: () => {},
  canZoomIn: true,
  canZoomOut: true,
}

function coordsKey(coords) {
  return `${coords[0].toFixed(5)},${coords[1].toFixed(5)}`
}

/**
 * Explore Map: labeled schools colored by FRPM, with a statistics panel.
 */
export default function InteractiveMap({ schools, meta }) {
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [zoomFlags, setZoomFlags] = useState({ canZoomIn: true, canZoomOut: true })
  const cameraRef = useRef(IDLE_CAMERA)

  const searchOptions = useMemo(() => buildSearchablePlaces(schools), [schools])

  const colocatedSchools = useMemo(() => {
    if (!selectedSchool) return []
    const key = coordsKey(selectedSchool.coords)
    return schools.filter((school) => coordsKey(school.coords) === key)
  }, [schools, selectedSchool])

  const handleCameraChange = useCallback((nextCamera) => {
    cameraRef.current = nextCamera
    setZoomFlags({
      canZoomIn: nextCamera.canZoomIn,
      canZoomOut: nextCamera.canZoomOut,
    })
  }, [])

  const selectSchool = useCallback((school) => {
    setSelectedSchool(school)
    cameraRef.current.focusOn(school.coords, ZOOM.school)
  }, [])

  const handleSelectPlace = (place) => {
    if (place.type === 'school') {
      selectSchool(place)
      return
    }
    cameraRef.current.focusOn(place.coords, ZOOM.city)
  }

  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 760 }}>
        Active California public schools from the CDE directory. Dot color is
        FRPM eligibility where that file has a matching school. Zoom in to see
        names, or search a school. Click a dot for enrollment, Dashboard ELA and
        math, and graduation when available. This is for exploration, not a
        ranking or a claim that income causes the results.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
        <Box role="search" sx={{ flex: 1, minWidth: 220 }}>
          <MapSearch options={searchOptions} onSelect={handleSelectPlace} />
        </Box>
        <MapZoomControls
          onZoomIn={() => cameraRef.current.zoomIn()}
          onZoomOut={() => cameraRef.current.zoomOut()}
          canZoomIn={zoomFlags.canZoomIn}
          canZoomOut={zoomFlags.canZoomOut}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: selectedSchool ? '1.4fr 1fr' : '1fr' },
          gap: 2,
          alignItems: 'stretch',
        }}
      >
        <figure style={{ margin: 0, position: 'relative' }}>
          <LeafletMapView
            schools={schools}
            selectedSchoolId={selectedSchool?.id ?? null}
            onSelectSchool={selectSchool}
            onCameraChange={handleCameraChange}
          />
          <Box sx={{ position: 'absolute', left: 12, bottom: 28, zIndex: 500 }}>
            <MapLegend />
          </Box>
          <Box component="figcaption" sx={{ mt: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              {meta?.count ?? schools.length} active schools with coordinates
              {meta?.withFrpm != null ? ` (${meta.withFrpm} with FRPM)` : ''}. Gray
              dots have no FRPM row. Directory date {meta?.directoryDate ?? 'n/a'}.
              Graduation is only filled for the San Diego Unified pilot schools.
            </Typography>
          </Box>
        </figure>

        {selectedSchool && (
          <SchoolStatsPanel
            school={selectedSchool}
            colocatedSchools={colocatedSchools}
            onSelectSchool={setSelectedSchool}
            onClear={() => setSelectedSchool(null)}
          />
        )}
      </Box>

      <VisuallyHidden role="status" aria-live="polite">
        {selectedSchool
          ? `Selected ${selectedSchool.name}. FRPM ${selectedSchool.frpmEligibleShare ?? 'unavailable'}.`
          : 'No school selected.'}
      </VisuallyHidden>
    </>
  )
}
