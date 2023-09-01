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
import {SquadName, TribeName} from '../../utils/stage-props'

interface NormalizedSchema {
  projectName: string
  projectConfiguration: ProjectConfiguration
  sharedMetadata: {
    'oidc-aws-region': string
    squad: SquadName
    tribe: TribeName
  }
  ephemeralMetadata?: StageDeploymentMetadata
  developmentMetadata?: StageDeploymentMetadata
  productionMetadata?: StageDeploymentMetadata
}

function normalizeOptions(
  tree: Tree,
  options: AddOutputMetadataTargetGeneratorSchema,
): NormalizedSchema {
  const projectConfiguration = readProjectConfiguration(tree, options.name)
  const deploymentMetadata = getDeploymentMetadata(options.squad, options.name)

  return {
    ...options,
    projectName: options.name,
    projectConfiguration,
    sharedMetadata: {
      squad: options.squad,
      tribe: deploymentMetadata.tribe,
      'oidc-aws-region': 'eu-west-1',
    },
    ephemeralMetadata: deploymentMetadata.ephemeral,
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
        executor: '@memba-nx/core/workspace/cdk:output-metadata',
        options: {
          sharedOutputs: normalizedOptions.sharedMetadata,
        },
        configurations: {
          ephemeral: {outputs: normalizedOptions.ephemeralMetadata},
          development: {outputs: normalizedOptions.developmentMetadata},
          production: {outputs: normalizedOptions.productionMetadata},
        },
      },
    },
  })
}
