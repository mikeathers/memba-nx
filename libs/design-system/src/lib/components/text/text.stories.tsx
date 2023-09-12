import {Meta, StoryObj} from '@storybook/react'
import {Text} from './text.component'
import React from 'react'
import {StorybookWrapper} from '../../utils'
import styled from 'styled-components'

const PaddedText = styled(Text)`
  margin-bottom: 28px;
`
const Story: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  decorators: [
    (Story: React.FC) => (
      <StorybookWrapper>
        <Story />
      </StorybookWrapper>
    ),
  ],
}

export default Story

export const Primary: StoryObj<typeof Text> = {
  render: () => {
    return (
      <>
        <PaddedText type={'hero'}>Hero - The quick brown fox.</PaddedText>
        <PaddedText type={'h1'}>H1 - The quick brown fox.</PaddedText>
        <PaddedText type={'h2'}>H2 - The quick brown fox.</PaddedText>
        <PaddedText type={'h3'}>H3 - The quick brown fox.</PaddedText>
        <PaddedText type={'h4'}>H4 - The quick brown fox.</PaddedText>
        <PaddedText type={'body'}>Body - The quick brown fox.</PaddedText>
        <PaddedText type={'body-bold'}>Body bold -The quick brown fox.</PaddedText>
        <PaddedText type={'body'} $faded>
          Body faded -The quick brown fox.
        </PaddedText>
        <PaddedText type={'body-small'}>Body small - The quick brown fox.</PaddedText>
      </>
    )
  },
}
