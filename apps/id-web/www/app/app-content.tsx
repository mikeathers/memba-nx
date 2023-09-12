import React, {useEffect} from 'react'
import {useRouter} from 'next/navigation'

import {useAuth, useSafeAsync, PAGE_ROUTES, Env, readFromEnv} from '@memba-nx/shared'
import {Loading} from '@memba-labs/design-system'

import {Container} from './app.styles'

interface AppContentProps {
  children: React.ReactNode
}

export const AppContent: React.FC<AppContentProps> = (props) => {
  const {children} = props
  const {refreshUserSession, state} = useAuth()
  const {run, isLoading, isSuccess} = useSafeAsync()
  const router = useRouter()

  const runRefreshUserSession = async () => {
    await run(refreshUserSession())
  }

  // useEffect(() => {
  //   if (!state.isAuthenticating) {
  //     if (!state.isAuthenticated) {
  //       router.push(PAGE_ROUTES.LOGIN)
  //     } else {
  //       router.push(`${readFromEnv(Env.startApp)}`)
  //     }
  //   }
  // }, [state.isAuthenticated])

  useEffect(() => {
    runRefreshUserSession()
  }, [])

  if (state.isAuthenticating || isLoading) return <Loading />

  if (isSuccess) return <Container>{children}</Container>

  return null
}
