'use client'
import React, {useState} from 'react'
import {FormikError} from '@memba-nx/shared'

import {SvgIcon} from '../svg-icon'
import {Text} from '../text'

import {
  TextInputContainer,
  RightIconWrapper,
  StyledTextInput,
  TextInputWrapper,
} from './text-input.styles'
import {MarginsApi} from '../../utils'

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    MarginsApi {
  label?: string
  error?: FormikError | undefined
}

export const TextInput: React.FC<TextInputProps> = (props) => {
  const {label, ...rest} = props
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleType = () => {
    if (props.type !== 'password') return props.type
    else if (props.type === 'password' && showPassword) return 'text'
    else return 'password'
  }

  return (
    <TextInputContainer>
      {label && (
        <Text type={'body'} $marginBottom={'spaceHalfx'}>
          {label}
        </Text>
      )}
      <TextInputWrapper>
        <StyledTextInput {...rest} type={handleType()} />
        {props.type === 'password' && (
          <RightIconWrapper onClick={() => setShowPassword(!showPassword)}>
            <SvgIcon
              name={showPassword ? 'visible' : 'hidden'}
              color={'neutrals500'}
              size={16}
            />
          </RightIconWrapper>
        )}
      </TextInputWrapper>
    </TextInputContainer>
  )
}
