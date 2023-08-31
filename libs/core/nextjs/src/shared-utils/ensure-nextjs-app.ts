import { ProjectConfiguration } from '@nrwl/devkit'

export function ensureNextJsApp(projectConfiguration: ProjectConfiguration) {
  if (projectConfiguration.projectType !== 'application') {
    throw new Error('Provided project is not an Application!')
  }

  console.log(projectConfiguration.targets?.build.executor)
  if (projectConfiguration.targets?.build.executor !== '@nx/next:build') {
    throw new Error('Provided project is not a NextJS Application!')
  }
}
