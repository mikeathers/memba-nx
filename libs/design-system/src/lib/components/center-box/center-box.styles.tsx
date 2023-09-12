import styled from 'styled-components'
import {colors, mediaQueries, spacing} from '../../styles'

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  @media (${mediaQueries.s}) {
    align-items: center;
    background-color: rgb(250, 251, 252);
    background-image: url(/default_left.svg), url(/default_right.svg);
    background-repeat: no-repeat, no-repeat;
    background-attachment: fixed, fixed;
    background-size: 368px, 368px;
    background-position: left bottom, right bottom;
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 40px;

  @media (${mediaQueries.s}) {
    width: 400px;
    background: ${colors.neutrals000};
    border-radius: 3px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px;
    box-sizing: border-box;
  }
`

export const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${colors.greys200};
  padding: ${spacing.space2x} 0;
  margin-bottom: ${spacing.space4x};
`

export const FormContainer = styled.div`
  width: 80vw;

  @media (${mediaQueries.s}) {
    width: 310px;
  }
`
