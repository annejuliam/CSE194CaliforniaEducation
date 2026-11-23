import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Box, Typography } from '@mui/material'
import {
  CALIFORNIA_CENTER,
  MARKER_LABELS,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
  ZOOM,
} from '../config'
import MapCameraBridge from './MapCameraBridge'
import { schoolPopupHtml } from './SchoolPopupContent'
import { createSchoolMarkerIcon } from './schoolMarkerIcon'
// Leaflet’s CSS is required for tiles, controls, and marker positioning.
import 'leaflet/dist/leaflet.css'

/**
 * Presentational map surface: OSM tiles + optional selected-school markers.
 *
 * Owns no search/selection state — the parent passes `selectedSchools` and
 * receives camera actions through `onCameraChange`.
 */
export default function LeafletMapView({ selectedSchools, onCameraChange }) {
  return (
    // <figure> + <figcaption> keep the map and its description linked for a11y.
    <figure style={{ margin: 0 }}>
      <Box
        sx={{
          height: { xs: 420, md: 640 },
          borderRadius: 2,
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
          // Leaflet injects its own .leaflet-container; force it to fill our box.
          '& .leaflet-container': {
            width: '100%',
            height: '100%',
            font: 'inherit',
          },
          // Hide Leaflet’s default divIcon chrome around our custom pins.
          '& .school-marker-icon': {
            background: 'transparent',
            border: 0,
          },
        }}
      >
        <MapContainer
          center={CALIFORNIA_CENTER}
          zoom={ZOOM.default}
          minZoom={ZOOM.min}
          maxZoom={ZOOM.max}
          scrollWheelZoom
          // We provide our own +/- buttons above the map.
          zoomControl={false}
          attributionControl
          style={{ width: '100%', height: '100%' }}
        >
          {/* Basemap tiles — free, no API key; attribution is required. */}
          <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />

          {/* Exposes zoomIn / zoomOut / focusOn to the toolbar above. */}
          <MapCameraBridge onCameraChange={onCameraChange} />

          {selectedSchools.map((school, index) => {
            const label = MARKER_LABELS[index]
            const [lng, lat] = school.coords
            return (
              <Marker
                key={school.id}
                position={[lat, lng]}
                icon={createSchoolMarkerIcon(label)}
                title={`${label}: ${school.name}`}
                alt={`${label}: ${school.name}`}
              >
                <Popup>
                  <div
                    // Popup HTML is built with escaped school fields only.
                    dangerouslySetInnerHTML={{
                      __html: schoolPopupHtml(label, school),
                    }}
                  />
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </Box>

      <Box component="figcaption" sx={{ mt: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          OpenStreetMap view of California. Search for a city to pan and zoom.
          School pins can be added later once locations are available.
        </Typography>
      </Box>
    </figure>
  )
}
