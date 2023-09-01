import { readFileSync } from 'fs'

// Reading the SWC compilation config and remove the "exclude"
// for the test files to be compiled by SWC
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { exclude: _, ...swcJestConfig } = JSON.parse(
  readFileSync(`${__dirname}/.lib.swcrc`, 'utf8'),
)
const jestConfig = {
  displayName: '..-tools-plugins-workspace',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/core/workspace',
}

export default jestConfig
