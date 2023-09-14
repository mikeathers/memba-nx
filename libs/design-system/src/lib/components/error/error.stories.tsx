import {Meta, StoryObj} from '@storybook/react'
import {Error} from './error.component'

const Story: Meta<typeof Error> = {
  title: 'Components/Error',
  component: Error,
}

export default Story

export const Primary: StoryObj<typeof Error> = {
  render: () => <Error />,
}
