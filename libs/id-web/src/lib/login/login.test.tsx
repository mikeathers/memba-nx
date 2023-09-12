import {render} from '@testing-library/react'
import {Login} from './login.component'
import {AuthProvider, login} from '@memba-nx/shared'

const renderComponent = () =>
  render(
    <AuthProvider>
      <Login content={login} />
    </AuthProvider>,
  )

describe('Sign in', () => {
  it('should render the sign in component', () => {
    const {getByText} = renderComponent()
    expect(getByText('Log in to continue')).toBeInTheDocument()
  })
})
