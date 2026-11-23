import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { formatDistanceFromStandard, formatEnrollment, formatShare } from '../format'

function Stat({ label, value, hint }) {
  return (
    <Box sx={{ mb: 1.25 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      {hint && (
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      )}
    </Box>
  )
}

/**
 * Side panel of school statistics (EdOpportunity-style detail card).
 * When several schools share one coordinate (Kearny campus), shows a picker.
 */
export default function SchoolStatsPanel({
  school,
  colocatedSchools = [],
  onSelectSchool,
  onClear,
}) {
  if (!school) return null

  return (
    <Box
      component="aside"
      aria-label={`Statistics for ${school.name}`}
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        boxShadow: 2,
        maxHeight: { xs: 320, md: '100%' },
        overflow: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 1 }}>
        <Box>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
            {school.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {school.detail} · {school.county} County
          </Typography>
        </Box>
        <Button size="small" onClick={onClear} aria-label="Clear selected school">
          Close
        </Button>
      </Box>

      {colocatedSchools.length > 1 && (
        <>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {colocatedSchools.length} schools share this map location. Choose one:
          </Typography>
          <List dense disablePadding sx={{ mb: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            {colocatedSchools.map((option) => (
              <ListItemButton
                key={option.id}
                selected={option.id === school.id}
                onClick={() => onSelectSchool(option)}
              >
                <ListItemText
                  primary={option.name}
                  secondary={`FRPM ${formatShare(option.frpmEligibleShare)}`}
                />
              </ListItemButton>
            ))}
          </List>
        </>
      )}

      <Divider sx={{ my: 1.5 }} />

      <Stat
        label="FRPM eligibility (K–12)"
        value={formatShare(school.frpmEligibleShare)}
        hint={`${formatEnrollment(school.frpmEligibleCount)} of ${formatEnrollment(school.enrollmentK12)} students · ${school.academicYear ?? 'CDE FRPM'}`}
      />
      <Stat
        label="Enrollment (K–12)"
        value={formatEnrollment(school.enrollmentK12)}
      />
      <Stat
        label="ELA Distance from Standard"
        value={`${formatDistanceFromStandard(school.elaDistanceFromStandard)}${school.elaDashboardColor ? ` · ${school.elaDashboardColor}` : ''}`}
        hint={school.elaStudentsTested != null ? `${formatEnrollment(school.elaStudentsTested)} students tested · 2025 Dashboard` : '2025 Dashboard'}
      />
      <Stat
        label="Math Distance from Standard"
        value={`${formatDistanceFromStandard(school.mathDistanceFromStandard)}${school.mathDashboardColor ? ` · ${school.mathDashboardColor}` : ''}`}
        hint={school.mathStudentsTested != null ? `${formatEnrollment(school.mathStudentsTested)} students tested · 2025 Dashboard` : '2025 Dashboard'}
      />
      <Stat
        label="Combined 4-/5-year graduation rate"
        value={formatShare(school.gradCombinedShare)}
        hint={school.gradReportingYear ? `Dashboard ${school.gradReportingYear}` : 'CDE Dashboard'}
      />

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Metrics come from separate CDE files and years. They are shown side by side for
        exploration — not as a single school-quality score.
      </Typography>
    </Box>
  )
}
