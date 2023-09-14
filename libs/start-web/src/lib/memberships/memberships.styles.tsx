import styled from 'styled-components'
import {borderRadius, colors, mediaQueries, spacing} from '@memba-labs/design-system'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  @media (${mediaQueries.s}) {
    padding: 0 ${spacing.space4x};
  }
`

export const YourMembershipsContainer = styled.div`
  padding-top: ${spacing.space6x};
`

export const MembershipTile = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${borderRadius.heavyRounded};
  width: 150px;
  height: 150px;
  border: none;

  &:hover {
    cursor: pointer;
    background-color: ${colors.blues500};
  }

  svg {
    width: 120px;
    height: 120px;
  }
`
