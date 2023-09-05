import {
  updateProjectConfiguration,
  readProjectConfiguration,
  Tree,
  ProjectConfiguration,
} from '@nrwl/devkit'

import {AddOutputMetadataTargetGeneratorSchema} from './schema'

import {
  getDeploymentMetadata,
  StageDeploymentMetadata,
} from '../../utils/deployment-metadata'

interface NormalizedSchema {
  projectName: string
  projectConfiguration: ProjectConfiguration
  sharedMetadata: {
    'oidc-aws-region': string
  }
  developmentMetadata?: StageDeploymentMetadata
  productionMetadata?: StageDeploymentMetadata
}

function normalizeOptions(
  tree: Tree,
  options: AddOutputMetadataTargetGeneratorSchema,
): NormalizedSchema {
  const projectConfiguration = readProjectConfiguration(tree, options.name)
  const deploymentMetadata = getDeploymentMetadata(options.name)

  return {
    ...options,
    projectName: options.name,
    projectConfiguration,
    sharedMetadata: {
      'oidc-aws-region': 'eu-west-2',
    },
    developmentMetadata: deploymentMetadata.development,
    productionMetadata: deploymentMetadata.production,
  }
}

export default async function (
  tree: Tree,
  options: AddOutputMetadataTargetGeneratorSchema,
) {
  const normalizedOptions = normalizeOptions(tree, options)

  updateProjectConfiguration(tree, normalizedOptions.projectName, {
    ...normalizedOptions.projectConfiguration,
    targets: {
      ...normalizedOptions.projectConfiguration.targets,
      'output-metadata': {
        executor: '@memba-nx/core/workspace:output-metadata',
        options: {
          sharedOutputs: normalizedOptions.sharedMetadata,
        },
        configurations: {
          development: {outputs: normalizedOptions.developmentMetadata},
          production: {outputs: normalizedOptions.productionMetadata},
        },
      },
    },
  })
}
