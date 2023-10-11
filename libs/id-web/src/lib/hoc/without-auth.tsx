'use client'
import {usePathname, useRouter} from 'next/navigation'
import {PAGE_ROUTES, useAuth, useMembaDetails} from '@memba-nx/shared'
import React, {ComponentPropsWithRef, useEffect} from 'react'
import {NextComponentType} from 'next'

export function WithoutAuth<T>(Component: React.FC<T>): {
  (props: ComponentPropsWithRef<NextComponentType> & T): React.ReactNode | null
  displayName: string | undefined
} {
  const WithoutAuthComponent = (props: ComponentPropsWithRef<NextComponentType> & T) => {
    const router = useRouter()
    const pathName = usePathname()
    const {state} = useAuth()

    // useEffect(() => {
    //   console.log({pathName})
    //   if ((state.isAuthenticated && pathName !== '/') || pathName !== '/login')
    //     router.push(PAGE_ROUTES.ACCOUNT)
    // }, [])

    return <Component {...props} />
  }

  WithoutAuthComponent.displayName = Component.displayName
  return WithoutAuthComponent
}
