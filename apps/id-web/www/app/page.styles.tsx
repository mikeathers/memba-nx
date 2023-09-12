import styled from 'styled-components'
import {borderRadius, colors, spacing} from '@memba-labs/design-system'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  a {
    padding: ${spacing.space1x};
    background-color: ${colors.blues800};
    color: ${colors.neutrals000};
    margin-bottom: ${spacing.space1x};
    border-radius: ${borderRadius.rounded};
  }
`
