import { Alert, Skeleton } from '@mui/material'
import VisuallyHidden from '../../components/VisuallyHidden'
import InteractiveMap from './InteractiveMap'
import { useSchoolsData } from './hooks/useSchoolsData'

/** Loads joined school datasets, then renders the Explore Map. */
export default function ExploreMap() {
  const { status, schools, meta } = useSchoolsData()

  if (status === 'error') {
    return (
      <Alert severity="error">
        School data could not be loaded. Run <code>npm run build:schools</code> and
        refresh the page.
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

  if (!schools.length) {
    return (
      <Alert severity="info">
        No schools with coordinates are available yet. Add locations and rebuild with{' '}
        <code>npm run build:schools</code>.
      </Alert>
    )
  }

  return <InteractiveMap schools={schools} meta={meta} />
}
