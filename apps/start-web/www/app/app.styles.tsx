'use client'
import {styled} from 'styled-components'
import {mediaQueries, spacing} from '@memba-labs/design-system'

export const Layout = styled.div`
  position: relative;
`

export const Container = styled.div`
  display: flex;
  padding: ${spacing.space2x};
  height: 100vh;
  padding: ${spacing.space2x} ${spacing.space2x};

  @media (${mediaQueries.s}) {
    padding: ${spacing.space2x} ${spacing.space4x};
  }

  @media (${mediaQueries.xl}) {
    padding: ${spacing.space4x} ${spacing.space6x};
  }
`
