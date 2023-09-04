export enum EnvironmentFromFile {
  usersApi = 'USERS_API',
  tenantsApi = 'TENANTS_API',
  userPoolId = 'USER_POOL_ID',
  identityPoolId = 'IDENTITY_POOL_ID',
  userWebClientId = 'USER_WEB_CLIENT_ID',
  startApp = 'START_APP',
  idApp = 'ID_APP',
  websiteHome = 'WEBSITE_HOME',
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
}

export const Env = {
  ...EnvironmentFromFile,
}

export type Env = EnvironmentFromFile

export type keys = keyof IEnvironment
