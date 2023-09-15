'use client'
import React from 'react'
import {Home} from '@memba-nx/gym-web'
import {homeContent, PAGE_ROUTES, useMembaDetails} from '@memba-nx/shared'
import {useRouter} from 'next/navigation'

const HomePage: React.FC = () => {
  const {user} = useMembaDetails()
  const router = useRouter()

  if (user?.isTenantAdmin) router.push(PAGE_ROUTES.ADMIN.HOME)

  return <Home content={homeContent} />
}

export default HomePage
