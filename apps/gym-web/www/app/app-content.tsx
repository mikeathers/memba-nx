import React, {useEffect, useState} from 'react'
import {usePathname, useRouter} from 'next/navigation'

import {Loading, TitleBar} from '@memba-labs/design-system'
import {useAuth, useMembaDetails, readFromEnv, Env, PAGE_ROUTES} from '@memba-nx/shared'

import {Container} from './app.styles'

interface AppContentProps {
  children: React.ReactNode
}

export const AppContent: React.FC<AppContentProps> = (props) => {
  const {children} = props
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const {refreshUserSession, state, signUserOut} = useAuth()
  const router = useRouter()
  const {getTenantUser, getUser, getApp, user, app} = useMembaDetails()
  const [appName, setAppName] = useState<string>('')
  const pathName = usePathname()

  const handleGetUser = async () => {
    if (state.user?.emailAddress) {
      if (state.user.isTenantAdmin) await getTenantUser(state.user?.emailAddress || '')
      else await getUser(state.user?.emailAddress || '')
    }

    await getApp()
  }

  const handleGetAppName = () => {
    if (!user || !app) return
    setAppName(app.name || 'Memba')
  }

  const handleUnauthenticated = () => {
    if (!state.isAuthenticating && !state.isAuthenticated) {
      router.push(readFromEnv(Env.idApp))
    }
  }

  const handleRedirect = () => {
    if (!user) return
    if (pathName === '/') {
      if (user?.isTenantAdmin && pathName !== PAGE_ROUTES.ADMIN.HOME) {
        router.push(PAGE_ROUTES.ADMIN.HOME)
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
    handleGetAppName()
  }, [app])

  useEffect(() => {
    handleUnauthenticated()
  }, [state.isAuthenticating, state.isAuthenticated])

  useEffect(() => {
    handleRedirect()
  }, [pathName, user])

  console.log('GYM NEW 7')

  if (isLoading) return <Loading />

  return (
    <>
      <TitleBar
        signUserOut={signUserOut}
        isLoading={isLoading}
        user={user}
        appName={appName}
      />
      <Container>{children}</Container>
    </>
  )
}
