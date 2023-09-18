'use client'
import React from 'react'
import {AdminHome, Home} from '@memba-nx/gym-web'
import {adminHomeContent, homeContent, useMembaDetails} from '@memba-nx/shared'
import {Loading} from '@memba-labs/design-system'

const HomePage: React.FC = () => {
  const {user} = useMembaDetails()

  if (!user) return <Loading />

  if (user?.isTenantAdmin) return <AdminHome content={adminHomeContent} />

  return <Home content={homeContent} />
}

export default HomePage
