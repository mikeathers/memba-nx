import styled from 'styled-components'
import {borderRadius, colors, spacing} from '../../../../styles'

export const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid ${colors.blues100};
  a {
    display: flex;
    justify-content: center;
    border-radius: ${borderRadius.lightRounded};
    text-decoration: none;
    width: 100px;
    padding: ${spacing.space1x};

    &:hover {
      background-color: rgba(100, 100, 100, 0.1);
    }
  }
`
