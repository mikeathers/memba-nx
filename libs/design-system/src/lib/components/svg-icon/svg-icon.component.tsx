import React from 'react'

import {colors, IconNames, iconTokens} from '../../styles'
import type {Colors} from '../../styles'

import Apple from './icons/apple.svg'
import RightArrow from './icons/arrow-right.svg'
import Back from './icons/back.svg'
import CheckBoxOff from './icons/checkbox-off.svg'
import CheckBoxOn from './icons/checkbox-on.svg'
import ConnectionLost from './icons/connection-lost.svg'
import Delete from './icons/delete.svg'
import Devices from './icons/devices.svg'
import Electric from './icons/electric.svg'
import Email from './icons/email.svg'
import Error from './icons/error.svg'
import ExternalLink from './icons/external-link.svg'
import Fill from './icons/fill.svg'
import Forward from './icons/forward.svg'
import Google from './icons/google.svg'
import Help from './icons/help.svg'
import Hidden from './icons/hidden.svg'
import Information from './icons/information.svg'
import Location from './icons/location.svg'
import Minus from './icons/minus.svg'
import Online from './icons/online.svg'
import Password from './icons/password.svg'
import PlusSign from './icons/plus-sign.svg'
import Remove from './icons/remove.svg'
import Savings from './icons/savings.svg'
import SignOut from './icons/sign-out.svg'
import Tick from './icons/tick.svg'
import Twitter from './icons/twitter.svg'
import Usage from './icons/usage.svg'
import User from './icons/user.svg'
import Visible from './icons/visible.svg'

export interface SvgIconProps {
  name: keyof IconNames
  color?: keyof Colors
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
    if (name === iconTokens.information) {
      return 12
    }
    if (name === iconTokens.devices) {
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
