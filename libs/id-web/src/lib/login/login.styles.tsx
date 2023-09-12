import styled from 'styled-components'
import {fontWeights, spacing} from '@memba-labs/design-system'

export const ActionsContainer = styled.div`
  margin-top: ${spacing.space4x};
  display: flex;
  justify-content: center;

  p {
    font-weight: ${fontWeights.regular};
    margin-right: ${spacing.space1x};
  }

  a {
    p:first-child:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
`

export const ErrorContainer = styled.div`
  margin-bottom: ${spacing.space3x};
`
