import React from 'react'
import type {CognitoUser} from '@aws-amplify/auth'
import {Auth, CognitoHostedUIIdentityProvider} from '@aws-amplify/auth'
import {renderHook, waitFor} from '@testing-library/react'
import {mock} from 'jest-mock-extended'
import type {ReactElement} from 'react'
import mocked = jest.mocked

import {TEMP_LOCAL_STORAGE_PWD_KEY} from '../../config'
import {hasAccessCheck} from '../../services'
import {refreshJwt, removeItemFromLocalStorage, setItemInLocalStorage} from '../../utils'
import {mockCognitoUserAttributes, mockState} from '../../test-support'
import type {ChallengedUser} from './auth.types'
import {ActionTypes, AuthContext, initialState, useAuth} from './'
import {CognitoUserAttributes, UserMembership} from '../../types'

interface CognitoUserMockType {
  attributes: CognitoUserAttributes
}

jest.mock('../../utils')
jest.mock('../../services')

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const cognitoUserMock: CognitoUserMockType = {attributes: mockCognitoUserAttributes}

const mockRemoveItem = mocked(removeItemFromLocalStorage)
const mockSetItem = mocked(setItemInLocalStorage)
const mockRefreshJwt = mocked(refreshJwt)
const mockCheckUserCanLogin = mocked(hasAccessCheck)

// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
const {useAuthMockState, mockDispatch} = mockState()

const wrapper = (props: {children: ReactElement}) => (
  <AuthContext.Provider
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    value={{
      ...useAuthMockState,
    }}
  >
    {props.children}
  </AuthContext.Provider>
)

const renderUseAuth = (withoutProvider = false) =>
  renderHook(() => useAuth(), {
    wrapper: withoutProvider ? undefined : wrapper,
  })

describe('AuthContext', () => {
  const testEmailAddress = 'test@test.com'
  const testPassword = 'Password123'
  const testFirstName = 'joe'
  const testLastName = 'bloggs'
  const testCode = '1000'
  const membership: UserMembership = {
    name: 'test-app',
    type: 'gym-management',
    url: 'https://test.com',
    id: '12345',
  }
  const testUrl = 'https://testgym.com'

  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(Auth, 'currentAuthenticatedUser').mockResolvedValue(cognitoUserMock)
    jest.spyOn(Auth, 'signIn').mockResolvedValue(cognitoUserMock)
    jest.spyOn(Auth, 'completeNewPassword').mockResolvedValue(cognitoUserMock)
    jest.spyOn(Auth, 'signOut').mockImplementation()
    jest.spyOn(Auth, 'signUp').mockImplementation()
    jest.spyOn(Auth, 'resendSignUp').mockImplementation()
    jest.spyOn(Auth, 'forgotPasswordSubmit').mockImplementation()
    jest.spyOn(Auth, 'confirmSignUp').mockImplementation()
    jest.spyOn(Auth, 'changePassword').mockImplementation()
    jest.spyOn(Auth, 'federatedSignIn').mockImplementation()

    mockCheckUserCanLogin.mockResolvedValue(true)
  })

  it('should throw an error is hook not wrapped in the correct provider', () => {
    try {
      renderUseAuth(true)
    } catch (e) {
      const error = e as Error
      expect(error.message).toBe('useAuth must be wrapped in an AuthProvider')
    }
  })

  it('should return an initial state object by default', () => {
    const {result} = renderUseAuth()
    expect(result.current.state).toEqual(initialState)
  })

  describe('signUserIn', () => {
    it('should return signUserIn function', () => {
      const {result} = renderUseAuth()
      expect(result.current.signUserIn).toBeTruthy()
    })

    it('should remove the temp password from local storage', async () => {
      const {result} = renderUseAuth()
      await result.current.signUserIn({
        emailAddress: testEmailAddress,
        password: testPassword,
        url: testUrl,
        stage: 'dev',
      })

      expect(mockRemoveItem).toHaveBeenCalledWith(TEMP_LOCAL_STORAGE_PWD_KEY)
    })

    it('should call Auth signIn with email and password', async () => {
      const {result} = renderUseAuth()
      await result.current.signUserIn({
        emailAddress: testEmailAddress,
        password: testPassword,
        url: testUrl,
        stage: 'dev',
      })

      await waitFor(() =>
        expect(Auth.signIn).toHaveBeenCalledWith(testEmailAddress, testPassword),
      )
    })

    it('should handle a new password required challenge successfully', async () => {
      const challengedUser: ChallengedUser = {
        challengeName: 'NEW_PASSWORD_REQUIRED',
        familyName: '',
        givenName: '',
        email: mockCognitoUserAttributes.email,
      }

      jest.spyOn(Auth, 'signIn').mockResolvedValue(challengedUser)

      const {result} = renderUseAuth()
      await result.current.signUserIn({
        emailAddress: testEmailAddress,
        password: testPassword,
        url: testUrl,
        stage: 'dev',
      })

      await waitFor(() =>
        expect(Auth.completeNewPassword).toHaveBeenCalledWith(
          challengedUser,
          testPassword,
        ),
      )
    })

    it('should call Auth currentAuthenticatedUser function', async () => {
      const {result} = renderUseAuth()
      await result.current.signUserIn({
        emailAddress: testEmailAddress,
        password: testPassword,
        url: testUrl,
        stage: 'dev',
      })
      await waitFor(() => expect(Auth.currentAuthenticatedUser).toBeCalled())
    })

    it('should call LOGIN_SUCCESS when successful login occurs', async () => {
      const {result} = renderUseAuth()
      await result.current.signUserIn({
        emailAddress: testEmailAddress,
        password: testPassword,
        url: testUrl,
        stage: 'dev',
      })
      const {attributes} = cognitoUserMock

      await waitFor(() =>
        expect(mockDispatch).toHaveBeenCalledWith({
          type: ActionTypes.LOGIN_SUCCESS,
          userConfig: expect.anything(),
          user: {
            emailAddress: attributes.email,
            familyName: attributes.family_name,
            givenName: attributes.given_name,
            isTenantAdmin: attributes['custom:isTenantAdmin'],
            isMembaAdmin: attributes['custom:isMembaAdmin'],
            tenantId: attributes['custom:tenantId'],
          },
        }),
      )
    })

    it('should call refreshJwt to refresh the session', async () => {
      const {result} = renderUseAuth()
      await result.current.signUserIn({
        emailAddress: testEmailAddress,
        password: testPassword,
        url: testUrl,
      })

      await waitFor(() => expect(mockRefreshJwt).toHaveBeenCalled())
    })

    it('should call dispatch with LOGIN_FAILURE when error occurs', async () => {
      jest.spyOn(Auth, 'currentAuthenticatedUser').mockResolvedValue(null)
      const {result} = renderUseAuth()
      await result.current.signUserIn({
        emailAddress: testEmailAddress,
        password: testPassword,
        url: testUrl,
      })
      await waitFor(() =>
        expect(mockDispatch).toBeCalledWith({
          type: ActionTypes.LOGIN_FAILURE,
          error: expect.anything(),
        }),
      )
    })
  })

  describe('signUserOut', () => {
    it('should return signUserOut function', () => {
      const {result} = renderUseAuth()
      expect(result.current.signUserOut).toBeTruthy()
    })

    it('should call Auth signOut', async () => {
      const {result} = renderUseAuth()
      await result.current.signUserOut()

      expect(Auth.signOut).toHaveBeenCalled()
    })
  })

  describe('registerUser', () => {
    it('should return registerUser function', () => {
      const {result} = renderUseAuth()
      expect(result.current.registerUser).toBeTruthy()
    })

    it('should call Auth signUp with email and password', async () => {
      const {result} = renderUseAuth()
      const mockCreateAccountCallback = jest.fn()
      await result.current.registerUser({
        emailAddress: testEmailAddress,
        password: testPassword,
        fullName: `${testFirstName} ${testLastName}`,
        groupName: '',
        appId: '',
        signUpRedirectUrl: '',
        membership,
        createAccountCallback: mockCreateAccountCallback,
      })

      await waitFor(() =>
        expect(mockCreateAccountCallback).toHaveBeenCalledWith({
          emailAddress: testEmailAddress.trim().toLowerCase(),
          password: testPassword,
          lastName: testLastName,
          firstName: testFirstName,
          groupName: '',
          appId: '',
          signUpRedirectUrl: '',
          membership,
        }),
      )
    })

    it('should set password in temporary local storage', async () => {
      const {result} = renderUseAuth()
      await result.current.registerUser({
        emailAddress: testEmailAddress,
        password: testPassword,
        fullName: `${testFirstName} ${testLastName}`,
        groupName: '',
        appId: '',
        signUpRedirectUrl: '',
        membership: expect.anything(),
        createAccountCallback: jest.fn(),
      })

      expect(mockSetItem).toHaveBeenCalledWith(TEMP_LOCAL_STORAGE_PWD_KEY, testPassword)
    })
  })

  describe('refreshUserSession', () => {
    it('should return refreshUserSession function', () => {
      const {result} = renderUseAuth()
      expect(result.current.refreshUserSession).toBeTruthy()
    })

    it('should call refreshJwt to refresh the session', async () => {
      const {result} = renderUseAuth()
      await result.current.refreshUserSession()

      await waitFor(() => expect(mockRefreshJwt).toHaveBeenCalled())
    })
  })

  describe('completeResetPassword', () => {
    it('should return completeResetPassword function', () => {
      const {result} = renderUseAuth()
      expect(result.current.completeResetPassword).toBeTruthy()
    })

    it('should call Auth forgotPasswordComplete to reset the password', async () => {
      const {result} = renderUseAuth()
      await result.current.completeResetPassword({
        emailAddress: testEmailAddress,
        code: testCode,
        password: testPassword,
      })

      await waitFor(() => expect(Auth.forgotPasswordSubmit).toHaveBeenCalled())
    })
  })

  describe('completeRegistration', () => {
    it('should return completeRegistration function', () => {
      const {result} = renderUseAuth()
      expect(result.current.completeRegistration).toBeTruthy()
    })

    it('should call Auth confirmSignUp to reset the password', async () => {
      const {result} = renderUseAuth()
      await result.current.completeRegistration({
        emailAddress: testEmailAddress,
        code: testCode,
      })

      await waitFor(() =>
        expect(Auth.confirmSignUp).toHaveBeenCalledWith(testEmailAddress, testCode),
      )
    })
  })

  describe('resendConfirmationEmail', () => {
    it('should return resendConfirmationEmail function', () => {
      const {result} = renderUseAuth()
      expect(result.current.resendConfirmationEmail).toBeTruthy()
    })

    it('should call Auth resendSignUp to resend email confirmation', async () => {
      const {result} = renderUseAuth()
      await result.current.resendConfirmationEmail(testEmailAddress)

      await waitFor(() =>
        expect(Auth.resendSignUp).toHaveBeenCalledWith(testEmailAddress),
      )
    })
  })

  describe('changePassword', () => {
    it('should return changePassword function', () => {
      const {result} = renderUseAuth()
      expect(result.current.changePassword).toBeTruthy()
    })

    it('should call Auth changePassword to change the password', async () => {
      const oldPassword = 'oldPassword1!'
      const newPassword = 'newPassword1!'
      const user = mock<CognitoUser>()

      const {result} = renderUseAuth()

      await result.current.changePassword({
        oldPassword,
        newPassword,
        user,
      })

      await waitFor(() =>
        expect(Auth.changePassword).toHaveBeenCalledWith(user, oldPassword, newPassword),
      )
    })
  })

  describe('Google sign in', () => {
    it('should return googleSignIn function', () => {
      const {result} = renderUseAuth()
      expect(result.current.googleSignIn).toBeTruthy()
    })

    it('should call googleSignIn with correct parameters', async () => {
      const {result} = renderUseAuth()
      await result.current.googleSignIn()

      await waitFor(() =>
        expect(Auth.federatedSignIn).toHaveBeenCalledWith({
          provider: CognitoHostedUIIdentityProvider.Google,
        }),
      )
    })
  })

  describe('Apple sign in', () => {
    it('should return appleSignIn function', () => {
      const {result} = renderUseAuth()
      expect(result.current.appleSignIn).toBeTruthy()
    })

    it('should call appleSignIn with correct parameters', async () => {
      const {result} = renderUseAuth()
      await result.current.appleSignIn()

      await waitFor(() =>
        expect(Auth.federatedSignIn).toHaveBeenCalledWith({
          provider: CognitoHostedUIIdentityProvider.Apple,
        }),
      )
    })
  })
})
