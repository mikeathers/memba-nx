import React, {useEffect, useState} from 'react'
import {MembaApp} from '@memba-nx/shared'

import {colorTokens} from '../../styles'
import {Text} from '../text'

import {Container, Content, FormContainer, TitleContainer} from './center-box.styles'

interface CenterBoxProps {
  children: React.ReactNode
  app: MembaApp
  getApp: () => Promise<MembaApp | null>
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
          <Text type={'body-faded'} color={colorTokens.neutrals500}>
            {gymName && 'Powered by Memba'}
          </Text>
        </TitleContainer>
        <FormContainer>{children}</FormContainer>
      </Content>
    </Container>
  )
}
