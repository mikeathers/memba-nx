import React from 'react'
import type {CognitoUser} from '@aws-amplify/auth'
import type {Dispatch} from 'react'
import {
  AuthUser,
  LoginFormDetails,
  MembaUser,
  NewCustomerFormDetails,
  UserMembership,
} from '../../types'
import {CreateUserAccountProps} from '../../services'

export type AuthContextValue = {
  state: AuthState
  dispatch: Dispatch<AuthReducerAction>
  signUserIn: (props: LoginFormDetails) => Promise<ChallengedUser | null>
  signUserOut: () => Promise<void>
  registerUser: (props: RegisterUserProps) => Promise<void>
  refreshUserSession: () => Promise<void | null>
  sendForgotPasswordLink: (email: string) => Promise<void>
  completeResetPassword: (props: CompletePasswordResetProps) => Promise<void>
  resendConfirmationEmail: (email: string) => Promise<void>
  completeRegistration: (props: CompleteRegistrationProps) => Promise<void>
  changePassword: (props: ChangePasswordProps) => Promise<void>
  googleSignIn: () => Promise<void>
  appleSignIn: () => Promise<void>
  addUserToState: () => Promise<void>
}

export interface AuthProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

export interface AuthState {
  isLoading: boolean
  error: Error | undefined
  isAuthenticated: boolean
  isAuthenticating: boolean
  user: AuthUser | undefined
  userConfig: CognitoUser | undefined
}

export enum ActionTypes {
  IS_LOGGING_IN = 'IS_LOGGING_IN',
  IS_LOADING = 'IS_LOADING',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
  REGISTRATION_COMPLETE = 'REGISTRATION_COMPLETE',
}
export type AuthReducerAction =
  | {type: ActionTypes.IS_LOGGING_IN}
  | {type: ActionTypes.IS_LOADING}
  | {
      type: ActionTypes.LOGIN_SUCCESS
      user: AuthUser
      userConfig: CognitoUser
    }
  | {type: ActionTypes.LOGIN_FAILURE; error: Error | undefined}
  | {type: ActionTypes.LOGOUT_SUCCESS}
  | {
      type: ActionTypes.REGISTRATION_COMPLETE
      state: AuthState
    }

export interface ChallengedUser {
  challengeName?: string
  email: string
  familyName: string
  givenName: string
  'custom:isTenantAdmin'?: boolean
  'custom:isMembaAdmin'?: boolean
  'custom:tenantId'?: string
}

export interface LoginProps {
  emailAddress: string
  password: string
}

export interface RegisterUserProps {
  emailAddress: string
  password: string
  fullName: string
  groupName: string
  appId: string
  signUpRedirectUrl: string
  membership: UserMembership
  createAccountCallback: (props: CreateUserAccountProps) => Promise<MembaUser | null>
}

export interface CompleteRegistrationProps {
  emailAddress: string
  code: string
}

export interface CompletePasswordResetProps {
  emailAddress: string
  code: string
  password: string
}

export interface ChangePasswordProps {
  oldPassword: string
  newPassword: string
  user: CognitoUser
}

export interface RegisterTenantProps extends NewCustomerFormDetails {
  tier: string
}
