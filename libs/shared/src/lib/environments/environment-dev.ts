import {IEnvironment} from './environment.types'

export const environmentDev: IEnvironment = {
  USERS_API: 'https://users.dev.memba.co.uk',
  TENANTS_API: 'https://tenants.dev.memba.co.uk',
  USER_POOL_ID: 'eu-west-2_O3gVXNPRu',
  IDENTITY_POOL_ID: 'eu-west-2:84901c60-5169-4948-8f0e-d55e87bc127e',
  USER_WEB_CLIENT_ID: '1s5g5auqd5lv6h9ucut5d7g05m',
  START_APP: 'https://start.dev.memba.co.uk',
  ID_APP: 'https://id.dev.memba.co.uk',
  GYM_APP: '',
  WEBSITE_HOME: 'https://dev.memba.co.uk',
  COOKIE_STORAGE_DOMAIN: 'dev.memba.co.uk',
  COOKIE_STORAGE_SECURE: 'true',
  COOKIE_STORAGE_PATH: '/',
  COOKIE_STORAGE_EXPIRES: '2',
  PRE_SIGNED_URL: 'https://bgioy77wc0.execute-api.eu-west-2.amazonaws.com/prod',
  IMAGE_UPLOAD_BUCKET_NAME:
    'https://idwebstack-nextjs-image-uploads.s3.eu-west-2.amazonaws.com/',
}
