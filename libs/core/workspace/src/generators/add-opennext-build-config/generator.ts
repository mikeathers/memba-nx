import {
  updateProjectConfiguration,
  readProjectConfiguration,
  formatFiles,
  Tree,
  ProjectConfiguration,
} from '@nrwl/devkit'
import {AddOpennextBuildConfigGeneratorSchema} from './schema'
import {ensureNextJsApp} from '../../utils/ensure-nextjs-app'

export default async function (
  tree: Tree,
  options: AddOpennextBuildConfigGeneratorSchema,
) {
  const normalizedOptions = normalizeOptions(tree, options)
  ensureNextJsApp(normalizedOptions.projectConfiguration)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const buildConfig = normalizedOptions.projectConfiguration.targets!.build
  updateProjectConfiguration(tree, normalizedOptions.projectName, {
    ...normalizedOptions.projectConfiguration,
    targets: {
      ...normalizedOptions.projectConfiguration.targets,
      build: {
        ...buildConfig,
        configurations: {
          ...buildConfig.configurations,
          development: {},
        },
      },
      'opennext-build': {
        executor: '@memba-nx/core/workspace:opennext-build',
        outputs: [
          `${normalizedOptions.projectConfiguration.targets?.build?.options.outputPath}/.open-next/`,
        ],
        options: {
          debug: true,
        },
        configurations: {
          production: {
            debug: false,
            minify: true,
          },
        },
      },
    },
  })

  await formatFiles(tree)
}

interface NormalizedSchema extends AddOpennextBuildConfigGeneratorSchema {
  projectName: string
  projectConfiguration: ProjectConfiguration
}

function normalizeOptions(
  tree: Tree,
  options: AddOpennextBuildConfigGeneratorSchema,
): NormalizedSchema {
  const projectName = options.name
  const projectConfiguration = readProjectConfiguration(tree, projectName)

  return {
    ...options,
    projectName,
    projectConfiguration,
  }
}
