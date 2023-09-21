import styled from 'styled-components'

import {
  colors,
  fontSizes,
  fontWeights,
  letterSpacing,
  lineHeights,
  mediaQueries,
} from '../../styles'
import {baseStyles, StyledTextProps} from '../../utils'

export const Hero = styled.h1<StyledTextProps>`
  font-weight: ${fontWeights.semibold};
  font-size: ${fontSizes.xxxl};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
  letter-spacing: ${letterSpacing.title};
  ${baseStyles};
`

export const H1 = styled.h1<StyledTextProps>`
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.xxl};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
  letter-spacing: ${letterSpacing.title};
  line-height: ${lineHeights.large};
  ${baseStyles};

  @media (${mediaQueries.s}) {
    font-size: ${fontSizes.xxl};
  }
`
export const H2 = styled.h2<StyledTextProps>`
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.xl};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
  letter-spacing: ${letterSpacing.title};
  line-height: ${lineHeights.large};
  ${baseStyles};
`

export const H3 = styled.h3<StyledTextProps>`
  font-weight: ${fontWeights.medium};
  font-size: ${fontSizes.l};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
  line-height: ${lineHeights.medium};
  ${baseStyles};
`

export const H4 = styled.h4<StyledTextProps>`
  font-weight: ${fontWeights.medium};
  font-size: ${fontSizes.m};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
  line-height: ${lineHeights.medium};
  ${baseStyles};
`

export const Body = styled.p<StyledTextProps>`
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.s};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
  line-height: ${lineHeights.medium};
  ${baseStyles};
`

export const BodyBold = styled(Body)`
  font-weight: ${fontWeights.semibold};
`

export const BodySmall = styled(Body)`
  font-size: ${fontSizes.xs};
`
