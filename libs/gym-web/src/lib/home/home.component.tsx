'use client'
import React from 'react'

import {HomeContent} from '@memba-nx/shared'

import {Container} from './home.styles'

interface HomeProps {
  content: HomeContent
}

export const Home: React.FC<HomeProps> = (props) => {
  const {content} = props
  return <Container>{content.heading}</Container>
}
