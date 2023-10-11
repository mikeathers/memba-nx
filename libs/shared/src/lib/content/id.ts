import {
  ConfirmAccountContent,
  ForgotPasswordContent,
  LoginContent,
  ResetPasswordContent,
  SignUpContent,
  AccountContent,
} from '../types'

const appName = 'Memba'

export const confirmAccount: ConfirmAccountContent = {
  heading: 'Check your inbox to log in',
  emailSentMessage:
    'To complete setup and log in, click the verification link in the email we’ve sent to {emailAddress}emailAddress{/emailAddress}',
  confirmationInstruction:
    'Check your email and follow the instructions to activate your account.',
  resendConfirmationEmail: 'Resend confirmation email',
  checkSpamFolder: 'Check your spam folder or ',
  sendAgain: 'Send again',
}

export const signUp: SignUpContent = {
  appName,
  heading: 'Sign up to continue',
  termsOfService:
    'By signing up, I accept the Memba Terms of Service and acknowledge the Privacy Policy.',
  login: 'Already have a memba account? Log in',
  userAlreadyExistsError: 'A user with the details you have provided already exists.',
  fullNameRequireError: '*Please enter your first and last name.',
  genericError: 'Something has gone wrong, please try again later or get in touch.',
  form: {
    fullName: 'Full name:',
    fullNamePlaceholder: 'Enter your full name',
    email: 'Email:',
    emailPlaceholder: 'Enter your email',
    password: 'Password:',
    passwordPlaceholder: 'Create a password',
    signUpCta: 'Sign up',
    validation: {
      passwordValidationMessage:
        '*Your password should include lowercase, uppercase, digits and symbols.',
      passwordLengthMessage: '*Your password should be at least 6 characters.',
      fullName: '*Please enter your full name',
      emailAddress: '*Please enter your email address',
      emailAddressFormat: '*Your email address is not valid',
      password: '*A password is required to set up your account',
    },
  },
}

export const login: LoginContent = {
  appName,
  heading: 'Log in to continue',
  signUp: 'Create an account',
  cantLogin: "Can't log in?",
  genericError: 'Something has gone wrong, please try again later or get in touch.',
  userNotFoundError: 'A user with the details provided has not been found.',
  incorrectUserNameOrPassword: 'The username or password provided was incorrect.',
  form: {
    email: 'Email:',
    emailPlaceholder: 'Enter your email',
    password: 'Password:',
    passwordPlaceholder: 'Enter your password',
    loginCta: 'Log in',
    validation: {
      emailAddress: '*Please enter your email address',
      emailAddressFormat: '*Your email address is not valid',
      password: '*Your password is required to log in to your account',
    },
  },
}

export const forgotPassword: ForgotPasswordContent = {
  heading: "Can't log in?",
  message: "We'll send a recovery link to:",
  sendLinkCta: 'Send recovery link',
  returnToLogin: 'Return to log in',
  form: {
    emailPlaceholder: 'Enter your email',
    validation: {
      emailAddress: '*Please enter your email address',
      emailAddressFormat: '*Your email address is not valid',
    },
  },
}

export const resetPassword: ResetPasswordContent = {
  heading: 'Choose a new password',
  submitCta: 'Continue',
  form: {
    passwordPlaceholder: 'Enter a new password',
    validation: {
      passwordValidationMessage:
        '*Your password should include lowercase, uppercase, digits and symbols.',
      passwordLengthMessage: '*Your password should be at least 6 characters.',
      password: '*A password is required to set up your account',
    },
  },
}

export const accountContent: AccountContent = {
  heading: 'Account details',
  changeAvatar: 'Change avatar',
  updateAccountCta: 'Update account details',
  form: {
    email: 'Email:',
    emailPlaceholder: 'Enter your email',
    firstName: 'First name:',
    firstNamePlaceholder: 'Enter your first name',
    lastName: 'Last name:',
    lastNamePlaceholder: 'Enter your last name',
    validation: {
      emailAddress: '*Please enter your email address',
      emailAddressFormat: '*Your email address is not valid',
      firstName: '*Please enter your first name',
      lastName: '*Please enter your last name',
    },
  },
}
