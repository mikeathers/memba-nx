/* eslint-disable */
export default {
  displayName: 'shared',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      {jsc: {transform: {react: {runtime: 'automatic'}}}},
      'ts-jest',
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/design-system',
  setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.ts'],
}
