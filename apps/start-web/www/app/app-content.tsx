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

  const handleUnauthenticated = () => {
    if (!state.isAuthenticating && !state.isAuthenticated) {
      router.push(readFromEnv(Env.idApp))
    }
  }

  const handleRedirect = () => {
    if (!user) return
    if (pathName === '/') {
      if (user?.isTenantAdmin && pathName !== PAGE_ROUTES.APPS) {
        router.push(PAGE_ROUTES.APPS)
        return
      }
      if (!user?.isTenantAdmin && pathName !== PAGE_ROUTES.MEMBERSHIPS) {
        router.push(PAGE_ROUTES.MEMBERSHIPS)
        return
      }
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
    handleUnauthenticated()
  }, [state.isAuthenticating, state.isAuthenticated])

  useEffect(() => {
    handleRedirect()
  }, [user, pathName])

  console.log('NEW START 2')

  if (isLoading) return <Loading />

  return (
    <>
      <TitleBar signUserOut={signUserOut} isLoading={isLoading} user={user} />
      <Container>{children}</Container>
    </>
  )
}
