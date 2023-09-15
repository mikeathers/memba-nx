export const TEMP_LOCAL_STORAGE_PWD_KEY = 'TEMP_LOCAL_STORAGE_PWD_KEY'
export const IDENTITY_LOCALSTORAGE_KEY = 'IDENTITY_LOCALSTORAGE_KEY'
export const JWT_LOCALSTORAGE_KEY = 'JWT_LOCALSTORAGE_KEY'
interface PAGE_ROUTES {
  APPS: string
  MEMBERSHIPS: string
  GYM_MANAGEMENT: string
  HOME: string
  SIGN_UP: string
  CONFIRM_ACCOUNT: string
  LOGIN: string
  FORGOT_PASSWORD: string
  RESET_PASSWORD: string
  ADMIN: {
    HOME: string
    USERS: string
  }
}

export const PAGE_ROUTES: PAGE_ROUTES = {
  APPS: '/apps',
  GYM_MANAGEMENT: '/gym-management',
  MEMBERSHIPS: '/memberships',
  HOME: '/',
  SIGN_UP: '/signup',
  CONFIRM_ACCOUNT: '/confirm-account',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ADMIN: {
    HOME: '/admin/home',
    USERS: '/admin/users',
  },
}

interface ENDPOINTS {
  CREATE_TENANT_ACCOUNT: string
  GET_TENANT_ACCOUNT: string
  GET_USER_ACCOUNT: string
  GET_TENANT: string
  CREATE_GYM_APP: string
  GET_APP: string
  GET_BASIC_APP: string
  HAS_ACCESS_TO_APP: string
  CREATE_USER_ACCOUNT: string
  ADMIN_CHECK: string
}

export const ENDPOINTS: ENDPOINTS = {
  GET_TENANT_ACCOUNT: '/tenants/get-account',
  GET_USER_ACCOUNT: '/users/get-account',
  CREATE_USER_ACCOUNT: 'users/create-account',
  CREATE_TENANT_ACCOUNT: '/tenants/create-account',
  GET_TENANT: 'get-tenant',
  GET_APP: 'get-app',
  GET_BASIC_APP: 'get-basic-app',
  HAS_ACCESS_TO_APP: 'has-access',
  CREATE_GYM_APP: 'create-gym-app',
  ADMIN_CHECK: 'tenants/admin-check',
}

export enum TIERS {
  FREE = 'Free',
  BASIC = 'Basic',
  PREMIUM = 'Premium',
}
