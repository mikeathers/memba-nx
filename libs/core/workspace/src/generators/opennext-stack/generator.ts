import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  offsetFromRoot,
  readJson,
  readProjectConfiguration,
  updateProjectConfiguration,
  Tree,
  writeJson,
  logger,
} from '@nrwl/devkit'
import {OpennextAppGeneratorSchema} from './schema'

import cdkStackGenerator from '../cdk-stack/generator'
import addStageProps from '../add-stage-props/generator'
import addOutputMetadataTarget from '../add-output-metadata-target/generator'

import {StagePropsForAccount, getAccountDetailsForStage} from '../../utils/stage-props'
import {Tag} from '../../utils/tags'

export default async function (tree: Tree, options: OpennextAppGeneratorSchema) {
  const tags = await getTags(options)

  await cdkStackGenerator(tree, {
    name: options.name,
    appName: options.projectFolderName,
    tags: tags.parsedTags.join(','),
  })

  const normalizedOptions = await normalizeOptions(tree, options)
  generateCdkStackFile(tree, normalizedOptions)
  deleteLibFolder(tree, normalizedOptions)
  createNonStageProps(tree, normalizedOptions.projectRoot, normalizedOptions)

  await Promise.all([
    await addStageProps(tree, {
      projectName: normalizedOptions.projectName,
      stageName: 'development',
      ...normalizedOptions.developmentProps,
    }),

    await addStageProps(tree, {
      projectName: normalizedOptions.projectName,
      stageName: 'production',
      ...normalizedOptions.productionProps,
    }),

    await addOutputMetadataTarget(tree, {
      name: normalizedOptions.projectName,
    }),
  ])

  replaceDeployTarget(tree, normalizedOptions)
  // setImplicitDependency(tree, normalizedOptions)

  await formatFiles(tree)
}

function generateCdkStackFile(tree: Tree, schema: NormalizedSchema) {
  const parsedStackName = schema.projectFolderName.replace('-', ' ').split(' ')
  const toUppercased = parsedStackName.map(
    (i) => i.charAt(0).toUpperCase() + i.slice(1).toLowerCase(),
  )

  const templateOptions = {
    ...schema,
    ...names('cdk'),
    stackName: toUppercased.join(''),
    projectName: schema.projectName,
    appOutputPath: schema.appOutputPath,
    outputPath: `dist/${schema.projectRoot}`,
    template: '',
  }

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    `${schema.projectRoot}`,
    templateOptions,
  )
}

function deleteLibFolder(tree: Tree, schema: NormalizedSchema) {
  tree.delete(`${schema.projectRoot}/lib`)
  // TODO: generate a test...
  tree.delete(`${schema.projectRoot}/test`)
}

interface CDKJson {
  app: string
  output: string
  requireApproval: boolean
  watch: unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: Record<string, any>
}

interface NonStageProps {
  serviceName: string
}

function createNonStageProps(
  tree: Tree,
  projectRoot: string,
  {serviceName}: NonStageProps,
) {
  const pathToCdkJson = `${projectRoot}/cdk.json`
  const cdkJson = readJson<CDKJson>(tree, pathToCdkJson)

  cdkJson.context = {
    serviceName,
    ...cdkJson.context,
  }

  writeJson(tree, pathToCdkJson, cdkJson)
}

async function readBasePathFromNextConfig(projectRoot: string) {
  try {
    const nextConfig = await import(`${projectRoot}/next.config.js`)
    return (nextConfig.basePath as string) ?? '/'
  } catch {
    logger.warn('Unable to read next.config.js, assuming no basePath.')
    return '/'
  }
}

interface NormalizedSchema extends OpennextAppGeneratorSchema {
  projectName: string
  projectRoot: string
  projectDirectory: string
  basePath: string
  serviceName: string
  appOutputPath: string
  developmentProps: StagePropsForAccount<'development'>
  productionProps: StagePropsForAccount<'production'>
}

async function getTags(
  options: OpennextAppGeneratorSchema,
): Promise<{parsedTags: string[]}> {
  const parsedTags: Tag[] = [
    `domain:${options.projectFolderName}`,
    'type:cdk-stack',
    'scope:private',
    ...(options.tags ? options.tags.split(',').map((s) => s.trim()) : []),
  ]

  return {parsedTags}
}

async function normalizeOptions(
  tree: Tree,
  options: OpennextAppGeneratorSchema,
): Promise<NormalizedSchema> {
  const name = names(options.name).fileName
  const projectDirectory = `${names(options.projectFolderName).fileName}/${name}`
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-')
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`

  const commonProps = getAccountDetailsForStage(options.projectFolderName)

  const projectOffset = offsetFromRoot(projectRoot)

  const frontEndProject = readProjectConfiguration(tree, projectName)
  const frontEndProjectRoot = frontEndProject.root
  const frontEndProjectOutput =
    frontEndProject.targets?.build?.options.outputPath ?? `dist/${frontEndProjectRoot}`
  const basePath = await readBasePathFromNextConfig(frontEndProjectRoot)

  return {
    ...options,
    serviceName: options.projectFolderName,
    projectName,
    projectRoot,
    projectDirectory,
    basePath,
    appOutputPath: projectOffset + frontEndProjectOutput,
    developmentProps: commonProps.development,
    productionProps: commonProps.production,
  }
}

/**
 * replaces the deploy target in the opennext-app project,
 * this forces Nx to build the app before attempting to deploy.
 * this also sets dedicated env files for those accounts. that developers can make use of.
 */

function replaceDeployTarget(
  tree: Tree,
  {projectName, projectRoot}: Pick<NormalizedSchema, 'projectName' | 'projectRoot'>,
) {
  const projectConfig = readProjectConfiguration(tree, projectName)

  const outputPath = `dist/${projectRoot}`

  updateProjectConfiguration(tree, projectName, {
    ...projectConfig,
    targets: {
      ...projectConfig.targets,
      serve: {
        executor: '@nx/next:server',
        defaultConfiguration: 'development',
        options: {
          buildTarget: `${projectName}:build`,
          dev: false,
        },
        configurations: {
          local: {
            buildTarget: `${projectName}:build:local`,
            dev: true,
            envFiles: ['.env.local'],
          },
          development: {
            buildTarget: `${projectName}:build:development`,
            dev: true,
            envFiles: ['.env.development'],
          },
          production: {
            buildTarget: `${projectName}:build:production`,
            dev: false,
            envFiles: ['.env.production'],
          },
        },
      },
      deploy: {
        executor: 'nx:run-commands',
        options: {
          command: `nx cdk-deploy ${projectName} --configuration={args.configuration}`,
        },
        configurations: {
          development: {
            configuration: 'development',
            envFile: `${projectRoot}/.env.development`,
          },
          production: {
            configuration: 'production',
            envFile: `${projectRoot}/.env.production`,
          },
        },
      },
      invalidateCloudfront: {
        executor: '@memba-nx/core/workspace:invalidate-cloudfront',
        options: {
          outputsFile: outputPath + '/cdk.',
          exportName: 'distroId',
          region: 'eu-west-1',
        },
        outputs: ['${options.outputPath}'],
        configurations: {
          development: {},
        },
      },
      ['cdk-deploy']: {
        dependsOn: ['build', 'opennext-build'],
        executor: '@memba-nx/core/workspace:cdk',
        options: {
          command: 'deploy',
          output: outputPath + '/cdk.out',
        },
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        configurations: {
          development: {context: {stageName: 'development'}},
          production: {context: {stageName: 'production'}},
        },
      },
      synth: {
        executor: '@memba-nx/core/workspace:cdk',
        options: {
          command: 'synth',
          output: outputPath + '/cdk.out',
        },
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        configurations: {
          development: {context: {stageName: 'development'}},
          production: {context: {stageName: 'production'}},
        },
      },
      diff: {
        executor: '@memba-nx/core/workspace:cdk',
        options: {
          command: 'diff',
          output: outputPath + '/cdk.out',
        },
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        configurations: {
          development: {context: {stageName: 'development'}},
          production: {context: {stageName: 'production'}},
        },
      },
      destroy: {
        executor: '@memba-nx/core/workspace:cdk',
        options: {
          command: 'destroy',
          output: outputPath + '/cdk.out',
        },
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        configurations: {
          development: {context: {stageName: 'development'}},
          production: {context: {stageName: 'production'}},
        },
      },
    },
  })
}
/*
 * Updates the Implicit Dependencies array in the project.json so that it will be affected when the front-end project gets updated.
 */
function setImplicitDependency(
  tree: Tree,
  {
    projectName,
    projectFolderName,
  }: Pick<NormalizedSchema, 'projectName' | 'projectFolderName'>,
) {
  const projectConfig = readProjectConfiguration(tree, projectName)

  updateProjectConfiguration(tree, projectName, {
    ...projectConfig,
    implicitDependencies: [projectFolderName],
  })
}
