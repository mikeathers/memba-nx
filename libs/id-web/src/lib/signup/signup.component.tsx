'use client'
import React, {useEffect, useState} from 'react'
import {Formik} from 'formik'
import {object, string} from 'yup'
import {useRouter} from 'next/navigation'

import {Button, CenterBox, Text, TextInput, NextLink} from '@memba-labs/design-system'
import {
  useAuth,
  passwordValidation,
  useSafeAsync,
  SignUpContent,
  RegisterTenantProps,
  PAGE_ROUTES,
} from '@memba-nx/shared'

import {ErrorContainer, LoginContainer} from './signup.styles'

export interface SignUpProps {
  content: SignUpContent
}

export const SignUp = (props: SignUpProps) => {
  const {content} = props
  const router = useRouter()
  const {registerTenant} = useAuth()
  const {run, data, error, isLoading, isSuccess} = useSafeAsync()
  const [fetchError, setFetchError] = useState<string>('')
  const [emailAddress, setEmailAddress] = useState<string>('')

  useEffect(() => {
    if (isSuccess) {
      router.push(`${PAGE_ROUTES.CONFIRM_ACCOUNT}/?emailAddress=${emailAddress}`)
    }

    if (error?.message.includes('already exists')) {
      setFetchError(content.userAlreadyExistsError)
      return
    }
    if (error?.message.includes('Name')) {
      setFetchError(content.fullNameRequireError)
      return
    }
    if (error) {
      setFetchError(content.genericError)
      return
    }
  }, [error, data, isLoading])

  const formSchema = object({
    emailAddress: string()
      .required(content.form.validation.emailAddress)
      .email(content.form.validation.emailAddressFormat),
    fullName: string().required(content.form.validation.fullName),
    password: string()
      .required(content.form.validation.password)
      .min(6, content.form.validation.passwordLengthMessage)
      .test(
        'isValidPassword',
        content.form.validation.passwordValidationMessage,
        (value) => passwordValidation(value),
      ),
  })

  const handleSubmitForm = async (values: RegisterTenantProps) => {
    setEmailAddress(values.emailAddress)
    await run(registerTenant(values))
  }

  return (
    <CenterBox>
      <Text type={'h4'} $textAlign={'center'} $marginBottom={'space4x'}>
        {content.heading}
      </Text>

      <Formik
        initialValues={{
          fullName: '',
          emailAddress: '',
          password: '',
        }}
        onSubmit={(values) => handleSubmitForm(values)}
        validationSchema={formSchema}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({handleChange, handleSubmit, values, errors}) => {
          return (
            <>
              <TextInput
                name={'fullName'}
                error={errors.fullName}
                placeholder={content.form.fullNamePlaceholder}
                onChange={handleChange('fullName')}
                value={values.fullName}
                autoComplete={'name'}
              />
              <TextInput
                name={'emailAddress'}
                error={errors.emailAddress}
                placeholder={content.form.emailPlaceholder}
                onChange={handleChange('emailAddress')}
                value={values.emailAddress}
                autoComplete={'email'}
                autoCapitalize={'off'}
              />
              <TextInput
                name={'password'}
                error={errors.password}
                placeholder={content.form.passwordPlaceholder}
                onChange={handleChange('password')}
                value={values.password}
                type={'password'}
                autoCapitalize={'off'}
              />

              <ErrorContainer>
                {errors.fullName && (
                  <Text type={'body'} color={'reds500'} $marginBottom={'spaceHalfx'}>
                    {errors.fullName}
                  </Text>
                )}

                {errors.emailAddress && (
                  <Text type={'body'} color={'reds500'} $marginBottom={'spaceHalfx'}>
                    {errors.emailAddress}
                  </Text>
                )}

                {errors.password && (
                  <Text type={'body'} color={'reds500'} $marginBottom={'spaceHalfx'}>
                    {errors.password}
                  </Text>
                )}

                {fetchError && (
                  <Text type={'body'} color={'reds500'}>
                    {fetchError}
                  </Text>
                )}
              </ErrorContainer>

              <Text type={'body-small'} $faded>
                {content.termsOfService}
              </Text>

              <Button
                $isDisabled={isLoading}
                $isLoading={isLoading}
                $variant={'primary'}
                onClick={() => handleSubmit()}
                $marginTop={'space4x'}
                type={'submit'}
                $fullWidth
              >
                {content.form.signUpCta}
              </Button>
            </>
          )
        }}
      </Formik>

      <LoginContainer>
        <NextLink href={'/login'} fontSize={'xs'} color={'blues800'}>
          {content.login}
        </NextLink>
      </LoginContainer>
    </CenterBox>
  )
}
