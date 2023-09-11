import styled, {css} from 'styled-components'

import {borderRadius, colors, fonts, fontSizes, spacing} from '../../styles'
import {margins} from '../../utils'

import type {ButtonProps} from './button.component'

export const StyledButton = styled.button<ButtonProps>`
  ${margins};

  border-radius: ${borderRadius.lightRounded};
  background-color: ${colors.blues800};
  color: ${colors.neutrals000};
  padding: 6px ${spacing.space4x};
  outline: none;
  height: 37px;
  font-size: ${fontSizes.s};
  font-family: ${fonts.poppins};
  cursor: pointer;
  width: ${({fullWidth}) => fullWidth && '100%'};

  ${({variant, $isDisabled, $isLoading}) => {
    if (variant === 'primary' && ($isDisabled || $isLoading)) {
      return css`
        color: ${colors.neutrals000};
        border: none;
        pointer-events: none;
        background-color: ${colors.blues500};
        cursor: none;
      `
    }
    if (variant === 'primary') {
      return css`
        background-color: ${colors.blues800};
        color: ${colors.neutrals000};
        border: none;
      `
    }
    if (variant === 'secondary') {
      return css`
        background-color: ${colors.neutrals000};
        color: ${colors.blues800};
        border: 1px solid ${colors.blues800};
      `
    }

    if (variant === 'text') {
      return css`
        padding: ${spacing.space1x};
        background-color: transparent;
        border: none;
        color: ${colors.blues800};

        &:active {
          color: ${colors.blues100};
        }
      `
    }
  }};

  &:active {
    filter: brightness(85%);
  }
`

export const StyledLoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
