'use client'
import type React from 'react'
import {ToastContainer} from 'react-toastify'
import {Auth} from '@aws-amplify/auth'

import {Env, readFromEnv, AuthProvider} from '@memba-nx/shared'
import {Footer} from '@memba-labs/design-system'

import {Layout} from './app.styles'
import {AppContent} from './app-content'

import './global.css'
import 'react-toastify/dist/ReactToastify.css'

export const App = ({children}: {children: React.ReactElement}) => {
  const cookieStorage = {
    domain: `${readFromEnv(Env.cookieStorageDomain)}`,
    secure: Boolean(`${readFromEnv(Env.cookieStorageSecure)}`),
    path: `${readFromEnv(Env.cookieStoragePath)}`,
    expires: Number(`${readFromEnv(Env.cookieStorageExpires)}`),
  }
  Auth.configure({
    mandatorySignIn: false,
    region: 'eu-west-2',
    userPoolId: `${readFromEnv(Env.userPoolId)}`,
    identityPoolId: `${readFromEnv(Env.identityPoolId)}`,
    userPoolWebClientId: `${readFromEnv(Env.userWebClientId)}`,
    ssr: true,
    cookieStorage,
  })

  return (
    <AuthProvider>
      <Layout>
        <AppContent>{children}</AppContent>
        <Footer />
        <ToastContainer
          autoClose={false}
          position="bottom-left"
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className={'toast-position'}
        />
      </Layout>
    </AuthProvider>
  )
}
