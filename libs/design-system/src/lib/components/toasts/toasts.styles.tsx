import styled from 'styled-components'
import {colors, fontSizes, spacing} from '../../styles'

export const Container = styled.div`
  display: flex;
  padding: ${spacing.space2x} ${spacing.space1x};
`

export const Icon = styled.div`
  background-color: ${colors.greens500};
  border-radius: 100px;
  height: 20px;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  svg {
    position: absolute;
    stroke-width: 10px;
    top: 5px;
  }
`

export const Content = styled.div`
  margin-left: ${spacing.space2x};
  p {
    font-size: ${fontSizes.s};
  }
  p:first-child {
    margin-bottom: ${spacing.space2x};
  }
  //p:last-child {
  //  font-weight: 300;
  //}
`
