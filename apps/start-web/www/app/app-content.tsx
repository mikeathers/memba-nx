import React, {useEffect, useState} from 'react'
import {useRouter, usePathname} from 'next/navigation'

import {useAuth, useMembaDetails, Env, readFromEnv, PAGE_ROUTES} from '@memba-nx/shared'
import {Loading, TitleBar} from '@memba-labs/design-system'

import {Container} from './app.styles'

interface AppContentProps {
  children: React.ReactNode
}

export const AppContent: React.FC<AppContentProps> = (props) => {
  const {children} = props
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const {refreshUserSession, signUserOut, state} = useAuth()
  const router = useRouter()
  const {getTenantUser, getUser, user} = useMembaDetails()
  const pathName = usePathname()

  const handleGetUser = async () => {
    if (state.user?.emailAddress) {
      if (state.user.isTenantAdmin) await getTenantUser(state.user?.emailAddress || '')
      else await getUser(state.user?.emailAddress || '')
    }
  }

  const handleRoutes = () => {
    const protectedAdminRoutes = ['/apps']
    const adminPathIsProtected = protectedAdminRoutes.indexOf(pathName) !== -1

    const protectedMemberRoutes = ['/memberships']
    const memberPathIsProtected = protectedMemberRoutes.indexOf(pathName) !== -1

    console.log({memberPathIsProtected, adminPathIsProtected, user})

    if (!state.isAuthenticated) return
    if (!user) return

    if (pathName === '/') {
      handleRedirect()
      return
    }

    if (
      (!user?.isTenantAdmin && adminPathIsProtected) ||
      (user?.isTenantAdmin && memberPathIsProtected)
    ) {
      handleRedirect()
      return
    }

    router.push(pathName)
  }

  const handleUnauthenticated = () => {
    if (!state.isAuthenticating && !state.isAuthenticated) {
      router.push(readFromEnv(Env.idApp))
    }
  }

  const handleRedirect = () => {
    if (user?.isTenantAdmin && pathName !== PAGE_ROUTES.APPS) {
      router.push(PAGE_ROUTES.APPS)
      return
    }
    if (!user?.isTenantAdmin && pathName !== PAGE_ROUTES.MEMBERSHIPS) {
      router.push(PAGE_ROUTES.MEMBERSHIPS)
      return
    }
  }

  useEffect(() => {
    refreshUserSession()
  }, [])

  useEffect(() => {
    if (state.isAuthenticated) {
      handleGetUser().finally(() => setIsLoading(false))
    }
  }, [state.isAuthenticated])

  useEffect(() => {
    handleRoutes()
  }, [pathName, user?.isTenantAdmin])

  useEffect(() => {
    handleUnauthenticated()
  }, [state.isAuthenticating, state.isAuthenticated])

  // useEffect(() => {
  //   handleRedirect()
  // }, [user, pathName])

  return (
    <>
      <TitleBar signUserOut={signUserOut} isLoading={isLoading} user={user} />
      {isLoading ? <Loading /> : <Container>{children}</Container>}
    </>
  )
}
