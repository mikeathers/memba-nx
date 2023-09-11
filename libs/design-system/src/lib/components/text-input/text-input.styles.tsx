import styled, {css} from 'styled-components'

import {borderRadius, colors, fonts, fontSizes, spacing} from '../../styles'

import type {TextInputProps} from './text-input.component'

export const Container = styled.div`
  margin-bottom: ${spacing.space3x};
  position: relative;
`

type StyledTextInputProps = Omit<TextInputProps, 'ref'>

export const StyledTextInput = styled.input<StyledTextInputProps>`
  width: 100%;
  border: 1px solid ${colors.blues100};
  border-radius: ${borderRadius.lightRounded};
  padding: ${spacing.space1x};
  font-size: ${fontSizes.xs};
  font-family: ${fonts.poppins};

  &:focus {
    outline: none;
    border: 1px solid ${colors.blues800};
  }

  ${({error}) => {
    if (typeof error === 'string') {
      return css`
        border: 1px solid ${colors.reds500};
      `
    }
  }}
`
export const TextInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  justify-content: space-between;
`
export const RightIconWrapper = styled.div`
  height: 100%;
  width: 22px;
  position: absolute;
  right: 5px;
  top: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
