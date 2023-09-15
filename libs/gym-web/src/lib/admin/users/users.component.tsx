'use client'
import {Container} from './users.styles'
import {UsersContent} from '@memba-nx/shared'

interface UsersProps {
  content: UsersContent
}

export const Users = (props: UsersProps) => {
  const {content} = props
  return <Container>{content.heading}</Container>
}
