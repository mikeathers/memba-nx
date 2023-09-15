import {Meta, StoryObj} from '@storybook/react'
import {AdminMenuBar} from './admin-menu-bar.component'
import {menuBarContent} from '@memba-nx/shared'
import React from 'react'
import {StorybookWrapper} from '../../../../utils'

const Story: Meta<typeof AdminMenuBar> = {
  title: 'Components/Menu Bars/Gym/Admin',
  component: AdminMenuBar,
  decorators: [
    (Story: React.FC) => (
      <StorybookWrapper width={'small'}>
        <Story />
      </StorybookWrapper>
    ),
  ],
}

export default Story

export const Primary: StoryObj<typeof AdminMenuBar> = {
  render: () => <AdminMenuBar content={menuBarContent} />,
}
