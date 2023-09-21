import styled from 'styled-components'
import Link from 'next/link'
import {baseStyles, StyledTextProps} from '../../utils'
import {colors, fontSizes, fontWeights, lineHeights} from '../../styles'

export const NextLink = styled(Link)<StyledTextProps>`
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.s};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
  line-height: ${lineHeights.medium};
  ${baseStyles};

  &:active {
    color: ${colors.greys300};
  }
`
