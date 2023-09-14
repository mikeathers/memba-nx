import React from 'react'
import {StoryObj, Meta} from '@storybook/react'
import {AuthProvider, MembaApp, Tenant, UserMembership} from '@memba-nx/shared'
import {TitleBar, TitleBarProps} from './title-bar.component'
import {noop} from 'lodash'

const Story: Meta<typeof TitleBar> = {
  title: 'Components/TitleBar',
  component: TitleBar,
  decorators: [
    (Story: React.FC) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
}
export default Story

const app: MembaApp = {
  name: '',
  memberships: [{name: '', price: 0}],
  id: '',
  url: '',
  tier: '',
  type: 'gym-management',
  tenantId: '',
  groupName: '',
  users: [],
}
const tenant: Tenant = {
  id: '',
  admins: [],
  apps: [app],
}

const userMembership: UserMembership = {
  name: '',
  id: '',
  url: '',
  type: 'gym-management',
}
const user = {
  authenticatedUserId: '',
  emailAddress: 'joe.bloggs@gmail.com',
  firstName: 'Joe',
  lastName: 'Bloggs',
  id: '',
  groupName: '',
  isTenantAdmin: false,
  isMembaAdmin: false,
  tenantId: '',
  tenant: tenant,
  appId: '',
  signUpRedirectUrl: '',
  memberships: [userMembership],
}
const defaultProps: TitleBarProps = {
  signUserOut: () => noop(),
  isLoading: false,
  user: user,
}
export const Primary: StoryObj<typeof TitleBar> = {
  render: () => <TitleBar {...defaultProps} />,
}
