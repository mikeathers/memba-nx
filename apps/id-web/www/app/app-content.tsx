import React, {useEffect} from 'react'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'

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
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirectUrl')
  const pathName = usePathname()
  const runRefreshUserSession = async () => {
    await run(refreshUserSession())
  }

  useEffect(() => {
    runRefreshUserSession()
  }, [])

  useEffect(() => {
    if (pathName === '/' && !state.isAuthenticated) {
      router.push(PAGE_ROUTES.LOGIN)
      return
    }

    if (pathName === '/' && state.isAuthenticated) {
      if (redirectUrl) {
        router.push(redirectUrl)
        return
      }

      router.push(readFromEnv(Env.startApp))
    }
  }, [pathName, state.isAuthenticated])

  console.log('ID NEW 2')

  if (state.isAuthenticating || isLoading) return <Loading />

  if (isSuccess) return <Container>{children}</Container>

  return null
}
