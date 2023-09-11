import React from 'react'
import {StoryObj, Meta} from '@storybook/react'

import {PricingCard} from './pricing.card.component'

import {StorybookWrapper} from '../../utils'
import {noop} from 'lodash'

const Story: Meta<typeof PricingCard> = {
  title: 'Components/PricingCard',
  component: PricingCard,
  decorators: [
    (Story: React.FC) => (
      <StorybookWrapper>
        <Story />
      </StorybookWrapper>
    ),
  ],
}

export default Story

export const Primary: StoryObj<typeof PricingCard> = {
  render: () => (
    <PricingCard
      pricePerMonth={'£00.00/pm'}
      findOutMore={'Find out more'}
      findOutMoreClick={() => noop()}
      selectClick={() => noop()}
      numberOfCustomers={'Up to 5 customers'}
      titleNumber={'#01'}
      titleText={'Free'}
      transactionalCosts={'We will charge you 1% per transaction you make within the app'}
      selected={false}
      select={'Select'}
      selectedText={'Selected'}
    />
  ),
}

export const Selected: StoryObj<typeof PricingCard> = {
  render: () => (
    <PricingCard
      pricePerMonth={'£0.00/pm'}
      findOutMore={'Find out more'}
      findOutMoreClick={() => noop()}
      selectClick={() => noop()}
      numberOfCustomers={'Up to 5 customers'}
      titleNumber={'#01'}
      titleText={'Free'}
      transactionalCosts={'We will charge you 1% per transaction you make within the app'}
      selected={true}
      select={'Select'}
      selectedText={'Selected'}
    />
  ),
}
