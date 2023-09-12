'use client'
import {useEffect} from 'react'
import {useRouter} from 'next/navigation'

import {useAuth, PAGE_ROUTES, readFromEnv, Env} from '@memba-nx/shared'

export default function Home() {
  const {state} = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!state.isAuthenticating) {
      if (!state.isAuthenticated) {
        router.push(PAGE_ROUTES.LOGIN)
      } else {
        router.push(`${readFromEnv(Env.startApp)}`)
      }
    }
  }, [state.isAuthenticated])

  return null
}
