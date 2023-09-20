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
import {Text} from '@memba-labs/design-system'

import {Container, AppTile, YourAppsContainer} from './apps.styles'
import Link from 'next/link'
import {WithAdmin} from '../hoc'

interface AppsProps {
  content: AppsContent
}

const Apps: React.FC<AppsProps> = (props) => {
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

export default WithAdmin(Apps)
