import { formatEnrollment, formatShare } from '../format'

/**
 * HTML string for a Leaflet popup.
 * Leaflet popups take HTML, so this stays a plain string builder (not JSX).
 */
export function schoolPopupHtml(label, school) {
  const frpm = formatShare(school.frpmEligibleShare)
  const enrollment = formatEnrollment(school.enrollmentK12)
  const year = school.academicYear ?? '2025-2026'

  return `
    <div style="font: 500 13px/1.4 Roboto, Helvetica, Arial, sans-serif; min-width: 160px;">
      <div style="font-weight: 700; margin-bottom: 4px;">${label}: ${escapeHtml(school.name)}</div>
      <div style="color: #555; margin-bottom: 8px;">${escapeHtml(school.detail)}</div>
      <div><strong>FRPM eligibility (K–12):</strong> ${frpm}</div>
      <div><strong>Enrollment (K–12):</strong> ${enrollment}</div>
      <div style="color: #777; margin-top: 6px; font-size: 11px;">CDE FRPM ${escapeHtml(year)}</div>
    </div>
  `
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
