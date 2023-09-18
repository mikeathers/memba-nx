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
  ColorStyles,
  FontSizeStyles,
  FontWeightStyles,
  LineHeightStyles,
} from '../../styles'
import {MarginsApi, margins} from '../../utils'

export interface StyledTextProps extends MarginsApi {
  $textAlign?: 'center'
  $faded?: boolean
  fontSize?: keyof typeof FontSizeStyles | string
  fontWeight?: keyof typeof FontWeightStyles
  color?: keyof typeof ColorStyles
  $lineHeight?: keyof typeof LineHeightStyles
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
  ${margins};
  ${styledTextAlign};
  font-family: ${fonts.poppins};
  font-size: ${({fontSize}) => {
    // @ts-ignore
    if (fontSize && Object.values(FontSizeStyles).includes(fontSize))
      return fontSize && fontSizes[fontSize as keyof typeof FontSizeStyles]

    return fontSize
  }};
  font-weight: ${({fontWeight}) => fontWeight && fontWeights[fontWeight]};
  line-height: ${({$lineHeight}) => $lineHeight && lineHeights[$lineHeight]};
  color: ${({$faded, color}) => {
    if ($faded) return colors.greys300
    if (color) return colors[color]
  }};
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

export const BodyFaded = styled(Body)`
  color: ${colors.greys300};
`
