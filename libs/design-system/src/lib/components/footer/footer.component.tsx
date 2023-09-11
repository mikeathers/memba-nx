import React from 'react'
import {sharedContent} from '@memba-nx/shared'
import {Text} from '../text'
import {Container} from './footer.styles'

export const Footer: React.FC = () => {
  return (
    <Container>
      <Text type={'body-faded'}>{sharedContent.allRightsReserved}</Text>
    </Container>
  )
}
