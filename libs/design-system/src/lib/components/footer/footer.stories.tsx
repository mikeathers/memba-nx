import React from 'react'
import {StoryObj, Meta} from '@storybook/react'

import {Footer} from './footer.component'
import {StorybookWrapper} from '../../utils'

const Story: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
}

export default Story

export const Primary: StoryObj<typeof Footer> = {
  render: () => <Footer />,
}
