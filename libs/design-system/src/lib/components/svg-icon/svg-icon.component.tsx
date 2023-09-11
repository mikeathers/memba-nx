import React from 'react'

import {colors, IconNames, iconTokens} from '../../styles'
import type {Colors} from '../../styles'

import Apple from '../../../public/assets/icons/apple.svg'
import RightArrow from '../../../public/assets/icons/arrow-right.svg'
import Back from '../../../public/assets/icons/back.svg'
import CheckBoxOff from '../../../public/assets/icons/checkbox-off.svg'
import CheckBoxOn from '../../../public/assets/icons/checkbox-on.svg'
import ConnectionLost from '../../../public/assets/icons/connection-lost.svg'
import Delete from '../../../public/assets/icons/delete.svg'
import Devices from '../../../public/assets/icons/devices.svg'
import Electric from '../../../public/assets/icons/electric.svg'
import Email from '../../../public/assets/icons/email.svg'
import Error from '../../../public/assets/icons/error.svg'
import ExternalLink from '../../../public/assets/icons/external-link.svg'
import Fill from '../../../public/assets/icons/fill.svg'
import Forward from '../../../public/assets/icons/forward.svg'
import Google from '../../../public/assets/icons/google.svg'
import Help from '../../../public/assets/icons/help.svg'
import Hidden from '../../../public/assets/icons/hidden.svg'
import Information from '../../../public/assets/icons/information.svg'
import Location from '../../../public/assets/icons/location.svg'
import Minus from '../../../public/assets/icons/minus.svg'
import Online from '../../../public/assets/icons/online.svg'
import Password from '../../../public/assets/icons/password.svg'
import PlusSign from '../../../public/assets/icons/plus-sign.svg'
import Remove from '../../../public/assets/icons/remove.svg'
import Savings from '../../../public/assets/icons/savings.svg'
import SignOut from '../../../public/assets/icons/sign-out.svg'
import Tick from '../../../public/assets/icons/tick.svg'
import Twitter from '../../../public/assets/icons/twitter.svg'
import Usage from '../../../public/assets/icons/usage.svg'
import User from '../../../public/assets/icons/user.svg'
import Visible from '../../../public/assets/icons/visible.svg'

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
