'use client'
import React from 'react'
import {useRouter} from 'next/navigation'

import {
  useMembaDetails,
  AppsContent,
  PAGE_ROUTES,
  readFromEnv,
  Env,
} from '@memba-nx/shared'
import {NextLink, Text} from '@memba-labs/design-system'

import {Container, AppTile, YourAppsContainer, TileContainer} from './apps.styles'

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
  const hasApps = apps && apps.length > 0
  return (
    <Container>
      <Text type={'h3'}>{content.heading}</Text>
      <YourAppsContainer>
        {!hasApps && (
          <>
            <Text type={'body'}>{content.noAppsMessage}</Text>
            <NextLink href={PAGE_ROUTES.GYM_MANAGEMENT}>{content.addAppMessage}</NextLink>
          </>
        )}
        {hasApps && (
          <>
            <TileContainer>
              {apps?.map((app) => (
                <AppTile key={app.name} onClick={() => openApp(app.url)}>
                  <Text type={'body'}>{app.name}</Text>
                </AppTile>
              ))}
            </TileContainer>

            <NextLink href={PAGE_ROUTES.GYM_MANAGEMENT}>
              {content.addAnotherAppMessage}
            </NextLink>
          </>
        )}
      </YourAppsContainer>
    </Container>
  )
}
