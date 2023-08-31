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
import { OpennextAppGeneratorSchema } from './schema'

import cdkAppGenerator from '../app/generator'
import addStageProps from '../add-stage-props/generator'
import addOutputMetadataTarget from '../add-output-metadata-target/generator'

import {
  StagePropsForAccount,
  getAccountDetailsForSquad,
} from '../../utils/stage-props'

export default async function (
  tree: Tree,
  options: OpennextAppGeneratorSchema,
) {
  const normalizedOptions = await normalizeOptions(tree, options)

  await cdkAppGenerator(tree, {
    name: options.name,
    directory: normalizedOptions.directory,
    tags: normalizedOptions.parsedTags.join(','),
  })

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

    // await addOutputMetadataTarget(tree, {
    //   name: normalizedOptions.projectName,
    //   squad: normalizedOptions.squad,
    // }),
  ])

  replaceDeployTarget(tree, normalizedOptions)
  setImplicitDependency(tree, normalizedOptions)

  await formatFiles(tree)
}

function generateCdkStackFile(tree: Tree, schema: NormalizedSchema) {
  const templateOptions = {
    ...schema,
    ...names(schema.name),
    projectName: schema.projectName,
    appOutputPath: schema.appOutputPath,
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
  { serviceName }: NonStageProps,
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
  parsedTags: string[]
  basePath: string
  serviceName: string
  appOutputPath: string
  developmentProps: StagePropsForAccount<'development'>
  productionProps: StagePropsForAccount<'production'>
}

async function normalizeOptions(
  tree: Tree,
  options: OpennextAppGeneratorSchema,
): Promise<NormalizedSchema> {
  console.log({ options })
  const name = names(options.name).fileName
  console.log(names(options.name).fileName)
  const projectDirectory = `${names(options.directory).fileName}/${name}`
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-')
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`
  const commonProps = getAccountDetailsForSquad(options.frontEndProjectName)
  const parsedTags = [
    `domain:${options.directory}`,
    ...(options.tags ? options.tags.split(',').map((s) => s.trim()) : []),
  ]

  const projectOffset = offsetFromRoot(projectRoot)

  const frontEndProject = readProjectConfiguration(
    tree,
    options.frontEndProjectName,
  )
  const frontEndProjectRoot = frontEndProject.root
  const frontEndProjectOutput =
    frontEndProject.targets?.build?.options.outputPath ??
    ` dist/${frontEndProjectRoot}`
  const basePath = await readBasePathFromNextConfig(frontEndProjectRoot)

  return {
    ...options,
    serviceName: options.frontEndProjectName,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
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
  {
    projectName,
    projectRoot,
  }: Pick<NormalizedSchema, 'projectName' | 'projectRoot'>,
) {
  const projectConfig = readProjectConfiguration(tree, projectName)
  const withOpenNextBuildDependency = {
    dependsOn: ['build', '^opennext-build'],
  }

  const cdkDeployTarget = Object.assign(
    {},
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    projectConfig.targets!.deploy,
    withOpenNextBuildDependency,
  )

  const cdkSynthTarget = Object.assign(
    {},
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    projectConfig.targets!.synth,
    withOpenNextBuildDependency,
  )

  const cdkDestroyTarget = Object.assign(
    {},
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    projectConfig.targets!.destroy,
    withOpenNextBuildDependency,
  )

  const cdkDiffTarget = Object.assign(
    {},
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    projectConfig.targets!.diff,
    withOpenNextBuildDependency,
  )

  updateProjectConfiguration(tree, projectName, {
    ...projectConfig,
    targets: {
      ...projectConfig.targets,
      deploy: {
        executor: 'nx:run-commands',
        options: {
          command: `nx cdk-deploy ${projectName} --configuration={args.configuration} --profile {args.profile}`,
        },
        configurations: {
          development: {
            configuration: 'development',
          },
          production: {
            configuration: 'production',
          },
        },
      },
      ['cdk-deploy']: cdkDeployTarget,
      synth: cdkSynthTarget,
      destroy: cdkDestroyTarget,
      diff: cdkDiffTarget,
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
    frontEndProjectName,
  }: Pick<NormalizedSchema, 'projectName' | 'frontEndProjectName'>,
) {
  const projectConfig = readProjectConfiguration(tree, projectName)

  updateProjectConfiguration(tree, projectName, {
    ...projectConfig,
    implicitDependencies: [frontEndProjectName],
  })
}
