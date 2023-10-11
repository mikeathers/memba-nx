'use client'
import {styled} from 'styled-components'
import {mediaQueries, spacing} from '@memba-labs/design-system'

export const Layout = styled.div`
  position: relative;
`

export const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: scroll;
  padding: ${spacing.space2x} ${spacing.space2x};

  @media (${mediaQueries.s}) {
    overflow: visible;
    padding: ${spacing.space2x} ${spacing.space4x};
  }

  @media (${mediaQueries.xl}) {
    padding: ${spacing.space4x} ${spacing.space6x};
  }
`
