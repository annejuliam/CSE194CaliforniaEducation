import { useEffect, useState } from 'react'
import { SCHOOLS_DATA_URL } from '../config'

/**
 * Loads joined school records from `public/data/schools.json`.
 * Returns `{ status, schools, meta, error }`.
 */
export function useSchoolsData(url = SCHOOLS_DATA_URL) {
  const [state, setState] = useState({
    status: 'loading',
    schools: [],
    meta: null,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Schools data request failed (${response.status})`)
        return response.json()
      })
      .then((file) => {
        setState({
          status: 'success',
          schools: file.schools ?? [],
          meta: file.meta ?? null,
          error: null,
        })
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        setState({ status: 'error', schools: [], meta: null, error })
      })

    return () => controller.abort()
  }, [url])

  return state
}
