import { Container, Typography } from '@mui/material'
import ExploreMap from '../features/explore-map/ExploreMap'
import './page-styles/Main.css'

/**
 * “Explore Map” page section.
 * `id="explore-map"` matches the sticky nav hash link in NavBar.
 */
export default function Main() {
  return (
    <div className="explore-map">
      <section id="explore-map" aria-labelledby="explore-map-heading">
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography id="explore-map-heading" component="h2" variant="h4" gutterBottom>
            Explore Map
          </Typography>
          <ExploreMap />
        </Container>
      </section>
    </div>
  )
}
