import Link from 'next/link'
import styled from 'styled-components'

import {baseTextStyles, margins, StyledTextProps} from '../../utils'
import {colors, fontSizes, FontSizeStyles, fontWeights, lineHeights} from '../../styles'

export const NextLink = styled(Link)<StyledTextProps>`
  font-weight: ${fontWeights.regular};
  color: ${({color}) => (color ? colors[color] : colors.greys100)};
  line-height: ${lineHeights.medium};
  ${margins};
  ${baseTextStyles};

  font-size: ${({fontSize}) => {
    if (fontSize) {
      // @ts-ignore
      if (Object.values(FontSizeStyles).includes(fontSize))
        return fontSize && fontSizes[fontSize as keyof typeof FontSizeStyles]

      return fontSize
    } else return fontSizes.s
  }};
`
