import * as core from '@actions/core'

import {
  determineProjectConfigurations,
  printAffected,
  readProjectConfiguration,
} from './nx'
import {IMatrixObject, IProjectConfig, ProjectConfigurations} from './types'

const EXCLUDED_CONFIGURATIONS = ['local']

const getAffectedProjects = (target: string, excludedProjects: string) =>
  printAffected({
    target,
    exclude: excludedProjects,
    select: 'tasks.target.project',
  }).catch((error) => {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }

    core.setFailed('Unknown Reason.')
  })

const toProjectConfigurations = async (
  projects: string[],
): Promise<ProjectConfigurations> => {
  const projectsWithConfiguration = await Promise.all(
    projects.map(async (projectName): Promise<ProjectConfigurations> => {
      const projectConfig = await readProjectConfiguration(projectName)
      const projectConfigurations = await determineProjectConfigurations(projectConfig)
      console.log({projectConfigurations})
      return {
        [projectName]: projectConfigurations?.filter(
          (configurationName) =>
            EXCLUDED_CONFIGURATIONS.includes(configurationName) === false,
        ),
      }
    }),
  )

  return projectsWithConfiguration?.reduce<ProjectConfigurations>(
    (acc, curr) => ({...acc, ...curr}),
    {},
  )
}

const toIncludeObjects = (
  configurations: string[],
  projectName: string,
): IProjectConfig[] =>
  configurations.reduce<IProjectConfig[]>((acc, configurationName) => {
    return [
      ...acc,
      {
        project: projectName,
        configuration: configurationName,
      },
    ]
  }, [])

const toMatrixObject = (input: ProjectConfigurations): IMatrixObject => {
  const include = Object.entries(input).reduce<IMatrixObject['include']>(
    (acc, [projectName, environments]) => {
      const configObject = toIncludeObjects(environments, projectName)

      return [...acc, ...configObject]
    },
    [],
  )

  return {
    include,
  }
}

async function determineAffected(target: string, excludedProjects: string) {
  if (!target) {
    throw new Error('Target not provided')
  }

  const affectedProjects = await getAffectedProjects(target, excludedProjects)
  console.log({affectedProjects})
  const configurations = await toProjectConfigurations(affectedProjects)
  const generatedMatrix = toMatrixObject(configurations)

  console.log(JSON.stringify(generatedMatrix, null, 2))

  core.setOutput('matrix', JSON.stringify(generatedMatrix))
  core.setOutput('has-affected-projects', generatedMatrix.include.length !== 0)
}

const excludedProjects = process.env.EXCLUDE_NX_PROJECTS ?? ''

determineAffected('deploy', excludedProjects)
