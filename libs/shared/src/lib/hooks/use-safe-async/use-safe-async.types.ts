export enum ActionTypes {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export type Status =
  | ActionTypes.IDLE
  | ActionTypes.PENDING
  | ActionTypes.REJECTED
  | ActionTypes.RESOLVED

export type UseSafeAsyncState<T> = {
  status?: Status
  error?: Error | null
  data?: Record<string, string> | null | T
}

export type UseSafeAsyncReducerAction<T> =
  | {status: ActionTypes.IDLE; data: null; error: null}
  | {status: ActionTypes.PENDING}
  | {status: ActionTypes.RESOLVED; data: Record<string, string> | T}
  | {status: ActionTypes.REJECTED; error: Error}

export interface UseSafeAsyncReturnValue<T> {
  isIdle: boolean
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  setError: (newError: Error) => void
  error: Error | null | undefined
  status: Status | undefined
  data: Record<string, string> | null | undefined | T
  run: (promise: Promise<T>) => Promise<T | Error>
  resetAsyncState: () => void
}
