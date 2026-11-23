import { Box } from '@mui/material'

// Classic “visually hidden but available to screen readers” clip pattern.
const hiddenStyles = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
}

/**
 * Renders children for assistive tech only (not shown on screen).
 * Used for loading announcements and live A/B marker updates.
 */
export default function VisuallyHidden({ children, ...props }) {
  return (
    <Box component="span" sx={hiddenStyles} {...props}>
      {children}
    </Box>
  )
}
