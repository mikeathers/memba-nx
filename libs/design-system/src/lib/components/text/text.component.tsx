import React from 'react'

import type {StyledTextProps} from './text.styles'
import {Body, BodyBold, BodySmall, H1, H2, H3, H4, Hero} from './text.styles'

export interface TextProps extends StyledTextProps {
  type: 'hero' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-bold' | 'body-small'
  children: React.ReactNode | undefined
}

export const Text = (props: TextProps) => {
  const {type, children, ...rest} = props
  if (type === 'hero') {
    return <Hero {...rest}>{children}</Hero>
  }

  if (type === 'h1') {
    return <H1 {...rest}>{children}</H1>
  }

  if (type === 'h2') {
    return <H2 {...rest}>{children}</H2>
  }

  if (type === 'h3') {
    return <H3 {...rest}>{children}</H3>
  }

  if (type === 'h4') {
    return <H4 {...rest}>{children}</H4>
  }

  if (type === 'body') {
    return <Body {...rest}>{children}</Body>
  }

  if (type === 'body-bold') {
    return <BodyBold {...rest}>{children}</BodyBold>
  }

  if (type === 'body-small') {
    return <BodySmall {...rest}>{children}</BodySmall>
  }

  return null
}
