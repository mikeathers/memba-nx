/* eslint-disable */
export default {
  displayName: 'id-web',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', {presets: ['@nx/react/babel']}],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/id-web',
  setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.ts'],
}
