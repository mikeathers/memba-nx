'use client'
import React from 'react'
import {Text} from '../text'

import {Container, Content, FormContainer, TitleContainer} from './center-box.styles'

interface CenterBoxProps {
  children: React.ReactNode
  gymName?: string | null
}
export const CenterBox: React.FC<CenterBoxProps> = (props) => {
  const {children, gymName} = props

  return (
    <Container>
      <Content>
        <TitleContainer>
          <Text
            type={'h1'}
            color={'blues800'}
            $textAlign={'center'}
            $lineHeight={'large'}
          >
            {gymName || 'Memba'}
          </Text>
          <Text type={'body'} $marginTop={'space1x'} $faded color={'neutrals500'}>
            {gymName && 'Powered by Memba'}
          </Text>
        </TitleContainer>
        <FormContainer>{children}</FormContainer>
      </Content>
    </Container>
  )
}
