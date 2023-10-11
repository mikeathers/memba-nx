import styled from 'styled-components'
import {colors} from '@memba-labs/design-system'

export const Container = styled.div``

export const AvatarContainer = styled.div`
  height: 170px;
  width: 170px;
  border-radius: 100px;
  position: relative;
`

export const UploadButton = styled.button`
  outline: none;
  background-color: transparent;
  border: none;
  align-self: center;
  z-index: 3;
  height: 170px;
  width: 170px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    svg {
      color: ${colors.neutrals000};
      cursor: pointer;
      z-index: 1;
    }
  }

  img {
    transition: filter ease 0.3s;
    border-radius: 100px;
    height: 100%;
    width: 100%;
    object-fit: cover;
    position: absolute;

    &:hover {
      filter: brightness(70%);
    }
  }

  svg:hover ~ img {
    filter: brightness(70%);
  }
`
