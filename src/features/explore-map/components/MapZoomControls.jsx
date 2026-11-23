import { Box, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const buttonSx = {
  width: 40,
  height: 40,
  border: 1,
  borderColor: 'divider',
  borderRadius: 1.5,
  '&[aria-disabled="true"]': { opacity: 0.4, cursor: 'default' },
}

/**
 * Single zoom button.
 *
 * Uses `aria-disabled` instead of the HTML `disabled` attribute so a keyboard
 * user who just hit the zoom limit does not lose focus on the control.
 */
function ZoomButton({ label, icon, enabled, onClick }) {
  return (
    <IconButton
      aria-label={label}
      aria-disabled={!enabled}
      onClick={enabled ? onClick : undefined}
      sx={buttonSx}
    >
      {icon}
    </IconButton>
  )
}

/** +/- controls grouped for assistive tech (`role="group"`). */
export default function MapZoomControls({ onZoomIn, onZoomOut, canZoomIn, canZoomOut }) {
  return (
    <Box role="group" aria-label="Map zoom" sx={{ display: 'flex', gap: 1 }}>
      <ZoomButton label="Zoom in" icon={<AddIcon />} enabled={canZoomIn} onClick={onZoomIn} />
      <ZoomButton label="Zoom out" icon={<RemoveIcon />} enabled={canZoomOut} onClick={onZoomOut} />
    </Box>
  )
}
