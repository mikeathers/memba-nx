import styled from 'styled-components'
import {spacing} from '../styles'

export * from './svg-icon'
export * from './text'
export * from './title-bar'
export * from './pricing-card'
export * from './button'
export * from './text-input'
export * from './loading-spinner'
export * from './loading'
export * from './center-box'
export * from './toasts'
export * from './footer'

export const Layout = styled.div`
  position: relative;
`

export const AuthenticatedContainer = styled.div`
  min-height: 100vh;
  padding: 0 ${spacing.space4x} ${spacing.space8x};
`

export const UnAuthenticatedContainer = styled.div`
  min-height: 100vh;
`
