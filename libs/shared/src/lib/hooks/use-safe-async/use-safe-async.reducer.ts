import React from 'react'

import type {UseSafeAsyncReducerAction, UseSafeAsyncState} from './use-safe-async.types'
import {ActionTypes} from './use-safe-async.types'

interface SafeAsyncReturnValue<T> {
  state: UseSafeAsyncState<T>
  dispatch: React.Dispatch<UseSafeAsyncReducerAction<T>>
}

export const useSafeAsyncReducer = <T>(
  initialState: UseSafeAsyncState<T> | undefined,
): SafeAsyncReturnValue<T> => {
  const initialStateRef = React.useRef({
    status: ActionTypes.IDLE,
    data: null,
    error: null,
    ...initialState,
  })

  const reducer = (
    state: UseSafeAsyncState<T>,
    action: UseSafeAsyncReducerAction<T>,
  ): UseSafeAsyncState<T> => {
    return {
      ...state,
      ...action,
    }
  }

  const [{status, data, error}, dispatch] = React.useReducer(
    reducer,
    initialStateRef.current,
  )

  return {
    state: {status, data, error},
    dispatch,
  }
}
