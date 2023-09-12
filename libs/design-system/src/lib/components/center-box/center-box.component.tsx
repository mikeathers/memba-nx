'use client'
import React, {useEffect, useState} from 'react'
import {MembaApp} from '@memba-nx/shared'

import {colorTokens, spacingTokens} from '../../styles'
import {Text} from '../text'

import {Container, Content, FormContainer, TitleContainer} from './center-box.styles'

interface CenterBoxProps {
  children: React.ReactNode
  app: MembaApp | null
  getApp: () => Promise<void>
}
export const CenterBox: React.FC<CenterBoxProps> = (props) => {
  const {children, app, getApp} = props

  const [gymName, setGymName] = useState<string>('')

  useEffect(() => {
    if (!app) {
      getApp()
    }
  }, [app])

  useEffect(() => {
    if (app) {
      setGymName(app?.name)
    }
  }, [app])

  return (
    <Container>
      <Content>
        <TitleContainer>
          <Text type={'h1'} color={colorTokens.blues800}>
            {gymName || 'Memba'}
          </Text>
          <Text
            type={'body'}
            $marginTopX={spacingTokens.space1x}
            $faded
            color={colorTokens.neutrals500}
          >
            {gymName && 'Powered by Memba'}
          </Text>
        </TitleContainer>
        <FormContainer>{children}</FormContainer>
      </Content>
    </Container>
  )
}
