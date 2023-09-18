import React from 'react'

import {Text} from '../text'
import {LoadingSpinner} from '../loading-spinner'

import {Container, LoadingContainer} from './loading.styles'

export const Loading: React.FC = () => {
  return (
    <Container>
      <LoadingContainer>
        <Text type={'h3'}>Loading</Text>
        <LoadingSpinner size={40} />
      </LoadingContainer>
    </Container>
  )
}
