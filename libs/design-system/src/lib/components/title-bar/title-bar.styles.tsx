import styled from 'styled-components'

import {colors, fontSizes, mediaQueries, spacing} from '../../styles'
export const Container = styled.div`
  padding: ${spacing.spaceHalfx} ${spacing.space3x};
  border-bottom: 1px solid ${colors.blues100};
  height: 70px;
  display: flex;
  margin-bottom: ${spacing.space4x};
  align-items: center;
  justify-content: space-between;

  @media (${mediaQueries.l}) {
    margin-bottom: ${spacing.space4x};
  }

  @media (${mediaQueries.xl}) {
    margin-bottom: ${spacing.space6x};
  }
`

export const LeftContent = styled.div`
  display: flex;
  align-items: center;
`
export const Circle = styled.div`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: ${colors.blues800};
  margin-right: ${spacing.space1AndHalfx};
`

export const RightContent = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`

export const AvatarCircle = styled.button`
  border-radius: 100px;
  border: 1px solid ${colors.blues800};
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: transparent;

  h4 {
    font-size: ${fontSizes.s};
  }

  @media (${mediaQueries.s}) {
    height: 50px;
    width: 50px;

    h4 {
      font-size: ${fontSizes.m};
    }
  }

  &:hover {
    background-color: ${colors.blues800};
    h4 {
      color: ${colors.neutrals000};
    }
  }
`

export const Menu = styled.div`
  width: 300px;
  height: 300px;
  position: fixed;
  top: 65px;
  right: 30px;
  background: ${colors.neutrals000};
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 6px;
  padding: ${spacing.space3x};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  z-index: 2;
`

export const MenuTitleContainer = styled.div`
  border-bottom: 1px solid ${colors.greys200};
  div {
    margin-bottom: ${spacing.space2x};
  }
`
export const NameContainer = styled.div`
  display: flex;
  align-items: center;
`
export const AvatarCircleSmall = styled.div`
  border-radius: 100px;
  border: 1px solid ${colors.blues800};
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  margin-right: ${spacing.space2x};
`

export const Name = styled.div``

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: ${spacing.space2x};
`
