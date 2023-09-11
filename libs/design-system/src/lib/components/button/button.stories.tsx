import React from 'react'
import {StoryObj, Meta} from '@storybook/react'

import {Button} from './button.component'
import {StorybookWrapper} from '../../utils'

const Story: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  decorators: [
    (Story: React.FC) => (
      <StorybookWrapper>
        <Story />
      </StorybookWrapper>
    ),
  ],
}

export default Story

export const Primary: StoryObj<typeof Button> = {
  render: () => <Button variant={'primary'}>Click me!</Button>,
}

export const Secondary: StoryObj<typeof Button> = {
  render: () => <Button variant={'secondary'}>Click me!</Button>,
}

export const Text: StoryObj<typeof Button> = {
  render: () => <Button variant={'text'}>Click me!</Button>,
}

export const Loading: StoryObj<typeof Button> = {
  render: () => (
    <Button variant={'primary'} $isLoading={true}>
      Click me!
    </Button>
  ),
}

export const Disabled: StoryObj<typeof Button> = {
  render: () => (
    <Button variant={'primary'} $isDisabled={true}>
      Click me!
    </Button>
  ),
}
