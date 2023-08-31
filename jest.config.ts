import {getJestProjects} from '@nx/jest'

export default {
  projects: getJestProjects(),
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    '\\.svg$': './__mocks__/svgrMock.js',
  },
}
