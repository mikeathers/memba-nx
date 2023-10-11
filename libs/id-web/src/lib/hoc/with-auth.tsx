'use client'
import {useRouter} from 'next/navigation'
import {PAGE_ROUTES, useAuth, useMembaDetails} from '@memba-nx/shared'
import React, {ComponentPropsWithRef, useEffect, useState} from 'react'
import {Loading} from '@memba-labs/design-system'
import {NextComponentType} from 'next'

export function WithAuth<T>(Component: React.FC<T>): {
  (props: ComponentPropsWithRef<NextComponentType> & T): React.ReactNode | null
  displayName: string | undefined
} {
  const WithAuthComponent = (props: ComponentPropsWithRef<NextComponentType> & T) => {
    const router = useRouter()
    const {state} = useAuth()

    useEffect(() => {
      if (!state.isAuthenticated) router.push(PAGE_ROUTES.LOGIN)
    }, [])

    return <Component {...props} />
  }

  WithAuthComponent.displayName = Component.displayName
  return WithAuthComponent
}
