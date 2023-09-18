import {Meta, StoryObj} from '@storybook/react'
import {Text, TextProps} from './text.component'
import React from 'react'
import {StorybookWrapper} from '../../utils'
import styled from 'styled-components'

const TextContainer = styled.div`
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
        <TextContainer>
          <Text type={'hero'}>Hero - The quick brown fox.</Text>
        </TextContainer>
        <TextContainer>
          <Text type={'h1'}>H1 - The quick brown fox.</Text>
        </TextContainer>
        <TextContainer>
          <Text type={'h2'}>H2 - The quick brown fox.</Text>
        </TextContainer>
        <TextContainer>
          <Text type={'h3'}>H3 - The quick brown fox.</Text>
        </TextContainer>
        <TextContainer>
          <Text type={'h4'}>H4 - The quick brown fox.</Text>
        </TextContainer>
        <TextContainer>
          <Text type={'body'}>Body - The quick brown fox.</Text>
        </TextContainer>
        <TextContainer>
          <Text type={'body-bold'}>Body bold -The quick brown fox.</Text>
        </TextContainer>
        <TextContainer>
          <Text type={'body'} $faded>
            Body faded -The quick brown fox.
          </Text>
        </TextContainer>
        <TextContainer>
          <Text type={'body-small'}>Body small - The quick brown fox.</Text>
        </TextContainer>
        <TextContainer>
          <Text type={'body'} color={'blues800'}>
            Body coloured - The quick brown fox.
          </Text>
        </TextContainer>
        <TextContainer>
          <Text type={'body'} $marginTop={'space6x'}>
            Body with spacing - The quick brown fox.
          </Text>
        </TextContainer>
        <TextContainer>
          <Text type={'body'} $marginTop={'space6x'} fontSize={'60px'}>
            Body custom size - The quick brown fox.
          </Text>
        </TextContainer>
      </>
    )
  },
}
