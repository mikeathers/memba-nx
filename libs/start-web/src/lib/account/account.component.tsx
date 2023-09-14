'use client'
import {Container} from './account.styles'
import {Text} from '@memba-labs/design-system'
import {AccountContent} from '@memba-nx/shared'

interface AccountProps {
  content: AccountContent
}
export const Account = (props: AccountProps) => {
  const {content} = props
  return (
    <Container>
      <Text type={'h3'}>{content.heading}</Text>
    </Container>
  )
}
