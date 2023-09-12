import React from 'react'

import {colors, IconNames, ColorStyles} from '../../styles'

import Apple from './icons/Apple.svg'
import RightArrow from './icons/Arrow-Right.svg'
import Back from './icons/Back.svg'
import CheckBoxOff from './icons/Checkbox-Off.svg'
import CheckBoxOn from './icons/Checkbox-On.svg'
import ConnectionLost from './icons/Connection-Lost.svg'
import Delete from './icons/Delete.svg'
import Devices from './icons/Devices.svg'
import Electric from './icons/Electric.svg'
import Email from './icons/Email.svg'
import Error from './icons/Error.svg'
import ExternalLink from './icons/External-Link.svg'
import Fill from './icons/Fill.svg'
import Forward from './icons/Forward.svg'
import Google from './icons/Google.svg'
import Help from './icons/Help.svg'
import Hidden from './icons/Hidden.svg'
import Information from './icons/Information.svg'
import Location from './icons/Location.svg'
import Minus from './icons/Minus.svg'
import Online from './icons/Online.svg'
import Password from './icons/Password.svg'
import PlusSign from './icons/Plus-Sign.svg'
import Remove from './icons/Remove.svg'
import Savings from './icons/Savings.svg'
import SignOut from './icons/Sign-Out.svg'
import Tick from './icons/Tick.svg'
import Twitter from './icons/Twitter.svg'
import Usage from './icons/Usage.svg'
import User from './icons/User.svg'
import Visible from './icons/Visible.svg'

export interface SvgIconProps {
  name: keyof typeof IconNames
  color?: keyof typeof ColorStyles
  size?: number
  //eslint-disable-next-line
  style?: any
  viewBoxHeight?: number
  viewBoxWidth?: number
  viewBoxY?: number
  noFill?: boolean
}

/* eslint-disable */
export const icons = {
  rightArrow: RightArrow,
  plusSign: PlusSign,
  remove: Remove,
  email: Email,
  visible: Visible,
  hidden: Hidden,
  password: Password,
  information: Information,
  tick: Tick,
  user: User,
  back: Back,
  forward: Forward,
  savings: Savings,
  usage: Usage,
  devices: Devices,
  error: Error,
  electric: Electric,
  online: Online,
  twitter: Twitter,
  checkBoxOn: CheckBoxOn,
  checkBoxOff: CheckBoxOff,
  externalLink: ExternalLink,
  signOut: SignOut,
  location: Location,
  help: Help,
  fill: Fill,
  minus: Minus,
  delete: Delete,
  connectionLost: ConnectionLost,
  google: Google,
  apple: Apple,
}

export const SvgIcon = (props: SvgIconProps) => {
  const {name, size, color, style, viewBoxHeight, viewBoxWidth, viewBoxY, noFill} = props

  const Icon = icons[name]
  if (!Icon) return null

  const getViewBoxWidth = (): number => {
    if (name === 'information') {
      return 12
    }
    if (name === 'devices') {
      return 28
    }

    if (viewBoxWidth) {
      return viewBoxWidth
    }

    return 24
  }

  const getViewBoxHeight = (): number => {
    if (viewBoxHeight) {
      return viewBoxHeight
    }

    return 24
  }

  const getColor = () => {
    if (color) return colors[color]
    else return colors.greys900
  }

  const getViewBoxY = () => {
    if (viewBoxY) {
      return viewBoxY
    }
    return 0
  }

  if (noFill) {
    return (
      <Icon
        //@ts-ignore
        viewBox={`0 ${getViewBoxY()} ${getViewBoxWidth()} ${getViewBoxHeight()}`}
        width={size || 24}
        height={size || 24}
        style={style}
      />
    )
  }

  return (
    <Icon
      // @ts-ignore
      viewBox={`0 ${getViewBoxY()} ${getViewBoxWidth()} ${getViewBoxHeight()}`}
      fill={getColor()}
      width={size || 24}
      height={size || 24}
      style={style}
    />
  )
}
