import {render} from '@testing-library/react'
import {Login} from './login.component'
import {login} from '@/content'

const renderComponent = () => render(<Login content={login} />)

describe('Sign in', () => {
  it('should render the sign in component', () => {
    const {getByText} = renderComponent()
    expect(getByText('Log in to continue')).toBeInTheDocument()
  })
})
