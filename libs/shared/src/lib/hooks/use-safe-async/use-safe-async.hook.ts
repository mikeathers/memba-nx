import React from 'react'
import {errorHasMessage} from '../../utils'

import {useSafeAsyncReducer} from './use-safe-async.reducer'
import type {
  UseSafeAsyncReducerAction,
  UseSafeAsyncReturnValue,
  UseSafeAsyncState,
} from './use-safe-async.types'
import {ActionTypes} from './use-safe-async.types'

const useSafeDispatch = <T>(dispatch: React.Dispatch<UseSafeAsyncReducerAction<T>>) => {
  const mounted = React.useRef(false)
  React.useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  return React.useCallback(
    (action: UseSafeAsyncReducerAction<T>) => {
      if (mounted.current) {
        return dispatch(action)
      } else return undefined
    },
    [dispatch],
  )
}

export const useSafeAsync = <T>(
  initialState?: UseSafeAsyncState<T>,
): UseSafeAsyncReturnValue<T> => {
  const {
    state: {status, data, error},
    dispatch,
  } = useSafeAsyncReducer(initialState)

  const safeDispatch = useSafeDispatch(dispatch)

  const setError = React.useCallback(
    (newError: Error) => safeDispatch({status: ActionTypes.REJECTED, error: newError}),
    [safeDispatch],
  )

  const resetState = React.useCallback(
    () => safeDispatch({status: ActionTypes.IDLE, data: null, error: null}),
    [safeDispatch],
  )

  const run = React.useCallback(
    async (promise: Promise<T>) => {
      if (!promise.then) {
        throw new Error(
          "The argument passed to useSafeAsync().run must be a promise. Maybe a function that's passed isn't returning anything?",
        )
      }

      safeDispatch({status: ActionTypes.PENDING})

      try {
        const promiseData = await promise
        safeDispatch({status: ActionTypes.RESOLVED, data: promiseData})
        return promiseData
      } catch (promiseError) {
        console.log({promiseError})
        if (promiseError instanceof Error) {
          safeDispatch({status: ActionTypes.REJECTED, error: promiseError})
          return promiseError
        }

        if (errorHasMessage(promiseError)) {
          const errorWithMessage = new Error(promiseError.message)
          safeDispatch({
            status: ActionTypes.REJECTED,
            error: errorWithMessage,
          })
          return errorWithMessage
        }

        const stringifyError = new Error(JSON.stringify(promiseError))
        safeDispatch({
          status: ActionTypes.REJECTED,
          error: stringifyError,
        })
        return stringifyError
      }
    },
    [safeDispatch],
  )

  return {
    isIdle: status === ActionTypes.IDLE,
    isLoading: status === ActionTypes.PENDING,
    isError: status === ActionTypes.REJECTED,
    isSuccess: status === ActionTypes.RESOLVED,
    resetAsyncState: resetState,
    setError,
    error,
    status,
    data,
    run,
  }
}
