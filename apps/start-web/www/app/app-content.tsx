import React, {useEffect, useState} from 'react'
import {useRouter, usePathname} from 'next/navigation'

import {
  useAuth,
  useSafeAsync,
  useMembaDetails,
  Env,
  readFromEnv,
  PAGE_ROUTES,
} from '@memba-nx/shared'
import {Loading, TitleBar} from '@memba-labs/design-system'

import {Container} from './app.styles'
import {noop} from 'lodash'

interface AppContentProps {
  children: React.ReactNode
}

export const AppContent: React.FC<AppContentProps> = (props) => {
  const {children} = props
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [sessionRefreshed, setSessionRefreshed] = useState<boolean>(false)
  const {refreshUserSession, signUserOut, state} = useAuth()
  const router = useRouter()
  const {getTenantUser, getUser, user} = useMembaDetails()
  const pathName = usePathname()

  const handleGetUser = async () => {
    if (!sessionRefreshed) {
      await refreshUserSession()
      setSessionRefreshed(true)
    }
    if (state.user?.emailAddress) {
      if (state.user.isTenantAdmin) await getTenantUser(state.user?.emailAddress || '')
      else await getUser(state.user?.emailAddress || '')
    }
  }

  const handleAuthenticatedRoutes = () => {
    const protectedRoutes = ['/apps']
    const pathIsProtected = protectedRoutes.indexOf(pathName) !== -1

    if (!state.user?.isTenantAdmin && pathIsProtected) {
      router.push(PAGE_ROUTES.MEMBERSHIPS)
      return
    } else {
      router.push(pathName)
    }
  }

  const handleUnauthenticated = () => {
    if (!state.isAuthenticating && !state.isAuthenticated) {
      router.push(readFromEnv(Env.idApp))
    }
  }

  useEffect(() => {
    handleGetUser().finally(() => setIsLoading(false))
  }, [state.isAuthenticated])

  useEffect(() => {
    handleAuthenticatedRoutes()
  }, [pathName, state.user?.isTenantAdmin])

  useEffect(() => {
    handleUnauthenticated()
  }, [state.isAuthenticating, state.isAuthenticated])

  if (isLoading) return <Loading />

  return (
    <>
      <TitleBar signUserOut={signUserOut} isLoading={isLoading} user={user} />
      <Container>{children}</Container>
    </>
  )
}
