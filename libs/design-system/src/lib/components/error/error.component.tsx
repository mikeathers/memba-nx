import Link from 'next/link'

import {sharedContent} from '@memba-nx/shared'
import {Text} from '../text'
import {Footer} from '../footer'
import {Container} from './error.styles'

export const Error = () => {
  return (
    <>
      <Container>
        <Text type={'h1'} $marginBottom={'space2x'}>
          {sharedContent.somethingWentWrong}
        </Text>
        <Link href={'/'}>
          <Text type={'body'} color={'blues800'}>
            {sharedContent.goHome}
          </Text>

          <Text type={'body'} color={'blues800'}>
            {sharedContent.getInTouch}
          </Text>
        </Link>
      </Container>
      <Footer />
    </>
  )
}
