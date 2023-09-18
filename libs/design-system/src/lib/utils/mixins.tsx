import {css} from 'styled-components'
import {
  colors,
  ColorStyles,
  fonts,
  fontSizes,
  FontSizeStyles,
  fontWeights,
  FontWeightStyles,
  lineHeights,
  LineHeightStyles,
  spacing,
} from '../styles'
import {SpacingStyles} from '../styles/enums'

export interface MarginsApi {
  $marginBottom?: keyof typeof SpacingStyles
  $marginTop?: keyof typeof SpacingStyles
  $marginLeft?: keyof typeof SpacingStyles
  $marginRight?: keyof typeof SpacingStyles
}

export const margins = css<MarginsApi>`
  ${({$marginTop}) => {
    if ($marginTop) {
      return css`
        margin-top: ${spacing[$marginTop]};
      `
    }
  }}

  ${({$marginBottom}) => {
    if ($marginBottom)
      return css`
        margin-bottom: ${spacing[$marginBottom]};
      `
  }}

  ${({$marginRight}) => {
    if ($marginRight)
      return css`
        margin-right: ${spacing[$marginRight]};
      `
  }}

  ${({$marginLeft}) => {
    if ($marginLeft)
      return css`
        margin-left: ${spacing[$marginLeft]};
      `
  }}
`

export interface StyledTextProps extends MarginsApi {
  $textAlign?: 'center'
  $faded?: boolean
  fontSize?: keyof typeof FontSizeStyles | string
  fontWeight?: keyof typeof FontWeightStyles
  color?: keyof typeof ColorStyles
  $lineHeight?: keyof typeof LineHeightStyles
  $linkText?: boolean
}

export const styledTextAlign = css<StyledTextProps>`
  ${({$textAlign}) => {
    if ($textAlign === 'center') {
      return css`
        text-align: center;
      `
    }
  }}
`
export const baseTextStyles = css<StyledTextProps>`
  ${margins};
  ${styledTextAlign};
  font-family: ${fonts.poppins};
  font-size: ${({fontSize}) => {
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
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

  &:active {
    color: ${({$linkText}) => $linkText && colors.greys300}}
  }
`
