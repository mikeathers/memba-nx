export enum EnvironmentFromFile {
  usersApi = 'USERS_API',
  tenantsApi = 'TENANTS_API',
  userPoolId = 'USER_POOL_ID',
  identityPoolId = 'IDENTITY_POOL_ID',
  userWebClientId = 'USER_WEB_CLIENT_ID',
  startApp = 'START_APP',
  idApp = 'ID_APP',
  websiteHome = 'WEBSITE_HOME',
  cookieStorageDomain = 'COOKIE_STORAGE_DOMAIN',
  cookieStorageSecure = 'COOKIE_STORAGE_SECURE',
  cookieStoragePath = 'COOKIE_STORAGE_PATH',
  cookieStorageExpires = 'COOKIE_STORAGE_EXPIRES',
}

export interface IEnvironment extends Record<EnvironmentFromFile, string> {
  USERS_API: string
  TENANTS_API: string
  USER_POOL_ID: string
  IDENTITY_POOL_ID: string
  USER_WEB_CLIENT_ID: string
  START_APP: string
  ID_APP: string
  WEBSITE_HOME: string
  COOKIE_STORAGE_DOMAIN: string
  COOKIE_STORAGE_SECURE: string
  COOKIE_STORAGE_PATH: string
  COOKIE_STORAGE_EXPIRES: string
}

export const Env = {
  ...EnvironmentFromFile,
}

export type Env = EnvironmentFromFile

export type keys = keyof IEnvironment
