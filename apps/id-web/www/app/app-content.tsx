import React, {useEffect, useState} from 'react'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'

import {
  useAuth,
  useSafeAsync,
  PAGE_ROUTES,
  Env,
  readFromEnv,
  useMembaDetails,
} from '@memba-nx/shared'
import {Loading, TitleBar} from '@memba-labs/design-system'

import {AuthenticatedContainer, UnauthenticatedContainer} from './app.styles'

interface AppContentProps {
  children: React.ReactNode
}

export const AppContent: React.FC<AppContentProps> = (props) => {
  const {children} = props
  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(true)
  const {refreshUserSession, signUserOut, state} = useAuth()
  const {run, isLoading, isSuccess} = useSafeAsync()
  const router = useRouter()
  const searchParams = useSearchParams()
  const {getTenantUser, getUser, user} = useMembaDetails()
  const redirectUrl = searchParams.get('redirectUrl')
  const pathName = usePathname()

  const handleGetUser = async () => {
    if (state.user?.emailAddress) {
      if (state.user.isTenantAdmin) await getTenantUser(state.user?.emailAddress || '')
      else await getUser(state.user?.emailAddress || '')
    }
  }
  const runRefreshUserSession = async () => {
    await run(refreshUserSession())
  }

  useEffect(() => {
    if (state.isAuthenticated) {
      handleGetUser().finally(() => setIsLocalLoading(false))
    } else setIsLocalLoading(false)
  }, [state.isAuthenticated])

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
        console.log({redirectUrl})
        router.push(redirectUrl)
        return
      }

      router.push(readFromEnv(Env.startApp))
    }
  }, [pathName, state.isAuthenticated])

  console.log('ID NEW 2')

  if (state.isAuthenticating || isLoading || isLocalLoading) return <Loading />

  if (isSuccess && !state.isAuthenticated)
    return <UnauthenticatedContainer>{children}</UnauthenticatedContainer>

  return (
    <>
      <TitleBar signUserOut={signUserOut} user={user} isLoading={isLocalLoading} />
      <AuthenticatedContainer>{children}</AuthenticatedContainer>
    </>
  )
}
