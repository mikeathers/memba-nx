'use client'
import {useRouter} from 'next/navigation'
import {PAGE_ROUTES, useMembaDetails} from '@memba-nx/shared'
import React, {ComponentPropsWithRef, useEffect, useState} from 'react'
import {Loading} from '@memba-labs/design-system'
import {NextComponentType} from 'next'

export function WithAdmin<T>(Component: React.FC<T>): {
  (props: ComponentPropsWithRef<NextComponentType> & T): React.ReactNode | null
  displayName: string | undefined
} {
  const AdminComponent = (props: ComponentPropsWithRef<NextComponentType> & T) => {
    const router = useRouter()
    const {user} = useMembaDetails()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
      if (!user) return
      if (user) setLoading(false)

      if (!user.isTenantAdmin) router.push(PAGE_ROUTES.MEMBERSHIPS)
    }, [])

    if (loading) return <Loading />
    return <Component {...props} />
  }

  AdminComponent.displayName = Component.displayName
  return AdminComponent
}
