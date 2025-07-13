import { useEffect, useState } from 'react'
import api from '../lib/api'

export function useAuth(redirectIfUnauthenticated = true) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/users/profile')
      .then((res) => setUser(res.data))
      .catch(() => {
        if (redirectIfUnauthenticated) window.location.href = '/login'
      })
      .finally(() => setLoading(false))
  }, [])

  return { user, loading }
}
