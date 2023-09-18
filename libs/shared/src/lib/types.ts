import type {FormikErrors, FormikValues} from 'formik'

/******************* ********************/
/*************** DATA MODELS ************/
/******************* ********************/

export type AuthUser = {
  emailAddress: string
  familyName: string
  givenName: string
  isTenantAdmin?: boolean
  isMembaAdmin?: boolean
  tenantId?: string
}

export type MembershipPricing = {
  name: string
  price: number
}

export type MembaApp = {
  name: string
  memberships: MembershipPricing[]
  id: string
  url: string
  tier: string
  type: 'gym-management'
  tenantId: string
  groupName: string
  users: MembaUser[] | []
}

export type Tenant = {
  id: string
  admins: string[]
  apps: MembaApp[]
}

export type MembaUser = {
  authenticatedUserId: string
  emailAddress: string
  firstName: string
  lastName: string
  id: string
  groupName: string
  isTenantAdmin: boolean
  isMembaAdmin: boolean
  tenantId: string
  tenant: Tenant
  appId: string
  signUpRedirectUrl: string
  memberships: UserMembership[]
}

export type TenantApp = {
  name: string
  memberships: MembershipPricing[]
  id: string
  url: string
  tier: string
  type: 'gym-management'
}

export type UserMembership = {
  name: string
  id: string
  url: string
  type: 'gym-management'
}

export type CognitoUserAttributes = {
  email: string
  family_name: string
  given_name: string
  picture?: string
  phone_number?: string
  address?: string
  'custom:isTenantAdmin'?: boolean
  'custom:isMembaAdmin'?: boolean
  'custom:tenantId'?: string
}

/******************* ********************/
/*************** ERRORS *****************/
/******************* ********************/

export type FormikError =
  | string
  | string[]
  //eslint-disable-next-line
  | FormikErrors<any>
  //eslint-disable-next-line
  | FormikErrors<any>[]
  | undefined

export type CognitoError = {
  name: string
  code: string
  message: string
}

export type ErrorWithMessage = {
  message: string
}

/******************* ********************/
/*************** FORMS ******************/
/******************* ********************/

export type RegisterTenantProps = FormikValues & {
  emailAddress: string
  password: string
  fullName: string
}

export type ForgotPasswordFormDetails = Pick<RegisterTenantProps, 'emailAddress'>
export type ResetPasswordFormDetails = Pick<RegisterTenantProps, 'password'>

export type LoginFormDetails = FormikValues & {
  emailAddress: string
  password: string
  url?: string
}

export type NewCustomerFormDetails = FormikValues & {
  emailAddress?: string
  password?: string
  firstName?: string
  lastName?: string
}

/******************* ********************/
/*************** RESPONSES **************/
/******************* ********************/

export type RegisterTenantResponse = {
  statusCode: number
  body: {
    id: string
    tenantName: string
    tier: string
    firstName: string
    lastName: string
    emailAddress: string
    addressLineOne: string
    addressLineTwo: string
    doorNumber: string
    townCity: string
    postCode: string
    tenantUrl: string
  }
}

export type GetTenantUserApiResponse = {
  body: MembaUser
  statusCode: number
}

export type BaseResponse = {
  message: string
  statusCode: number
}

export type BadResponse = BaseResponse
export type OKResponse = BaseResponse
export type UnauthorizedResponse = BaseResponse

/******************* ********************/
/*************** CONTENT ****************/
/******************* ********************/

export type SharedContent = {
  allRightsReserved: string
  somethingWentWrong: string
  goHome: string
  getInTouch: string
}

/*************** ID WEB ****************/

export type ConfirmAccountContent = {
  heading: string
  emailSentMessage: string
  confirmationInstruction: string
  resendConfirmationEmail: string
  checkSpamFolder: string
  sendAgain: string
}

export type SignUpContent = {
  appName: string
  heading: string
  termsOfService: string
  login: string
  userAlreadyExistsError: string
  fullNameRequireError: string
  genericError: string
  form: {
    fullName: string
    fullNamePlaceholder: string
    email: string
    emailPlaceholder: string
    password: string
    passwordPlaceholder: string
    signUpCta: string
    validation: {
      passwordValidationMessage: string
      passwordLengthMessage: string
      emailAddress: string
      emailAddressFormat: string
      fullName: string
      password: string
    }
  }
}

export type LoginContent = {
  appName: string
  heading: string
  signUp: string
  cantLogin: string
  genericError: string
  userNotFoundError: string
  incorrectUserNameOrPassword: string
  form: {
    email: string
    emailPlaceholder: string
    password: string
    passwordPlaceholder: string
    loginCta: string
    validation: {
      emailAddress: string
      emailAddressFormat: string
      password: string
    }
  }
}

export type ForgotPasswordContent = {
  heading: string
  message: string
  sendLinkCta: string
  returnToLogin: string
  form: {
    emailPlaceholder: string
    validation: {
      emailAddress: string
      emailAddressFormat: string
    }
  }
}

export type ResetPasswordContent = {
  heading: string
  submitCta: string
  form: {
    passwordPlaceholder: string
    validation: {
      password: string
      passwordValidationMessage: string
      passwordLengthMessage: string
    }
  }
}

/*************** START WEB ****************/

export type AppsContent = {
  heading: string
  gymManagementTitle: string
  noAppsMessage: string
  addAppMessage: string
  addAnotherAppMessage: string
}

export type MembershipsContent = {
  heading: string
}

export type AccountContent = {
  heading: string
}

export type GymManagementContent = {
  heading: string
  goBack: string
  gymNameLabel: string
  gymDetails: string
  gymNamePlaceholder: string
  gymUrlSuffix: string
  gymUrlLabel: string
  gymMembershipsTitle: string
  gymNameExample: string
  gymMembershipName: string
  gymMembershipNamePlaceholder: string
  gymMembershipPricePlaceholder: string
  gymMembershipPrice: string
  yourMemberships: string
  noMemberships: string
  addMembership: string
  createCta: string
  noMembershipsError: string
  noGymNameError: string
  freeTierTitleText: string
  freeTierTitleNumber: string
  freeTierPricePerMonth: string
  freeTierNumberOfCustomer: string
  basicTierTitleText: string
  basicTierTitleNumber: string
  basicTierPricePerMonth: string
  basicTierNumberOfCustomer: string
  premiumTierTitleText: string
  premiumTierTitleNumber: string
  premiumTierPricePerMonth: string
  premiumTierNumberOfCustomer: string
  transactionalCosts: string
  select: string
  selectedText: string
  findOutMore: string
}

/*************** GYM WEB ****************/

export type AdminHomeContent = {
  heading: string
  users: string
}

export type HomeContent = {
  heading: string
}

export type UsersContent = {
  heading: string
}

export type MenuBarContent = {
  admin: {
    home: string
    users: string
  }
}
