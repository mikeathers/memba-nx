'use client'
import React, {useEffect, useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'

import {
  useAuth,
  useSafeAsync,
  getItemFromLocalStorage,
  PAGE_ROUTES,
  TEMP_LOCAL_STORAGE_PWD_KEY,
  Env,
  readFromEnv,
} from '@memba-nx/shared'
import {Loading} from '@memba-labs/design-system'

import {Container} from './complete-sign-up.styles'

export const CompleteSignUp: React.FC = () => {
  const {run, isSuccess, error, isLoading} = useSafeAsync()
  const {completeRegistration, signUserIn, state} = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [localLoading, setLocalLoading] = useState<boolean>(true)
  const [signUserInSubmitted, setSignUserInSubmitted] = useState<boolean>(false)

  const code = searchParams?.get('code')
  const emailAddress = searchParams?.get('emailAddress')

  useEffect(() => {
    if (state.isAuthenticated) {
      router.push(readFromEnv(Env.startApp))
    }
  }, [state.isAuthenticated])

  const handleSubmitOnLoad = async () => {
    if (emailAddress && code) {
      await run(completeRegistration({emailAddress, code}))
    }
  }

  const handleSignIn = async () => {
    try {
      setSignUserInSubmitted(true)
      if (emailAddress) {
        const password = getItemFromLocalStorage<string>(TEMP_LOCAL_STORAGE_PWD_KEY)
        if (password) {
          const user = await run(signUserIn({emailAddress, password}))
          if (user) {
            router.push(readFromEnv(Env.startApp))
          } else {
            router.push(PAGE_ROUTES.LOGIN)
          }
        } else {
          setLocalLoading(false)
          router.push(PAGE_ROUTES.LOGIN)
        }
      }
    } catch {
      router.push(PAGE_ROUTES.LOGIN)
    }
  }

  useEffect(() => {
    if (isSuccess && !signUserInSubmitted) {
      handleSignIn()
    }
  }, [isSuccess])

  useEffect(() => {
    handleSubmitOnLoad()
  }, [])

  useEffect(() => {
    if (error) {
      setLocalLoading(false)
      router.push(PAGE_ROUTES.LOGIN)
    }
  }, [error])

  if ((localLoading || isLoading) && !error) {
    return <Loading />
  }

  return <Container>Complete sign up</Container>
}
