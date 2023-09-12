import {ResetPassword} from '@memba-nx/id-web'
import {resetPassword} from '@memba-nx/shared'
import React from 'react'

const ResetPasswordPage: React.FC = () => {
  return <ResetPassword content={resetPassword} />
}

export default ResetPasswordPage
