import { Box, Typography } from '@mui/material'
import { FRPM_COLOR_STOPS } from '../config'

/** Color legend for FRPM eligibility (the map’s fill metric). */
export default function MapLegend() {
  return (
    <Box
      component="aside"
      aria-label="FRPM eligibility color legend"
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        px: 1.5,
        py: 1,
        boxShadow: 1,
        maxWidth: 280,
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.75 }}>
        FRPM eligibility (K–12)
      </Typography>
      <Box sx={{ display: 'flex', height: 10, borderRadius: 0.5, overflow: 'hidden', mb: 0.5 }}>
        {FRPM_COLOR_STOPS.map((stop) => (
          <Box
            key={stop.label}
            title={stop.label}
            sx={{
              flex: 1,
              bgcolor: stop.color,
              border: stop.color === '#f7f7f7' ? '1px solid #ddd' : 0,
            }}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          Lower
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Higher
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
        Proxy for student economic need — not household income.
      </Typography>
    </Box>
  )
}
