'use client'
import {Text} from '@memba-labs/design-system'
import {
  Env,
  MembershipsContent,
  PAGE_ROUTES,
  readFromEnv,
  useMembaDetails,
} from '@memba-nx/shared'

import {Container, MembershipTile, YourMembershipsContainer} from './memberships.styles'
import {useRouter} from 'next/navigation'
import {WithMember} from '../hoc'

interface MembershipsProps {
  content: MembershipsContent
}

const Memberships = (props: MembershipsProps) => {
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

  const hasMemberships = user?.memberships && user?.memberships.length > 0

  return (
    <Container>
      <Text type={'h3'}>{content.heading}</Text>
      <YourMembershipsContainer>
        {hasMemberships &&
          user?.memberships.map((membership) => (
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

export default WithMember(Memberships)
