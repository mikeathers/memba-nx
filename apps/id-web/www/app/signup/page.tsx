import React from 'react'

import {signUp} from '@memba-nx/shared'
import {SignUp} from '@memba-nx/id-web'

const SignupPage = () => {
  const content = signUp

  return <SignUp content={content} />
}

export default SignupPage
