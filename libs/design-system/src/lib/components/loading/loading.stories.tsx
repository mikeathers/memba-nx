import React from 'react'
import {StoryObj, Meta} from '@storybook/react'

import {Loading} from './loading.component'
import {StorybookWrapper} from '../../utils'

const Story: Meta<typeof Loading> = {
  title: 'Components/Loading',
  component: Loading,
  decorators: [
    (Story: React.FC) => (
      <StorybookWrapper>
        <Story />
      </StorybookWrapper>
    ),
  ],
}

export default Story

export const Primary: StoryObj<typeof Loading> = {
  render: () => <Loading />,
}
