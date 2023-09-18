import {Container} from './admin-menu-bar.styles'
import {MenuBarContent, PAGE_ROUTES} from '@memba-nx/shared'
import {NextLink} from '../../../next-link'

interface AdminMenuBarProps {
  content: MenuBarContent
}

export const AdminMenuBar = (props: AdminMenuBarProps) => {
  const {content} = props
  return (
    <Container>
      <NextLink href={PAGE_ROUTES.ADMIN.HOME} color={'blues800'}>
        {content.admin.home}
      </NextLink>
      <NextLink href={PAGE_ROUTES.ADMIN.USERS} color={'blues800'}>
        {content.admin.users}
      </NextLink>
    </Container>
  )
}
