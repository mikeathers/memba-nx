'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import {Formik} from 'formik'
import {object, string} from 'yup'
import {useRouter, useSearchParams} from 'next/navigation'
import {Button, CenterBox, ErrorToast, Text, TextInput} from '@memba-labs/design-system'

import {
  useSafeAsync,
  useAuth,
  LoginContent,
  Env,
  readFromEnv,
  PAGE_ROUTES,
  LoginFormDetails,
} from '@memba-nx/shared'

import {WithoutAuth} from '../hoc'

import {ErrorContainer, ActionsContainer} from './login.styles'
import {toast} from 'react-toastify'

export interface LoginProps {
  content: LoginContent
}

const Login: React.FC<LoginProps> = (props) => {
  const {content} = props
  const router = useRouter()
  const {signUserIn, resendConfirmationEmail} = useAuth()
  const {run, data, error, isLoading, isSuccess} = useSafeAsync()
  const [fetchError, setFetchError] = useState<string>('')
  const [emailAddress, setEmailAddress] = useState<string>('')
  const searchParams = useSearchParams()

  const gymName = searchParams.get('tenantName')?.replace('_', ' ')
  const redirectUrl = searchParams.get('redirectUrl')

  const handleResendConfirmationEmail = async () => {
    await run(resendConfirmationEmail(emailAddress))
  }

  useEffect(() => {
    if (isSuccess) {
      router.push(readFromEnv(Env.startApp))
    }

    if (error?.message && error.message.includes('User does not exist')) {
      setFetchError(content.userNotFoundError)
      return
    }
    if (error?.message && error.message.includes('Incorrect username or password')) {
      setFetchError(content.incorrectUserNameOrPassword)
      return
    }
    if (error?.message && error.message.includes('User is not confirmed')) {
      handleResendConfirmationEmail()
      router.push(`${PAGE_ROUTES.CONFIRM_ACCOUNT}/?emailAddress=${emailAddress}`)
      return
    }
    if (error) {
      toast(
        <ErrorToast>
          <Text type={'body-bold'}>Something went wrong.</Text>
          <Text type={'body'}>Please try again later.</Text>
        </ErrorToast>,
      )
    }
  }, [error, data, isLoading])

  const formSchema = object({
    emailAddress: string()
      .required(content.form.validation.emailAddress)
      .email(content.form.validation.emailAddressFormat),
    password: string().required(content.form.validation.password),
  })

  const handleSubmitForm = async (values: LoginFormDetails) => {
    if (values.emailAddress && values.password) {
      setEmailAddress(values.emailAddress)

      await run(signUserIn(values))

      if (redirectUrl) {
        router.push(redirectUrl)
      } else router.push(readFromEnv(Env.startApp))
    }
  }

  return (
    <CenterBox gymName={gymName}>
      <Text type={'h4'} $textAlign={'center'} $marginBottom={'space4x'}>
        {content.heading}
      </Text>

      <Formik
        initialValues={{
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
                {errors.emailAddress && (
                  <Text type={'body'} color={'reds500'} $marginBottom={'spaceHalfx'}>
                    {errors.emailAddress}
                  </Text>
                )}

                {errors.password && (
                  <Text type={'body'} color={'reds500'}>
                    {errors.password}
                  </Text>
                )}

                {fetchError && (
                  <Text type={'body'} color={'reds500'}>
                    {fetchError}
                  </Text>
                )}
              </ErrorContainer>

              <Button
                $isDisabled={isLoading}
                $isLoading={isLoading}
                $variant={'primary'}
                onClick={() => handleSubmit()}
                $marginTop={'space2x'}
                type={'submit'}
                $fullWidth
              >
                {content.form.loginCta}
              </Button>
            </>
          )
        }}
      </Formik>

      <ActionsContainer>
        <Link href={`${PAGE_ROUTES.FORGOT_PASSWORD}/?emailAddress=${emailAddress}`}>
          <Text type={'body-small'} color={'blues800'}>
            {content.cantLogin}
          </Text>
        </Link>
        <Text type={'body-small'} color={'blues800'}>
          •
        </Text>
        <Link href={PAGE_ROUTES.SIGN_UP}>
          <Text type={'body-small'} color={'blues800'}>
            {content.signUp}
          </Text>
        </Link>
      </ActionsContainer>
    </CenterBox>
  )
}

export default WithoutAuth(Login)
