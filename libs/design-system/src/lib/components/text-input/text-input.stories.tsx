import {StoryObj, Meta} from '@storybook/react'

import {TextInput} from './text-input.component'
import {StorybookWrapper} from '../../utils'

const Story: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  decorators: [
    (Story: React.FC) => (
      <StorybookWrapper width={'extra-small'}>
        <Story />
      </StorybookWrapper>
    ),
  ],
}

export default Story

export const Primary: StoryObj<typeof TextInput> = {
  render: () => <TextInput label={'First name:'} />,
}

export const NoLabel: StoryObj<typeof TextInput> = {
  render: () => <TextInput />,
}

export const Error: StoryObj<typeof TextInput> = {
  render: () => <TextInput label={'First name:'} error={'Something has happened.'} />,
}

export const SecureText: StoryObj<typeof TextInput> = {
  render: () => <TextInput type={'password'} label={'Password:'} />,
}
