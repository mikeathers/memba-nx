import styled from 'styled-components'
import {borderRadius, colors, mediaQueries, spacing} from '@memba-labs/design-system'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100vw;

  @media (${mediaQueries.s}) {
    padding: 0 ${spacing.space4x};
  }
`

export const YourAppsContainer = styled.div`
  padding-top: ${spacing.space6x};
`

export const AppTile = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${borderRadius.heavyRounded};
  width: 150px;
  height: 150px;
  border: none;
  margin-right: ${spacing.space2x};
  margin-bottom: ${spacing.space2x};

  &:hover {
    cursor: pointer;
    background-color: ${colors.blues500};
  }

  svg {
    width: 120px;
    height: 120px;
  }
`

export const AppTileContainer = styled.div`
  display: flex;
  margin-bottom: ${spacing.space2x};
  flex-wrap: wrap;
`
