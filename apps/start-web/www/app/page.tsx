'use client'
import {Apps, Memberships} from '@memba-nx/start-web'
import {appsContent, membershipsContent, useMembaDetails} from '@memba-nx/shared'
import React from 'react'
import {Loading} from '@memba-labs/design-system'
const HomePage: React.FC = () => {
  const {user} = useMembaDetails()
  console.log('NEW 2')
  if (!user) return <Loading />
  if (user?.isTenantAdmin) {
    return <Apps content={appsContent} />
  }
  return <Memberships content={membershipsContent} />
}

export default HomePage
