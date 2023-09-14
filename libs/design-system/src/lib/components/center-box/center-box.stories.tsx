import React from 'react'
import {StoryObj, Meta} from '@storybook/react'

import {MembaApp} from '@memba-nx/shared'

import {CenterBox} from './center-box.component'
import {StorybookWrapper} from '../../utils'
import {TextInput} from '../text-input'
import {Button} from '../button'

const Story: Meta<typeof CenterBox> = {
  title: 'Components/CenterBox',
  component: CenterBox,
  decorators: [
    (Story: React.FC) => (
      <StorybookWrapper>
        <Story />
      </StorybookWrapper>
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

export const Primary: StoryObj<typeof CenterBox> = {
  render: () => (
    <CenterBox>
      <>
        <TextInput label={'First name:'} />
        <TextInput label={'Last name:'} />
        <Button $fullWidth={true} $variant={'primary'}>
          Let's go!
        </Button>
      </>
    </CenterBox>
  ),
}

export const WithGymName: StoryObj<typeof CenterBox> = {
  render: () => (
    <CenterBox gymName={'Awesome Gym'}>
      <>
        <TextInput label={'First name:'} />
        <TextInput label={'Last name:'} />
        <Button $fullWidth={true} $variant={'primary'}>
          Let's go!
        </Button>
      </>
    </CenterBox>
  ),
}
