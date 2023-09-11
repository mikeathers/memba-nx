import styled, {css} from 'styled-components'

import type {Colors} from '../../styles'
import {
  colors,
  fonts,
  fontSizes,
  fontWeights,
  letterSpacing,
  lineHeights,
  mediaQueries,
} from '../../styles'
import {MarginsApi, margins} from '../../utils'

export interface StyledTextProps extends MarginsApi {
  color?: keyof Colors
  $textAlign?: 'center'
}

const styledTextAlign = css<StyledTextProps>`
  ${({$textAlign}) => {
    if ($textAlign === 'center') {
      return css`
        text-align: center;
      `
    }
  }}
`

const baseStyles = css<StyledTextProps>`
  ${margins}
  ${styledTextAlign}
  font-family: ${fonts.poppins}
`

export const Hero = styled.h1<StyledTextProps>`
  ${baseStyles};
  font-weight: ${fontWeights.semibold};
  font-size: ${fontSizes.xxxl};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
  letter-spacing: ${letterSpacing.title};
`

export const H1 = styled.h1<StyledTextProps>`
  ${baseStyles};
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.xxl};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
  letter-spacing: ${letterSpacing.title};

  @media (${mediaQueries.s}) {
    font-size: ${fontSizes.xxl};
  }
`
export const H2 = styled.h2<StyledTextProps>`
  ${baseStyles};
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.xl};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
  letter-spacing: ${letterSpacing.title};
`

export const H3 = styled.h3<StyledTextProps>`
  ${baseStyles};
  font-weight: ${fontWeights.medium};
  font-size: ${fontSizes.l};
  line-height: ${lineHeights.large};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
`

export const H4 = styled.h4<StyledTextProps>`
  ${baseStyles};
  font-weight: ${fontWeights.medium};
  font-size: ${fontSizes.m};
  line-height: ${lineHeights.medium};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
`

export const Body = styled.p<StyledTextProps>`
  ${baseStyles};
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.s};
  line-height: ${lineHeights.medium};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
`

export const BodyBold = styled(Body)`
  font-weight: ${fontWeights.semibold};
`

export const BodySmall = styled(Body)`
  font-size: ${fontSizes.xs};
`

export const BodyFaded = styled(Body)`
  color: ${colors.greys300};
`
