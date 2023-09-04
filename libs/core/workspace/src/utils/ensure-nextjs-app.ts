import {ProjectConfiguration} from '@nrwl/devkit'

export function ensureNextJsApp(projectConfiguration: ProjectConfiguration) {
  if (projectConfiguration.projectType !== 'application') {
    throw new Error('Provided project is not an Application!')
  }

  if (projectConfiguration.targets?.build.executor !== '@nx/next:build') {
    throw new Error('Provided project is not a NextJS Application!')
  }
}
