import {renderHook, waitFor} from '@testing-library/react'
import mocked = jest.mocked

import {useSafeAsync} from './use-safe-async.hook'
import {useSafeAsyncReducer} from './use-safe-async.reducer'
import {ActionTypes} from './use-safe-async.types'

jest.mock('./use-safe-async.reducer')

const mockedReducer = mocked(useSafeAsyncReducer)
const mockDispatch = jest.fn()

const renderUseSafeAsync = () =>
  renderHook(() => useSafeAsync(), {
    wrapper: undefined,
  })

describe('useSafeAsync', () => {
  beforeEach(() => {
    mockedReducer.mockReturnValue({state: {}, dispatch: mockDispatch})
  })

  describe('run', () => {
    const successfulDataResponse = {test: 'stubbed-data'}
    const successfulPromise = Promise.resolve(successfulDataResponse)
    const normalErrorMessage = 'normal error message'
    const unusualErrorMessage = 'unusual error message'
    const nonError = {data: null, status: 'rejected', reason: 'failed attempt'}

    it('should call dispatch with a PENDING action', async () => {
      const {result} = renderUseSafeAsync()
      await result.current.run(successfulPromise)
      expect(mockDispatch).toHaveBeenCalledWith({status: ActionTypes.PENDING})
    })

    it('should call dispatch with a RESOLVED action and response data when the promise succeeds', async () => {
      const {result} = renderUseSafeAsync()
      await result.current.run(successfulPromise)
      await waitFor(() =>
        expect(mockDispatch).toHaveBeenLastCalledWith({
          status: ActionTypes.RESOLVED,
          data: successfulDataResponse,
        }),
      )
    })

    it('should return the response data', async () => {
      const {result} = renderUseSafeAsync()
      const response = await result.current.run(successfulPromise)
      await waitFor(() => expect(response).toBe(successfulDataResponse))
    })

    it('should call dispatch with REJECTED action and error is promise throws a standard error', async () => {
      const normalError = new Error(normalErrorMessage)
      const failedPromise = Promise.reject(normalError)
      const {result} = renderUseSafeAsync()

      await result.current.run(failedPromise)

      await waitFor(() =>
        expect(mockDispatch).toHaveBeenLastCalledWith({
          status: ActionTypes.REJECTED,
          error: normalError,
        }),
      )
    })

    it('should return a standard error when a standard error is thrown', async () => {
      const normalError = new Error(normalErrorMessage)
      const failedPromise = Promise.reject(normalError)
      const {result} = renderUseSafeAsync()

      const response = await result.current.run(failedPromise)

      await waitFor(() => expect(response).toBe(normalError))
    })

    it('should call dispatch with REJECTED action and error is promise throws an unusual error with a message', async () => {
      const unusualError = new ReferenceError(unusualErrorMessage)
      const failedPromise = Promise.reject(unusualError)
      const {result} = renderUseSafeAsync()

      await result.current.run(failedPromise)

      await waitFor(() =>
        expect(mockDispatch).toHaveBeenLastCalledWith({
          status: ActionTypes.REJECTED,
          error: new Error(unusualErrorMessage),
        }),
      )
    })

    it('should return an unusual error with a message when an unusual error in thrown', async () => {
      const unusualError = new ReferenceError(unusualErrorMessage)
      const failedPromise = Promise.reject(unusualError)
      const {result} = renderUseSafeAsync()

      const response = await result.current.run(failedPromise)

      await waitFor(() => expect(response).toBe(unusualError))
    })

    it('should call dispatch with REJECTED action and error is promise throws an unhandled error with no message', async () => {
      const failedPromise = Promise.reject(nonError)
      const {result} = renderUseSafeAsync()

      await result.current.run(failedPromise)

      await waitFor(() =>
        expect(mockDispatch).toHaveBeenLastCalledWith({
          status: ActionTypes.REJECTED,
          error: new Error(JSON.stringify(nonError)),
        }),
      )
    })

    it('should return an unhandled error with no message when an unhandled error is thrown', async () => {
      const failedPromise = Promise.reject(nonError)
      const {result} = renderUseSafeAsync()

      const response = await result.current.run(failedPromise)

      await waitFor(() => expect(response).toEqual(new Error(JSON.stringify(nonError))))
    })
  })
})
