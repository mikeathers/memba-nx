import type {
  CognitoIdToken,
  CognitoUserSession,
  CognitoRefreshToken,
  CognitoAccessToken,
} from 'amazon-cognito-identity-js'
import {CognitoUserAttributes} from '../../../types'
export const mockToken = '111'

export const mockCognitoIdToken: CognitoIdToken = {
  payload: {},
  getJwtToken: () => mockToken,
  getExpiration: () => 0,
  getIssuedAt: () => 0,
  decodePayload: () => [{id: 'test'}],
}

export const mockGetIdToken = () => mockCognitoIdToken

const cognitoRefreshToken: CognitoRefreshToken = {getToken: () => 'test'}
const cognitoAccessToken: CognitoAccessToken = {
  payload: {},
  getJwtToken: () => mockToken,
  getExpiration: () => 0,
  getIssuedAt: () => 0,
  decodePayload: () => [{id: 'test'}],
}
export const mockCognitoUserSession: CognitoUserSession = {
  getIdToken: mockGetIdToken,
  getRefreshToken: () => cognitoRefreshToken,
  getAccessToken: () => cognitoAccessToken,
  isValid: () => false,
}

export const mockCognitoUserAttributes: CognitoUserAttributes = {
  email: 'test@test.com',
  family_name: 'user',
  given_name: 'test',
  picture: '',
  phone_number: '07777777777',
  address: '1st street, testsville',
  'custom:isTenantAdmin': false,
  'custom:isMembaAdmin': false,
  'custom:tenantId': '111',
}
