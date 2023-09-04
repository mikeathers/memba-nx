import type {AuthReducerAction, AuthState} from './auth.types'
import {ActionTypes} from './auth.types'

export const initialState: AuthState = {
  isLoading: true,
  error: undefined,
  isAuthenticated: false,
  isAuthenticating: true,
  user: undefined,
  userConfig: undefined,
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const authReducer = (state: AuthState, action: AuthReducerAction): AuthState => {
  switch (action.type) {
    case ActionTypes.IS_LOGGING_IN: {
      return initialState
    }
    case ActionTypes.IS_LOADING: {
      return {...initialState, isLoading: true}
    }
    case ActionTypes.LOGIN_SUCCESS: {
      return {
        ...initialState,
        isLoading: false,
        error: undefined,
        isAuthenticated: true,
        isAuthenticating: false,
        user: action.user,
        userConfig: action.userConfig,
      }
    }
    case ActionTypes.LOGIN_FAILURE: {
      return {
        ...initialState,
        isLoading: false,
        error: action.error,
        isAuthenticating: false,
      }
    }
    case ActionTypes.LOGOUT_SUCCESS: {
      return {
        ...initialState,
        isLoading: false,
        isAuthenticating: false,
      }
    }
    default: {
      throw new Error(`Unsupported action type: ${JSON.stringify(action)}`)
    }
  }
}
