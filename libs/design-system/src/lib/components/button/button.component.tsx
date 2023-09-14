import React, {ButtonHTMLAttributes} from 'react'

import {StyledButton, StyledLoadingContainer} from './button.styles'
import {LoadingSpinner} from '../loading-spinner'
import {MarginsApi} from '../../utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, MarginsApi {
  children: React.ReactNode | undefined
  $variant: 'primary' | 'secondary' | 'text'
  $isLoading?: boolean
  $isDisabled?: boolean
  $fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = (props) => {
  const {children, $isLoading, ...rest} = props
  return (
    <StyledButton {...rest} $isLoading={$isLoading}>
      {$isLoading ? (
        <StyledLoadingContainer>
          Loading <LoadingSpinner />
        </StyledLoadingContainer>
      ) : (
        children
      )}
    </StyledButton>
  )
}
