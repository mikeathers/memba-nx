'use client'
import React from 'react'

import {HomeContent, PAGE_ROUTES, useMembaDetails} from '@memba-nx/shared'

import {Container} from './home.styles'
import {useRouter} from 'next/navigation'

interface HomeProps {
  content: HomeContent
}

export const Home: React.FC<HomeProps> = (props) => {
  const {content} = props
  return <Container>{content.heading}</Container>
}
