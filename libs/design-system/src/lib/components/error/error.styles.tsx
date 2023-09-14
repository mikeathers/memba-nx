import styled from 'styled-components'
import {mediaQueries, spacing} from '../../styles'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 ${spacing.space4x};

  @media (${mediaQueries.s}) {
    align-items: center;
  }
`
