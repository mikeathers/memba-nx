'use client'
import React, {useEffect} from 'react'
import {useRouter} from 'next/navigation'

import {
  useSafeAsync,
  useMembaDetails,
  AppsContent,
  PAGE_ROUTES,
  readFromEnv,
  Env,
} from '@memba-nx/shared'
import {Loading, Text} from '@memba-labs/design-system'

import DumbbellSvg from './assets/dumbbell.svg'

import {Container, AppTile, YourAppsContainer} from './apps.styles'
import {read} from 'open-next/assets/sharp-node-modules/ieee754'
import Link from 'next/link'

interface AppsProps {
  content: AppsContent
}

export const Apps: React.FC<AppsProps> = (props) => {
  const {content} = props
  const {user} = useMembaDetails()
  const router = useRouter()

  const openApp = (url: string) => {
    if (process.env.NEXT_PUBLIC_STAGE_NAME === 'local') {
      router.push(readFromEnv(Env.gymApp))
      return
    }

    if (url) {
      window.location.href = url
      return
    }
    window.location.href = PAGE_ROUTES.GYM_MANAGEMENT
  }

  const apps = user?.tenant.apps

  return (
    <Container>
      <Text type={'h3'}>{content.heading}</Text>
      <YourAppsContainer>
        {apps && apps.length > 0 ? (
          user?.tenant.apps.map((app) => (
            <AppTile key={app.name} onClick={() => openApp(app.url)}>
              <Text type={'body'}>{app.name}</Text>
            </AppTile>
          ))
        ) : (
          <>
            <Text type={'body'}>{content.noAppsMessage}</Text>
            <Link href={PAGE_ROUTES.GYM_MANAGEMENT}>
              <Text type={'body'}>{content.addAppMessage}</Text>
            </Link>
          </>
        )}
      </YourAppsContainer>
    </Container>
  )
}
