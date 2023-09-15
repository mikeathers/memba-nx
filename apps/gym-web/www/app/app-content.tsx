import React, {useEffect, useState} from 'react'
import {usePathname, useRouter} from 'next/navigation'

import {Loading, TitleBar} from '@memba-labs/design-system'
import {
  useAuth,
  useMembaDetails,
  readFromEnv,
  Env,
  MembaApp,
  menuBarContent,
  PAGE_ROUTES,
} from '@memba-nx/shared'

import {Container} from './app.styles'

interface AppContentProps {
  children: React.ReactNode
}

export const AppContent: React.FC<AppContentProps> = (props) => {
  const {children} = props
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [sessionRefreshed, setSessionRefreshed] = useState<boolean>(false)
  const {refreshUserSession, state, signUserOut} = useAuth()
  const router = useRouter()
  const {getTenantUser, getUser, user} = useMembaDetails()
  const [appName, setAppName] = useState<string>('')
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

  const handleGetAppName = () => {
    const tenant = user?.tenant?.apps.find(
      (item: MembaApp) => item.type === 'gym-management',
    )
    const appName = tenant?.name

    const gymMembership = user?.memberships?.find((m) => m.type === 'gym-management')

    setAppName(appName || gymMembership?.name || 'Memba')
  }

  const handleUnauthenticated = () => {
    if (!state.isAuthenticating && !state.isAuthenticated) {
      router.push(readFromEnv(Env.idApp))
    }
  }

  const handleAuthenticatedRoutes = () => {
    const protectedRoutes = ['/admin/home']
    const pathIsProtected = protectedRoutes.indexOf(pathName) !== -1

    if (!state.user?.isTenantAdmin && pathIsProtected) {
      router.push(PAGE_ROUTES.MEMBERSHIPS)
      return
    } else {
      router.push(pathName)
    }
  }

  const handleRedirect = () => {
    console.log({pathName, user})
    if (pathName === '/' && user?.isTenantAdmin) {
      router.push(PAGE_ROUTES.ADMIN.HOME)
    }
  }

  useEffect(() => {
    handleGetUser().finally(() => setIsLoading(false))
  }, [state.user])

  useEffect(() => {
    handleGetAppName()
  }, [user])

  useEffect(() => {
    handleAuthenticatedRoutes()
    handleRedirect()
  }, [pathName, user])

  useEffect(() => {
    handleUnauthenticated()
  }, [state.isAuthenticating, state.isAuthenticated])

  // useEffect(() => {
  //   const protectedRoutes = ['/']
  //   const pathIsProtected = protectedRoutes.indexOf(pathName) !== -1
  //
  //   if (!state.isAuthenticating && !state.isAuthenticated && pathIsProtected) {
  //     router.push(readFromEnv(Env.idApp))
  //     return
  //   }
  //
  //   if (state.isAuthenticated && !pathIsProtected) {
  //     router.push(PAGE_ROUTES.HOME)
  //     return
  //   }
  // }, [pathName, state.isAuthenticated, state.isAuthenticating])

  // useEffect(() => {
  //   if (pathName === '/') {
  //     if (state.isAuthenticated) {
  //       router.push(PAGE_ROUTES.HOME)
  //     } else router.push(readFromEnv(Env.idApp))
  //   }
  // }, [state])

  if (isLoading || !state.user) return <Loading />

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
