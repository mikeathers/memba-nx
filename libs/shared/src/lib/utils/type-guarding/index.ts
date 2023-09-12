//ts-ignore
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CognitoError,
  OKResponse,
  BadResponse,
  GetTenantUserApiResponse,
} from '../../types'

export const errorHasMessage = (obj: any): obj is Error => {
  return typeof obj === 'object' && 'message' in obj
}

export const isCognitoError = (obj: any): obj is CognitoError => {
  return 'code' in obj && 'message' in obj && 'name' in obj
}

export const isHttpOKResponse = (obj: any): obj is OKResponse => {
  return 'body' in obj && 'statusCode' in obj
}

export const isHttpBadResponse = (obj: any): obj is BadResponse => {
  return 'message' in obj
}

export const hasResult = (obj: any): obj is GetTenantUserApiResponse => {
  return 'result' in obj
}
