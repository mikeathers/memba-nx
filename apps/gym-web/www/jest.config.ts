import type {Config} from 'jest'

const jestConfig: Config = {
  displayName: 'gym-web-www',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', {presets: ['@nx/next/babel']}],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/apps/gym-web/www',
}

export default jestConfig
