import styled from 'styled-components'
import {fontWeights, spacing} from '@memba-labs/design-system'

export const LoginContainer = styled.div`
  margin-top: ${spacing.space4x};
  display: flex;
  justify-content: center;

  p {
    font-weight: ${fontWeights.regular};
    cursor: pointer;
  }

  p:hover {
    text-decoration: underline;
  }
`

export const ErrorContainer = styled.div`
  margin-bottom: ${spacing.space3x};
`
