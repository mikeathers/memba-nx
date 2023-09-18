'use client'
import {Text} from '@memba-labs/design-system'
import {Env, MembershipsContent, readFromEnv, useMembaDetails} from '@memba-nx/shared'

import {Container, MembershipTile, YourMembershipsContainer} from './memberships.styles'
import {useRouter} from 'next/navigation'

interface MembershipsProps {
  content: MembershipsContent
}

export const Memberships = (props: MembershipsProps) => {
  const {content} = props
  const {user} = useMembaDetails()
  const router = useRouter()

  const openMembership = (url: string) => {
    if (process.env.NEXT_PUBLIC_STAGE_NAME === 'local') {
      router.push(readFromEnv(Env.gymApp))
      return
    }

    if (url) {
      router.push(url)
      return
    }
  }

  return (
    <Container>
      <Text type={'h3'}>{content.heading}</Text>
      <YourMembershipsContainer>
        {user?.memberships.map((membership) => (
          <MembershipTile
            key={membership.name}
            onClick={() => openMembership(membership.url)}
          >
            <Text type={'body'}>{membership.name}</Text>
          </MembershipTile>
        ))}
      </YourMembershipsContainer>
    </Container>
  )
}
