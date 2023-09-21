'use client'
import React from 'react'

import {HomeContent} from '@memba-nx/shared'

import {Container} from './home.styles'
import {WithMember} from '../hoc'

interface HomeProps {
  content: HomeContent
}

const Home: React.FC<HomeProps> = (props) => {
  const {content} = props
  return <Container>{content.heading}</Container>
}

export default WithMember(Home)
