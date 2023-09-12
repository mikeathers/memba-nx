import {css} from 'styled-components'
import {spacing} from '../styles'
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
