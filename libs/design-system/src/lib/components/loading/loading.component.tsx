import React from 'react'

import {Text} from '../text'
import {LoadingSpinner} from '../loading-spinner'
import {colorTokens, spacingTokens} from '../../styles'

import {Container, LoadingContainer} from './loading.styles'

interface LoadingProps {
  message?: string
}

export const Loading = (props: LoadingProps) => {
  const {message} = props

  return (
    <Container>
      <LoadingContainer>
        <Text type={'h3'}>{message || 'Loading'}</Text>
        <LoadingSpinner size={40} />
      </LoadingContainer>
    </Container>
  )
}
