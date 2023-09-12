import React from 'react'

import {App} from './app'
import {StyledComponentsRegistry} from './registry'

import './global.css'

export const metadata = {
  title: 'Memba | Memberships done right.',
  description: 'Generated by create next app',
}

export default function RootLayout({children}: {children: JSX.Element}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <StyledComponentsRegistry>
          <App>{children}</App>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
