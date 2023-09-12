'use client'
import type React from 'react'

import {spacingTokens} from '../../styles'

import {
  Container,
  Content,
  TitleContainer,
  TitleNumber,
  TitleText,
  TransactionalCost,
} from './pricing-card.styles'
import {Text} from '../text'
import {Button} from '../button'

interface PricingCardProps {
  titleNumber: string
  titleText: string
  pricePerMonth: string
  numberOfCustomers: string
  transactionalCosts: string
  findOutMore: string
  select: string
  selectedText: string
  selectClick: () => void
  findOutMoreClick: () => void
  selected: boolean
}

export const PricingCard: React.FC<PricingCardProps> = (props) => {
  const {
    titleNumber,
    titleText,
    pricePerMonth,
    numberOfCustomers,
    transactionalCosts,
    select,
    selectedText,
    selectClick,
    selected,
  } = props
  return (
    <Container selected={selected}>
      <TitleContainer>
        <TitleNumber>{titleNumber}</TitleNumber>
        <TitleText>{titleText}</TitleText>
      </TitleContainer>
      <Content>
        <Text type={'h1'} $marginBottom={'space2x'}>
          {pricePerMonth}
        </Text>
        <TransactionalCost type={'body-small'} $faded>
          {transactionalCosts}
        </TransactionalCost>
        <Text type={'body'} $marginTop={'space2x'} $marginBottom={'space1x'}>
          {numberOfCustomers}
        </Text>
        {/*<Button $marginBottomX={spacingTokens.space10x} variant={'text'}>*/}
        {/*  {findOutMore}*/}
        {/*</Button>*/}
        <Button
          variant={'primary'}
          onClick={selectClick}
          $marginTop={'space10x'}
          $isDisabled={selected}
        >
          {selected ? selectedText : select}
        </Button>
      </Content>
    </Container>
  )
}
