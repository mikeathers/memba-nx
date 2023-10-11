'use client'
import React, {useEffect} from 'react'
import {Formik} from 'formik'
import {useSearchParams} from 'next/navigation'
import Link from 'next/link'
import {toast} from 'react-toastify'
import {object, string} from 'yup'

import {
  Button,
  CenterBox,
  ErrorToast,
  SuccessToast,
  Text,
  TextInput,
} from '@memba-labs/design-system'
import {
  useSafeAsync,
  useAuth,
  ForgotPasswordContent,
  ForgotPasswordFormDetails,
  PAGE_ROUTES,
} from '@memba-nx/shared'

import {WithoutAuth} from '../hoc'

import {ActionsContainer, ErrorContainer} from './forgot-password.styles'

interface ForgotPasswordProps {
  content: ForgotPasswordContent
}

const ForgotPassword: React.FC<ForgotPasswordProps> = (props) => {
  const {content} = props
  const {isLoading, run, isSuccess} = useSafeAsync()
  const {sendForgotPasswordLink} = useAuth()
  const searchParams = useSearchParams()
  const emailAddress = searchParams.get('emailAddress')

  const formSchema = object({
    emailAddress: string()
      .required(content.form.validation.emailAddress)
      .email(content.form.validation.emailAddressFormat),
  })

  useEffect(() => {
    if (isSuccess) {
      toast(
        <SuccessToast>
          <Text type={'body-bold'}>We've sent you an email!</Text>
          <Text type={'body'}>The recovery email is on its way!</Text>
        </SuccessToast>,
      )
    }
  }, [isSuccess])

  const handleSubmitForm = async (values: ForgotPasswordFormDetails) => {
    if (emailAddress || values.emailAddress) {
      await run(sendForgotPasswordLink(emailAddress || values.emailAddress))
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
      <Text type={'h4'} $textAlign={'center'} $marginBottom={'space4x'}>
        {content.heading}
      </Text>

      <Formik
        initialValues={{
          emailAddress: emailAddress || '',
        }}
        onSubmit={(values) => handleSubmitForm(values)}
        validationSchema={formSchema}
        validateOnChange={true}
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
                label={content.message}
              />

              <ErrorContainer>
                {errors.emailAddress && (
                  <Text type={'body'} color={'reds500'}>
                    {errors.emailAddress}
                  </Text>
                )}
              </ErrorContainer>

              <Button
                $isLoading={isLoading}
                $isDisabled={isLoading}
                $fullWidth
                $variant={'primary'}
                onClick={() => handleSubmit()}
                $marginTop={'space2x'}
                type={'submit'}
              >
                {content.sendLinkCta}
              </Button>
            </>
          )
        }}
      </Formik>

      <ActionsContainer>
        <Link href={PAGE_ROUTES.LOGIN}>
          <Text type={'body-small'} color={'blues800'}>
            {content.returnToLogin}
          </Text>
        </Link>
      </ActionsContainer>
    </CenterBox>
  )
}

export default WithoutAuth(ForgotPassword)
