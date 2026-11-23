import { useEffect, useState } from 'react'
import { SCHOOLS_DATA_URL } from '../config'

/**
 * Fetches school locations from `public/data/schools.json` (may be empty).
 *
 * Returns `{ status: 'loading' | 'success' | 'error', schools, error }`.
 * Aborts in-flight requests on unmount / URL change so a slow response
 * cannot overwrite newer state after the user leaves the page.
 */
export function useSchoolsData(url = SCHOOLS_DATA_URL) {
  const [state, setState] = useState({ status: 'loading', schools: [], error: null })

  useEffect(() => {
    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Schools data request failed (${response.status})`)
        return response.json()
      })
      .then((file) => {
        // File shape: { meta, schools: [{ id, name, detail, county, coords }] }
        setState({ status: 'success', schools: file.schools ?? [], error: null })
      })
      .catch((error) => {
        // AbortError is expected when the effect cleans up — ignore it.
        if (error.name === 'AbortError') return
        setState({ status: 'error', schools: [], error })
      })

    return () => controller.abort()
  }, [url])

  return state
}
