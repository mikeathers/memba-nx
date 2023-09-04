import type {CognitoUser} from '@aws-amplify/auth'
import {Auth} from '@aws-amplify/auth'
import type {FC} from 'react'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'

import {refreshJwt} from '../../utils'

import {
  appleSignIn,
  changePassword,
  completeRegistration,
  completeResetPassword,
  googleSignIn,
  registerUser,
  resendConfirmationEmail,
  sendForgotPasswordLink,
  signUserIn,
  signUserOut,
} from './auth.helpers'
import {authReducer, initialState} from './auth.reducer'
import type {AuthContextValue, AuthProviderProps} from './auth.types'
import {ActionTypes} from './auth.types'
import {hasAccessCheck} from '../../services'
import {CognitoUserAttributes, LoginFormDetails} from '../../types'

export const AuthContext = createContext<AuthContextValue | null>(null)

const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)

  if (!context) throw new Error('useAuth must be wrapped in an AuthProvider')

  const {state, dispatch} = context

  const getCurrentUser = useCallback(async () => {
    return (await Auth.currentAuthenticatedUser()) as CognitoUser & {
      attributes: CognitoUserAttributes
    }
  }, [])

  const addUserToState = useCallback(async () => {
    try {
      const cognitoUser = await getCurrentUser()
      const {attributes} = cognitoUser
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        userConfig: cognitoUser,
        user: {
          emailAddress: attributes.email,
          familyName: attributes.family_name,
          givenName: attributes.given_name,
          isTenantAdmin: attributes['custom:isTenantAdmin'],
          isMembaAdmin: attributes['custom:isMembaAdmin'],
          tenantId: attributes['custom:tenantId'],
        },
      })
    } catch (e) {
      if (e instanceof Error) {
        dispatch({type: ActionTypes.LOGIN_FAILURE, error: e})
      } else {
        dispatch({
          type: ActionTypes.LOGIN_FAILURE,
          error: new Error('Something went very wrong.'),
        })
      }
    }
  }, [dispatch, getCurrentUser])

  const handleRefreshUserSession = useCallback(async () => {
    try {
      const sessionRefreshed = await refreshJwt()

      if (sessionRefreshed) {
        const cognitoUser = await getCurrentUser()
        if (cognitoUser) {
          const {attributes} = cognitoUser
          dispatch({
            type: ActionTypes.LOGIN_SUCCESS,
            userConfig: cognitoUser,
            user: {
              emailAddress: attributes.email,
              familyName: attributes.family_name,
              givenName: attributes.given_name,
              isTenantAdmin: attributes['custom:isTenantAdmin'],
              isMembaAdmin: attributes['custom:isMembaAdmin'],
              tenantId: attributes['custom:tenantId'],
            },
          })
        }
      } else {
        dispatch({
          type: ActionTypes.LOGIN_FAILURE,
          error: new Error('Could not refresh user session'),
        })
      }
    } catch {
      return null
    }
  }, [])

  const handleSignUserOut = useCallback(async () => {
    dispatch({type: ActionTypes.IS_LOADING})
    await signUserOut()
    dispatch({type: ActionTypes.LOGOUT_SUCCESS})
  }, [dispatch])

  const handleSignUserIn = useCallback(
    async (props: LoginFormDetails) => {
      const userCanLogin = await hasAccessCheck({
        emailAddress: props.emailAddress,
        url: props.url.replace('https://', '') || '',
      })

      if (userCanLogin) {
        const user = await signUserIn(props)
        await addUserToState()
        await refreshJwt()

        return user
      } else throw new Error('Unauthorised')
    },
    [addUserToState],
  )

  return {
    state,
    dispatch,
    registerUser,
    signUserIn: handleSignUserIn,
    signUserOut: handleSignUserOut,
    refreshUserSession: handleRefreshUserSession,
    sendForgotPasswordLink,
    resendConfirmationEmail,
    completeResetPassword,
    completeRegistration,
    changePassword,
    googleSignIn,
    appleSignIn,
    addUserToState,
  }
}

const AuthProvider: FC<AuthProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  ) as AuthContextValue

  useEffect(() => {
    console.log({state})
  }, [state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export {AuthProvider, useAuth}
