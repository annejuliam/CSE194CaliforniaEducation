import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { colorForFrpm } from '../config'

const LABEL_ZOOM = 12
const MAX_LABELS = 40

/**
 * Draws schools as canvas circle markers.
 *
 * React components per school would be too slow at statewide scale (~10k points).
 * Names appear on hover. When zoomed in, a limited set of names stays on the map.
 */
export default function SchoolMarkers({ schools, selectedSchoolId, onSelectSchool }) {
  const map = useMap()
  const markersRef = useRef(new Map())
  const onSelectRef = useRef(onSelectSchool)

  useEffect(() => {
    onSelectRef.current = onSelectSchool
  }, [onSelectSchool])

  useEffect(() => {
    const renderer = L.canvas({ padding: 0.5 })
    const group = L.layerGroup().addTo(map)
    const markers = new Map()

    for (const school of schools) {
      const [lng, lat] = school.coords
      const marker = L.circleMarker([lat, lng], {
        renderer,
        radius: 4,
        weight: 1,
        color: '#ffffff',
        fillColor: colorForFrpm(school.frpmEligibleShare),
        fillOpacity: 0.9,
      })
      marker.bindTooltip(school.name, { direction: 'top', sticky: true })
      marker.on('click', () => onSelectRef.current(school))
      marker.addTo(group)
      markers.set(school.id, { marker, school })
    }

    markersRef.current = markers

    for (const { marker, school } of markers.values()) {
      marker.options.title = school.name
    }

    const refreshLabels = () => {
      const zoom = map.getZoom()
      const bounds = map.getBounds()
      let labeled = 0
      for (const { marker, school } of markers.values()) {
        const inView = bounds.contains(marker.getLatLng())
        const shouldLabel = zoom >= LABEL_ZOOM && inView && labeled < MAX_LABELS
        if (shouldLabel) labeled += 1
        const tooltip = marker.getTooltip()
        if (Boolean(tooltip?.options.permanent) === shouldLabel) continue
        marker.unbindTooltip()
        marker.bindTooltip(school.name, {
          direction: shouldLabel ? 'right' : 'top',
          permanent: shouldLabel,
          sticky: !shouldLabel,
          className: shouldLabel ? 'school-label' : '',
          opacity: 1,
        })
      }
    }

    map.on('moveend zoomend', refreshLabels)
    refreshLabels()

    return () => {
      map.off('moveend zoomend', refreshLabels)
      group.remove()
      markersRef.current = new Map()
    }
  }, [map, schools])

  useEffect(() => {
    for (const [id, { marker }] of markersRef.current) {
      const selected = id === selectedSchoolId
      marker.setStyle({
        radius: selected ? 9 : 4,
        weight: selected ? 2 : 1,
        color: selected ? '#111111' : '#ffffff',
      })
      if (selected) marker.bringToFront()
    }
  }, [selectedSchoolId, schools])

  return null
}
