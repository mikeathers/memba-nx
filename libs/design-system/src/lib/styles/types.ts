export interface Spacing {
  spaceHalfx: string
  space1x: string
  space1AndHalfx: string
  space2x: string
  space3x: string
  space4x: string
  space5x: string
  space6x: string
  space7x: string
  space8x: string
  space9x: string
  space10x: string
  space11x: string
  space12x: string
  space13x: string
  space14x: string
  space15x: string
}

export interface Fonts {
  poppins: string
}

export interface FontWeights {
  // light: number
  regular: number
  medium: number
  semibold: number
  // bold: number
}

export interface FontSizeValues {
  xxs: number
  xs: number
  s: number
  m: number
  l: number
  xl: number
  xxl: number
  xxxl: number
}

export interface FontSizes {
  xxs: string
  xs: string
  s: string
  m: string
  l: string
  xl: string
  xxl: string
  xxxl: string
}

export interface LetterSpacing {
  title: string
}

export interface LineHeights {
  small: string
  medium: string
  large: string
  xlarge: string
}

export interface Colors {
  reds100: string
  reds500: string
  reds800: string
  oranges100: string
  oranges500: string
  oranges800: string
  yellows100: string
  yellows500: string
  yellows800: string
  greens100: string
  greens500: string
  greens800: string
  blues100: string
  blues500: string
  blues800: string
  greys100: string
  greys200: string
  greys300: string
  greys400: string
  greys500: string
  greys600: string
  greys700: string
  greys800: string
  greys900: string
  neutrals000: string
  neutrals100: string
  neutrals500: string
}

export interface BorderRadius {
  lightRounded: string
  rounded: string
  heavyRounded: string
}

export interface MediaQueries {
  xxxs: string
  xxs: string
  xs: string
  xsMax: string
  s: string
  m: string
  l: string
  xl: string
  mediumPhone: string
  mediumDesktop: string
}

export interface Breakpoint {
  min: number
  max: number
}

export interface Breakpoints {
  xxxs: Breakpoint
  xxs: Breakpoint
  xs: Breakpoint
  s: Breakpoint
  m: Breakpoint
  l: Breakpoint
  xl: Breakpoint
}

export enum IconNames {
  rightArrow = 'rightArrow',
  plusSign = 'plusSign',
  information = 'information',
  tick = 'tick',
  user = 'user',
  back = 'back',
  savings = 'savings',
  usage = 'usage',
  devices = 'devices',
  error = 'error',
  electric = 'electric',
  twitter = 'twitter',
  visible = 'visible',
  hidden = 'hidden',
  email = 'email',
  password = 'password',
  online = 'online',
  forward = 'forward',
  remove = 'remove',
  checkBoxOn = 'checkBoxOn',
  checkBoxOff = 'checkBoxOff',
  externalLink = 'externalLink',
  minus = 'minus',
  signOut = 'signOut',
  location = 'location',
  help = 'help',
  fill = 'fill',
  delete = 'delete',
  connectionLost = 'connectionLost',
  google = 'google',
  apple = 'apple',
}
