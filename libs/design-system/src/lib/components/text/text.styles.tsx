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

enum FontSizes {
  s,
}
export interface StyledTextProps extends MarginsApi {
  color?: keyof Colors
  $textAlign?: 'center'
  $faded?: boolean
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
  font-family: ${fonts.poppins};
  color: ${({$faded}) => $faded && colors.greys300};
`

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
  ${baseStyles};
`

export const H3 = styled.h3<StyledTextProps>`
  font-weight: ${fontWeights.medium};
  font-size: ${fontSizes.l};
  line-height: ${lineHeights.large};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
  ${baseStyles};
`

export const H4 = styled.h4<StyledTextProps>`
  font-weight: ${fontWeights.medium};
  font-size: ${fontSizes.m};
  line-height: ${lineHeights.medium};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
  ${baseStyles};
`

export const Body = styled.p<StyledTextProps>`
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.s};
  line-height: ${lineHeights.medium};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
  ${baseStyles};
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
