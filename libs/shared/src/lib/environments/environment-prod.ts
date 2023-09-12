import {IEnvironment} from './environment.types'

export const environmentProd: IEnvironment = {
  USERS_API: 'https://users.memba.co.uk',
  TENANTS_API: 'https://tenants.memba.co.uk',
  USER_POOL_ID: 'eu-west-2_eWg0ysJay',
  IDENTITY_POOL_ID: 'eu-west-2:1ee6f75f-c0d0-461a-bbf2-d2e203343f22',
  USER_WEB_CLIENT_ID: '69ffemp6aklgncfv39l44beupr',
  START_APP: 'https://start.memba.co.uk',
  ID_APP: 'https://id.memba.co.uk',
  WEBSITE_HOME: 'https://memba.co.uk',
  COOKIE_STORAGE_DOMAIN: 'memba.co.uk',
  COOKIE_STORAGE_SECURE: 'true',
  COOKIE_STORAGE_PATH: '/',
  COOKIE_STORAGE_EXPIRES: '2',
}
