import L from 'leaflet'
import { MARKER_COLORS } from '../config'

/**
 * Builds a custom A/B pin with Leaflet `divIcon`.
 *
 * Why not the default blue pin?
 * - Default marker images break under Vite unless you manually fix asset URLs.
 * - We need a letter (A/B) on the pin for comparison.
 */
export function createSchoolMarkerIcon(label) {
  const color = MARKER_COLORS[label] ?? MARKER_COLORS.A

  return L.divIcon({
    // className is cleared in CSS so Leaflet’s default white square does not show.
    className: 'school-marker-icon',
    html: `<span style="
      display:flex;
      align-items:center;
      justify-content:center;
      width:28px;
      height:28px;
      border-radius:50%;
      background:${color};
      color:#fff;
      font:700 13px/1 Roboto, Helvetica, Arial, sans-serif;
      border:3px solid #fff;
      box-shadow:0 1px 4px rgba(0,0,0,0.35);
    ">${label}</span>`,
    iconSize: [28, 28],
    // Anchor at the center so the pin sits on the school coordinate.
    iconAnchor: [14, 14],
  })
}
