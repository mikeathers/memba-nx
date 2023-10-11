'use client'
import React, {useEffect} from 'react'
import {toast} from 'react-toastify'
import {useSearchParams} from 'next/navigation'

import {CenterBox, ErrorToast, SuccessToast, Text} from '@memba-labs/design-system'
import {
  interpolateContent,
  useSafeAsync,
  useAuth,
  ConfirmAccountContent,
} from '@memba-nx/shared'

import {WithoutAuth} from '../hoc'

import {
  EmailAddress,
  EnvelopeImage,
  ResendConfirmationEmailContainer,
} from './confirm-account.styles'

interface ConfirmAccountProps {
  content: ConfirmAccountContent
}

const ConfirmAccount: React.FC<ConfirmAccountProps> = (props) => {
  const {content} = props
  const {resendConfirmationEmail} = useAuth()
  const {run, isSuccess, isError} = useSafeAsync()
  const searchParams = useSearchParams()

  const emailAddress = searchParams.get('emailAddress')

  useEffect(() => {
    if (isSuccess) {
      toast(
        <SuccessToast>
          <Text type={'body-bold'}>{`We've sent you an email!`}</Text>
          <Text type={'body'}>The verification email is on its way!</Text>
        </SuccessToast>,
      )
    }

    if (isError) {
      toast(
        <ErrorToast>
          <Text type={'body-bold'}>Something went wrong.</Text>
          <Text type={'body'}>Please try again later.</Text>
        </ErrorToast>,
      )
    }
  }, [isSuccess, isError])

  const handleResendConfirmationEmail = async () => {
    if (emailAddress) await run(resendConfirmationEmail(emailAddress))
    else {
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
      <EnvelopeImage />
      <Text type={'body-small'} $marginTop={'space4x'}>
        {interpolateContent(content.emailSentMessage, undefined, {
          emailAddress: () => <EmailAddress key={0}>{emailAddress}</EmailAddress>,
        })}
      </Text>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <ResendConfirmationEmailContainer onClick={handleResendConfirmationEmail}>
        <Text type={'body-small'} color={'blues800'}>
          {content.resendConfirmationEmail}
        </Text>
      </ResendConfirmationEmailContainer>
    </CenterBox>
  )
}

export default WithoutAuth(ConfirmAccount)
