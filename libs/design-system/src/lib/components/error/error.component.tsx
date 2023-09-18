import {sharedContent} from '@memba-nx/shared'
import {Text} from '../text'
import {Footer} from '../footer'
import {Container} from './error.styles'
import {NextLink} from '../next-link'

export const Error = () => {
  return (
    <>
      <Container>
        <Text type={'h1'} $marginBottom={'space2x'}>
          {sharedContent.somethingWentWrong}
        </Text>
        <NextLink href={'/'} color={'blues800'}>
          {sharedContent.goHome}
        </NextLink>
      </Container>
      <Footer />
    </>
  )
}
