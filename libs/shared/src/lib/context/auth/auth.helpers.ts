import {Auth, CognitoHostedUIIdentityProvider} from '@aws-amplify/auth'

import {TEMP_LOCAL_STORAGE_PWD_KEY} from '../../config'
import {removeItemFromLocalStorage, setItemInLocalStorage} from '../../utils'

import type {
  ChallengedUser,
  ChangePasswordProps,
  CompletePasswordResetProps,
  CompleteRegistrationProps,
  RegisterUserProps,
} from './auth.types'
import {LoginFormDetails, RegisterTenantProps} from '../../types'
import {createTenantAccount} from '../../services'

export const registerUser = async (props: RegisterUserProps) => {
  const {
    emailAddress,
    password,
    fullName,
    groupName,
    appId,
    signUpRedirectUrl,
    membership,
    createAccountCallback,
  } = props
  if (emailAddress && password && fullName) {
    const splitName = fullName.split(' ', 2)
    const firstName = splitName[0]
    const lastName = splitName[1]

    await createAccountCallback({
      firstName,
      lastName,
      password,
      emailAddress,
      groupName,
      appId,
      signUpRedirectUrl,
      membership,
    })

    setItemInLocalStorage(TEMP_LOCAL_STORAGE_PWD_KEY, password)
  }
}

export const registerTenant = async (props: RegisterTenantProps) => {
  console.log('here')
  const {emailAddress, password, fullName} = props
  if (emailAddress && password && fullName) {
    const splitName = fullName.split(' ', 2)
    const firstName = splitName[0]
    const lastName = splitName[1]

    const result = await createTenantAccount({
      emailAddress: emailAddress.trim().toLowerCase(),
      password,
      firstName: firstName.trim().toLowerCase(),
      lastName: lastName ? lastName.trim().toLowerCase() : '',
    })

    console.log({result})

    setItemInLocalStorage(TEMP_LOCAL_STORAGE_PWD_KEY, password)

    return result
  }
}

export const completeRegistration = async (props: CompleteRegistrationProps) => {
  const {emailAddress, code} = props
  if (emailAddress) {
    await Auth.confirmSignUp(emailAddress, code)
  }
}

export const signUserIn = async (
  props: LoginFormDetails,
): Promise<ChallengedUser | null> => {
  removeItemFromLocalStorage(TEMP_LOCAL_STORAGE_PWD_KEY)

  const {emailAddress, password} = props

  const user = (await Auth.signIn(
    emailAddress.trim().toLowerCase(),
    password,
  )) as ChallengedUser

  // const res = await Auth.currentSession()
  // console.log('TOKEN: ', res.getIdToken())

  if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
    await Auth.completeNewPassword(user, password)
  }

  return user
}

export const signUserOut = async () => {
  await Auth.signOut()
}

export const sendForgotPasswordLink = async (email: string) => {
  if (email) {
    await Auth.forgotPassword(email)
  }
}

export const completeResetPassword = async (props: CompletePasswordResetProps) => {
  const {emailAddress, password, code} = props

  if (emailAddress) {
    await Auth.forgotPasswordSubmit(emailAddress, code, password)
  }
}

export const resendConfirmationEmail = async (email: string) => {
  if (email) {
    await Auth.resendSignUp(email)
  }
}

export const changePassword = async (props: ChangePasswordProps) => {
  const {oldPassword, newPassword, user} = props

  if (oldPassword && newPassword && user) {
    await Auth.changePassword(user, oldPassword, newPassword)
  }
}

export const googleSignIn = async () => {
  await Auth.federatedSignIn({
    provider: CognitoHostedUIIdentityProvider.Google,
  })
}

export const appleSignIn = async () => {
  await Auth.federatedSignIn({
    provider: CognitoHostedUIIdentityProvider.Apple,
  })
}
