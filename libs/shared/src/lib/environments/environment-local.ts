import {IEnvironment} from './environment.types'

export const environmentLocal: IEnvironment = {
  USERS_API: 'https://users.dev.memba.co.uk',
  TENANTS_API: 'https://tenants.dev.memba.co.uk',
  USER_POOL_ID: 'eu-west-2_O3gVXNPRu',
  IDENTITY_POOL_ID: 'eu-west-2:84901c60-5169-4948-8f0e-d55e87bc127e',
  USER_WEB_CLIENT_ID: '1s5g5auqd5lv6h9ucut5d7g05m',
  START_APP: 'http://localhost:4300',
  ID_APP: 'http://localhost:4200',
  GYM_APP: 'http://localhost:4400',
  WEBSITE_HOME: 'https://dev.memba.co.uk',
  COOKIE_STORAGE_DOMAIN: 'localhost',
  COOKIE_STORAGE_SECURE: '',
  COOKIE_STORAGE_PATH: '/',
  COOKIE_STORAGE_EXPIRES: '365',
}
