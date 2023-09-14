import styled from 'styled-components'
import Link from 'next/link'
import {colors, mediaQueries, spacing, Button} from '@memba-labs/design-system'

export const Container = styled.div``

export const CenterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${spacing.space4x};
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const GoBackLink = styled(Link)`
  width: 100px;
  display: flex;
  justify-content: flex-start;

  p {
    color: ${colors.blues800};
    text-decoration: underline;

    &:hover {
      color: ${colors.blues500};
    }
  }
`

export const GymDetailsForm = styled.form`
  width: 100%;

  & * div {
    width: 100%;
  }
`
export const GymNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: ${spacing.space3x};
  margin-bottom: ${spacing.space6x};

  @media (${mediaQueries.s}) {
    flex-direction: row;
    align-items: center;
    margin-bottom: ${spacing.space3x};
  }
`

export const GymUrlContainer = styled.div`
  @media (${mediaQueries.s}) {
    margin-left: ${spacing.space10x};
  }
`

export const TiersContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  align-self: flex-start;
  margin-bottom: ${spacing.space8x};

  @media (${mediaQueries.s}) {
    flex-direction: row;
    margin-top: 50px;
  }
`

export const GymMembershipsContainer = styled.div`
  margin-bottom: ${spacing.space6x};

  @media (${mediaQueries.s}) {
    div:nth-child(1) {
      margin-right: ${spacing.space3x};
    }
  }
`

export const GymMembershipsInputs = styled.div`
  display: flex;
  flex-direction: column;

  @media (${mediaQueries.s}) {
    flex-direction: row;
  }
`

export const AddButton = styled(Button)`
  padding: 0;
  text-decoration: underline;
`
export const PlusContainer = styled.button`
  display: none;
  justify-content: center;
  align-items: center;
  height: 22px;
  width: 22px;
  border-radius: 100px;
  background-color: ${colors.blues800};
  margin-left: ${spacing.space2x};
  border: none;
  cursor: pointer;

  svg {
    height: 12px;
  }

  @media (${mediaQueries.s}) {
    display: flex;
  }
`

export const AddedMembershipContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  @media (${mediaQueries.s}) {
    width: 20%;
  }
`

export const CreateGymManagementButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`
export const CreateGymManagementButton = styled(Button)`
  margin-top: ${spacing.space6x};
  margin-bottom: ${spacing.space6x};
  width: 350px;
`
