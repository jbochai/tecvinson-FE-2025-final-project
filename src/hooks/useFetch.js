import { useState, useEffect } from 'react'

/**
 * Generic data-fetching hook.
 * Returns { data, loading, error } for any given URL.
 *
 * @param {string|null} url  – pass null to skip the fetch
 * @returns {{ data: any, loading: boolean, error: string|null }}
 */
export function useFetch(url) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(!!url)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!url) return

    let cancelled = false

    setLoading(true)
    setError(null)

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Request failed — ${res.status} ${res.statusText}`)
        return res.json()
      })
      .then(json => {
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message || 'Something went wrong. Please try again.')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return { data, loading, error }
}
