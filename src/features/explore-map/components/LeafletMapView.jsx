import { MapContainer, TileLayer } from 'react-leaflet'
import { Box } from '@mui/material'
import {
  MAP_CENTER,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
  ZOOM,
} from '../config'
import MapCameraBridge from './MapCameraBridge'
import SchoolMarkers from './SchoolMarkers'
import 'leaflet/dist/leaflet.css'

/**
 * OpenStreetMap basemap. School dots are drawn by SchoolMarkers.
 * Click a dot to open that school's statistics.
 */
export default function LeafletMapView({
  schools,
  selectedSchoolId,
  onSelectSchool,
  onCameraChange,
}) {
  return (
    <Box
      sx={{
        height: { xs: 420, md: 640 },
        borderRadius: 2,
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        position: 'relative',
        '& .leaflet-container': {
          width: '100%',
          height: '100%',
          font: 'inherit',
        },
        '& .school-label': {
          background: 'transparent',
          border: 0,
          boxShadow: 'none',
          fontSize: 11,
          fontWeight: 600,
          color: '#1a1a1a',
          textShadow: '0 0 3px #fff, 0 0 3px #fff, 0 1px 2px #fff',
          marginLeft: 6,
        },
      }}
    >
      <MapContainer
        center={MAP_CENTER}
        zoom={ZOOM.default}
        minZoom={ZOOM.min}
        maxZoom={ZOOM.max}
        scrollWheelZoom
        zoomControl={false}
        attributionControl
        preferCanvas
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
        <MapCameraBridge onCameraChange={onCameraChange} />
        <SchoolMarkers
          schools={schools}
          selectedSchoolId={selectedSchoolId}
          onSelectSchool={onSelectSchool}
        />
      </MapContainer>
    </Box>
  )
}
