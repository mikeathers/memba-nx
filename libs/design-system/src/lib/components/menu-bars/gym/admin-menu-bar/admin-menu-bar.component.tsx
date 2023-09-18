import {Container} from './admin-menu-bar.styles'
import Link from 'next/link'
import {Text} from '../../../text'
import {MenuBarContent, PAGE_ROUTES} from '@memba-nx/shared'

interface AdminMenuBarProps {
  content: MenuBarContent
}

export const AdminMenuBar = (props: AdminMenuBarProps) => {
  const {content} = props
  return (
    <Container>
      <Link href={PAGE_ROUTES.ADMIN.HOME}>
        <Text type={'body'} color={'blues800'}>
          {content.admin.home}
        </Text>
      </Link>
      <Link href={PAGE_ROUTES.ADMIN.USERS}>
        <Text type={'body'} color={'blues800'}>
          {content.admin.users}
        </Text>
      </Link>
    </Container>
  )
}
