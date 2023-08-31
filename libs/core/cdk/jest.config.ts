import type { Config } from 'jest'

const jestConfig: Config = {
  displayName: 'core-cdk',
  preset: '../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  modulePathIgnorePatterns: ['node_modules', '../../../node_modules'],
  transformIgnorePatterns: ['node_modules', '../../../node_modules'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageDirectory: '../../../coverage/libs/core/cdk',
}

export default jestConfig
