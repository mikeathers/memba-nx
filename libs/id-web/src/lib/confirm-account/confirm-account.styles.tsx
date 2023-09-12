import styled from 'styled-components'
import {colors, fontSizes, fontWeights, spacing} from '@memba-labs/design-system'
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const SendAgainContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export const EnvelopeImage = styled.div`
  background: url(https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.457/static/media/check-your-email-open-letter.a73949dd.svg)
    center bottom no-repeat;
  height: 88px;
  margin: 8px 0px 16px;
`

export const EmailAddress = styled.span`
  font-size: ${fontSizes.m};
  font-weight: ${fontWeights.medium};
  color: ${colors.greys900};
  margin-top: ${spacing.spaceHalfx};
`

export const ResendConfirmationEmailContainer = styled.div`
  text-align: center;
  color: ${colors.blues800};
  margin-top: ${spacing.space5x};

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`
