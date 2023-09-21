'use client'
import {useRouter} from 'next/navigation'
import {PAGE_ROUTES, useMembaDetails} from '@memba-nx/shared'
import React, {ComponentPropsWithRef, useEffect} from 'react'
import {NextComponentType} from 'next'

export function WithMember<T>(Component: React.FC<T>): {
  (props: ComponentPropsWithRef<NextComponentType> & T): React.ReactNode | null
  displayName: string | undefined
} {
  const MemberComponent = (props: ComponentPropsWithRef<NextComponentType> & T) => {
    const router = useRouter()
    const {user} = useMembaDetails()

    useEffect(() => {
      if (!user) return

      if (user.isTenantAdmin) router.push(PAGE_ROUTES.APPS)
    }, [])

    return <Component {...props} />
  }

  MemberComponent.displayName = Component.displayName
  return MemberComponent
}
