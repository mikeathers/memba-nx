import {css} from 'styled-components'
import {spacing, Spacing} from '../styles'

export interface MarginsApi {
  $marginBottomX?: keyof Spacing
  $marginTopX?: keyof Spacing
  $marginLeftX?: keyof Spacing
  $marginRightX?: keyof Spacing
}

export const margins = css<MarginsApi>`
  ${({$marginTopX}) => {
    if ($marginTopX)
      return css`
        margin-top: ${spacing[$marginTopX]};
      `
  }}

  ${({$marginBottomX}) => {
    if ($marginBottomX)
      return css`
        margin-bottom: ${spacing[$marginBottomX]};
      `
  }}

  ${({$marginRightX}) => {
    if ($marginRightX)
      return css`
        margin-right: ${spacing[$marginRightX]};
      `
  }}

  ${({$marginLeftX}) => {
    if ($marginLeftX)
      return css`
        margin-left: ${spacing[$marginLeftX]};
      `
  }}
`
