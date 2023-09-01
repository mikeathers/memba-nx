import {ProjectConfiguration} from '@nrwl/devkit'

export function ensureNextJsApp(projectConfiguration: ProjectConfiguration) {
  console.log(projectConfiguration.projectType)
  console.log(projectConfiguration.targets?.build.executor)
  if (projectConfiguration.projectType !== 'application') {
    throw new Error('Provided project is not an Application!')
  }

  if (projectConfiguration.targets?.build.executor !== '@nx/next:build') {
    throw new Error('Provided project is not a NextJS Application!')
  }
}
