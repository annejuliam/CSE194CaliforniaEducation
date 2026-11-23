import { Alert, Skeleton } from '@mui/material'
import VisuallyHidden from '../../components/VisuallyHidden'
import InteractiveMap from './InteractiveMap'
import { useSchoolsData } from './hooks/useSchoolsData'

/**
 * Public entry point for the Explore Map feature.
 *
 * Handles loading / error for school data, then hands off to InteractiveMap.
 * Page layout (heading, section id) stays in `pages/Main.jsx`.
 */
export default function ExploreMap() {
  const { status, schools } = useSchoolsData()

  if (status === 'error') {
    return (
      <Alert severity="error">
        School locations could not be loaded. Please refresh the page to try again.
      </Alert>
    )
  }

  if (status === 'loading') {
    return (
      <div role="status">
        <VisuallyHidden>Loading map</VisuallyHidden>
        <Skeleton variant="rounded" height={640} aria-hidden="true" />
      </div>
    )
  }

  return <InteractiveMap schools={schools} />
}
