import {AuthContextValue} from '../../../lib'
import {ActionTypes} from '../../../lib/hooks/use-safe-async/use-safe-async.types'

const mockSignUserIn = jest.fn()
const mockDispatch = jest.fn()
const mockRegisterUser = jest.fn()
const mockRegisterTenant = jest.fn()
const mockSignUserOut = jest.fn()
const mockRefreshUserSession = jest.fn()
const mockRun = jest.fn()
const mockSendForgotPasswordLink = jest.fn()
const mockResendConfirmationEmail = jest.fn()
const mockCompleteResetPassword = jest.fn()
const mockCompleteRegistration = jest.fn()
const mockChangePassword = jest.fn()
const mockAddUserToState = jest.fn()
const mockGoogleSignIn = jest.fn()
const mockAppleSignIn = jest.fn()

const useAuthMockState: AuthContextValue = {
  state: {
    isLoading: true,
    error: undefined,
    isAuthenticated: false,
    isAuthenticating: true,
    user: undefined,
    userConfig: undefined,
  },
  dispatch: mockDispatch,
  registerUser: mockRegisterUser,
  registerTenant: mockRegisterTenant,
  signUserIn: mockSignUserIn,
  signUserOut: mockSignUserOut,
  refreshUserSession: mockRefreshUserSession,
  sendForgotPasswordLink: mockSendForgotPasswordLink,
  resendConfirmationEmail: mockResendConfirmationEmail,
  completeResetPassword: mockCompleteResetPassword,
  completeRegistration: mockCompleteRegistration,
  changePassword: mockChangePassword,
  addUserToState: mockAddUserToState,
  googleSignIn: mockGoogleSignIn,
  appleSignIn: mockAppleSignIn,
}

const useSafeAsyncMockState = {
  isIdle: false,
  isLoading: false,
  isError: false,
  isSuccess: false,
  resetAsyncState: jest.fn(),
  setError: jest.fn(),
  error: null,
  status: ActionTypes.IDLE,
  data: {},
  run: mockRun,
}

export const mockState = () => ({
  mockRun,
  mockSignUserIn,
  mockSignUserOut,
  mockRegisterUser,
  mockRefreshUserSession,
  mockDispatch,
  useAuthMockState,
  useSafeAsyncMockState,
  mockSendForgotPasswordLink,
  mockResendConfirmationEmail,
  mockCompleteResetPassword,
  mockCompleteRegistration,
  mockChangePassword,
  mockAddUserToState,
  mockGoogleSignIn,
  mockAppleSignIn,
})
