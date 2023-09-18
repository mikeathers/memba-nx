'use client'
import React, {useEffect} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Formik} from 'formik'
import {toast} from 'react-toastify'
import {object, string} from 'yup'

import {
  colorTokens,
  spacingTokens,
  Button,
  CenterBox,
  ErrorToast,
  Text,
  TextInput,
} from '@memba-labs/design-system'

import {
  passwordValidation,
  useAuth,
  useSafeAsync,
  ResetPasswordContent,
  ResetPasswordFormDetails,
  readFromEnv,
  Env,
  useMembaDetails,
} from '@memba-nx/shared'
import {ErrorContainer} from './reset-password.styles'

interface ResetPasswordProps {
  content: ResetPasswordContent
}

export const ResetPassword: React.FC<ResetPasswordProps> = (props) => {
  const {content} = props
  const searchParams = useSearchParams()
  const {completeResetPassword, signUserIn} = useAuth()
  const {run, isSuccess, isLoading, isError} = useSafeAsync()
  const router = useRouter()
  const [password, setPassword] = React.useState<string | undefined>(undefined)
  const code = searchParams?.get('code')
  const emailAddress = searchParams?.get('emailAddress')

  const handleSignIn = async () => {
    if (emailAddress && password) {
      await run(signUserIn({emailAddress, password}))
    }
  }
  useEffect(() => {
    if (isSuccess) {
      handleSignIn()
      router.push(readFromEnv(Env.startApp))
    } else if (isError) {
      toast(
        <ErrorToast>
          <Text type={'body-bold'}>Something went wrong.</Text>
          <Text type={'body'}>Please try again later.</Text>
        </ErrorToast>,
      )
    }
  }, [isSuccess, isError])

  const formSchema = object({
    password: string()
      .required(content.form.validation.password)
      .min(6, content.form.validation.passwordLengthMessage)
      .test(
        'isValidPassword',
        content.form.validation.passwordValidationMessage,
        (value) => passwordValidation(value),
      ),
  })

  const handleSubmitForm = async (values: ResetPasswordFormDetails) => {
    if (values.password && emailAddress && code) {
      setPassword(values.password)
      await run(completeResetPassword({emailAddress, code, password: values.password}))
    } else {
      toast(
        <ErrorToast>
          <Text type={'body-bold'}>Something went wrong.</Text>
          <Text type={'body'}>Please try again later.</Text>
        </ErrorToast>,
      )
    }
  }

  return (
    <CenterBox>
      <Text type={'h4'} $marginBottom={'space4x'} $textAlign={'center'}>
        {content.heading}
      </Text>
      <Formik
        initialValues={{
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
                name={'password'}
                error={errors.password}
                placeholder={content.form.passwordPlaceholder}
                onChange={handleChange('password')}
                value={values.password}
                type={'password'}
              />

              <ErrorContainer>
                {errors.password && (
                  <Text type={'body-small'} color={'reds500'}>
                    {errors.password}
                  </Text>
                )}
              </ErrorContainer>

              <Text type={'body-small'} color={'blues800'} $marginBottom={'space4x'}>
                {content.form.validation.passwordValidationMessage}
              </Text>

              <Button
                $isLoading={isLoading}
                $isDisabled={isLoading}
                $fullWidth
                $variant={'primary'}
                onClick={() => handleSubmit()}
                $marginTop={'space2x'}
                type={'submit'}
              >
                {content.submitCta}
              </Button>
            </>
          )
        }}
      </Formik>
    </CenterBox>
  )
}
