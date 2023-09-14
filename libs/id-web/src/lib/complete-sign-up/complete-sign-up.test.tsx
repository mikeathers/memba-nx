import {render, waitFor} from '@testing-library/react'
import {mocked} from 'jest-mock'
import {useRouter, useSearchParams} from 'next/navigation'

import {
  getItemFromLocalStorage,
  PAGE_ROUTES,
  TEMP_LOCAL_STORAGE_PWD_KEY,
  useSafeAsync,
  AuthProvider,
  useAuth,
} from '@memba-nx/shared'

import {CompleteSignUp} from './complete-sign-up.component'
import {mockCognitoUserAttributes, mockState} from '@memba-nx/shared/test-support'

jest.mock('@memba-nx/shared', () => ({
  __esModule: true,
  ...jest.requireActual('@memba-nx/shared'),
  useAuth: jest.fn(),
  useSafeAsync: jest.fn(),
  getItemFromLocalStorage: jest.fn(),
}))
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}))

const mockUseSafeAsync = mocked(useSafeAsync)
const mockUseAuth = mocked(useAuth)
const mockPush = jest.fn()
const mockRouter = mocked(useRouter)
const mockSearchParams = mocked(useSearchParams)
const mockGetItemFromLocalStorage = mocked(getItemFromLocalStorage)

const {useSafeAsyncMockState, useAuthMockState, mockSignUserIn, mockRun} = mockState()

const renderComponent = () =>
  render(
    <AuthProvider>
      <CompleteSignUp />
    </AuthProvider>,
  )

const mockEmail = 'test@test.com'
const mockCode = '1234'
const mockPassword = 'Password1!'

const mockGet = jest.fn((param) => {
  if (param === 'code') return mockCode
  if (param === 'emailAddress') return mockEmail
  return null
})

describe('Complete sign up', () => {
  beforeEach(() => {
    mockUseSafeAsync.mockReturnValue(useSafeAsyncMockState)
    mockUseAuth.mockReturnValue(useAuthMockState)
    mockRouter.mockReturnValue({
      push: mockPush,
      ...expect.anything(),
    })
    mockSearchParams.mockReturnValue({
      get: mockGet,
      ...expect.anything(),
    })
  })

  it('should show a loading component on first render', () => {
    const {getByText} = renderComponent()

    expect(getByText('Loading')).toBeInTheDocument()
  })

  it('should call complete registration on first load', () => {
    renderComponent()
    expect(useAuthMockState.completeRegistration).toHaveBeenCalledWith({
      emailAddress: mockEmail,
      code: mockCode,
    })
  })

  it('should call getItemFromLocalStorage when complete registration has been successful', () => {
    mockUseSafeAsync.mockReturnValue({...useSafeAsyncMockState, isSuccess: true})
    renderComponent()

    expect(mockGetItemFromLocalStorage).toHaveBeenCalledWith(TEMP_LOCAL_STORAGE_PWD_KEY)
  })

  it('should call signUserIn if password has been found in local storage', () => {
    mockUseSafeAsync.mockReturnValue({...useSafeAsyncMockState, isSuccess: true})
    mockGetItemFromLocalStorage.mockReturnValue(mockPassword)
    renderComponent()

    expect(useAuthMockState.signUserIn).toHaveBeenCalledWith({
      emailAddress: mockEmail,
      password: mockPassword,
    })
  })

  it('should push the user to the app home page route if the user is signed in', async () => {
    mockSignUserIn.mockResolvedValue(mockCognitoUserAttributes)
    mockRun.mockResolvedValue(mockCognitoUserAttributes)
    mockUseSafeAsync.mockReturnValue({...useSafeAsyncMockState, isSuccess: true})
    mockGetItemFromLocalStorage.mockReturnValue(mockPassword)
    renderComponent()

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('http://localhost:4300'))
  })

  it('should push the user to the sign in page route if the user is not able to be signed in', async () => {
    mockSignUserIn.mockResolvedValue(null)
    mockRun.mockResolvedValue(null)
    mockUseSafeAsync.mockReturnValue({...useSafeAsyncMockState, isSuccess: true})
    mockGetItemFromLocalStorage.mockReturnValue(mockPassword)
    renderComponent()

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith(PAGE_ROUTES.LOGIN))
  })

  it('should push the user to the sign in page route if the users password is not found in local storage', async () => {
    mockSignUserIn.mockResolvedValue(null)
    mockRun.mockResolvedValue(null)
    mockUseSafeAsync.mockReturnValue({...useSafeAsyncMockState, isSuccess: true})
    mockGetItemFromLocalStorage.mockReturnValue(null)
    renderComponent()

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith(PAGE_ROUTES.LOGIN))
  })

  it('should push the user to the sign in page route if an error occurs', async () => {
    mockUseSafeAsync.mockReturnValue({...useSafeAsyncMockState, error: new Error()})
    renderComponent()

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith(PAGE_ROUTES.LOGIN))
  })
})
