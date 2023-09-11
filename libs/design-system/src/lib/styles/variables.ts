import type {
  BorderRadius,
  Breakpoints,
  Colors,
  Fonts,
  FontSizes,
  FontSizeValues,
  FontWeights,
  LetterSpacing,
  LineHeights,
  MediaQueries,
  Spacing,
} from './types'

export const colors: Colors = {
  reds500: '#FF564B',
  oranges500: '#FF8720',
  yellows500: '#FFD12C',
  greens500: '#68D272',
  reds100: '#FFE1DF',
  reds800: '#372726',
  yellows100: '#FFF2C6',
  yellows800: '#332F25',
  oranges100: '#FFE8D4',
  oranges800: '#37302A',
  greens100: '#E5FFE3',
  greens800: '#283631',
  blues100: '#D9DFEA',
  blues500: '#8EB0FF',
  blues800: '#5363F4',
  greys100: '#202C49',
  greys200: '#CCCED1',
  greys300: '#A2A6AD',
  greys400: '#828892',
  greys500: '#565C67',
  greys600: '#3C4450',
  greys700: '#2E3643',
  greys800: '#252C37',
  greys900: '#1F2128',
  neutrals000: '#FFFFFF',
  neutrals100: '#F5EFE3',
  neutrals500: '#B0A99C',
}

export const borderRadius: BorderRadius = {
  lightRounded: '4px',
  rounded: '8px',
  heavyRounded: '24px',
}

const baseSpacing = 8

export const spacingValues = {
  spaceHalfx: baseSpacing / 2,
  space1x: baseSpacing * 1,
  space1AndHalfx: baseSpacing + baseSpacing / 2,
  space2x: baseSpacing * 2,
  space3x: baseSpacing * 3,
  space4x: baseSpacing * 4,
  space5x: baseSpacing * 5,
  space6x: baseSpacing * 6,
  space7x: baseSpacing * 7,
  space8x: baseSpacing * 8,
  space9x: baseSpacing * 9,
  space10x: baseSpacing * 10,
  space11x: baseSpacing * 11,
  space12x: baseSpacing * 12,
  space13x: baseSpacing * 13,
  space14x: baseSpacing * 14,
  space15x: baseSpacing * 15,
}
export const fonts: Fonts = {
  poppins: 'Poppins',
}

export const spacing: Spacing = {
  spaceHalfx: `${spacingValues.spaceHalfx}px`,
  space1x: `${spacingValues.space1x}px`,
  space1AndHalfx: `${spacingValues.space1AndHalfx}px`,
  space2x: `${spacingValues.space2x}px`,
  space3x: `${spacingValues.space3x}px`,
  space4x: `${spacingValues.space4x}px`,
  space5x: `${spacingValues.space5x}px`,
  space6x: `${spacingValues.space6x}px`,
  space7x: `${spacingValues.space7x}px`,
  space8x: `${spacingValues.space8x}px`,
  space9x: `${spacingValues.space9x}px`,
  space10x: `${spacingValues.space10x}px`,
  space11x: `${spacingValues.space11x}px`,
  space12x: `${spacingValues.space12x}px`,
  space13x: `${spacingValues.space13x}px`,
  space14x: `${spacingValues.space14x}px`,
  space15x: `${spacingValues.space15x}px`,
}

export const fontSizeValues: FontSizeValues = {
  xxs: 12,
  xs: 14,
  s: 16,
  m: 18,
  l: 24,
  xl: 28,
  xxl: 36,
  xxxl: 48,
}
export const fontSizes: FontSizes = {
  xxs: `${fontSizeValues.xxs}px`,
  xs: `${fontSizeValues.xs}px`,
  s: `${fontSizeValues.s}px`,
  m: `${fontSizeValues.m}px`,
  l: `${fontSizeValues.l}px`,
  xl: `${fontSizeValues.xl}px`,
  xxl: `${fontSizeValues.xxl}px`,
  xxxl: `${fontSizeValues.xxxl}px`,
}

export const fontWeights: FontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
}

export const lineHeightValues = {
  small: 16,
  medium: 24,
  large: 28,
  xlarge: 37,
}

export const lineHeights: LineHeights = {
  small: `${lineHeightValues.small}px`,
  medium: `${lineHeightValues.medium}px`,
  large: `${lineHeightValues.large}px`,
  xlarge: `${lineHeightValues.xlarge}px`,
}

export const letterSpacing: LetterSpacing = {
  title: '.2px',
}

const breakpoints: Breakpoints = {
  xxxs: {
    min: 375,
    max: 0,
  },
  xxs: {
    min: 0,
    max: 599,
  },
  xs: {
    min: 600,
    max: 767,
  },
  s: {
    min: 768,
    max: 1023,
  },
  m: {
    min: 1024,
    max: 1439,
  },
  l: {
    min: 1440,
    max: 1919,
  },
  xl: {
    min: 1920,
    max: Infinity,
  },
}

export const mediaQueries: MediaQueries = {
  xxxs: `(min-width: ${breakpoints.xxxs.min}px)`,
  xxs: `(max-width: ${breakpoints.xxs.max}px)`,
  xs: `(min-width: ${breakpoints.xs.min}px)`,
  xsMax: `(max-width: ${breakpoints.xs.max}px)`,
  s: `(min-width: ${breakpoints.s.min}px)`,
  m: `(min-width: ${breakpoints.m.min}px)`,
  l: `(min-width: ${breakpoints.l.min}px)`,
  xl: `(min-width: ${breakpoints.xl.min}px)`,
  mediumPhone: `(min-height: ${breakpoints.xxs.max}px)`,
  mediumDesktop: `(min-height: ${breakpoints.s.min}px) and (min-width: ${breakpoints.m.min}px)`,
}
