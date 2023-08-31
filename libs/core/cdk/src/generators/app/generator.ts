import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit'
import * as path from 'node:path'
import { AppGeneratorSchema } from './schema'
import { jestProjectGenerator } from '@nrwl/jest'

interface NormalizedSchema extends AppGeneratorSchema {
  projectName: string
  projectRoot: string
  projectDirectory: string
  parsedTags: string[]
  outputPath: string
}

function normalizeOptions(
  tree: Tree,
  options: AppGeneratorSchema,
): NormalizedSchema {
  const name = names(options.name).fileName
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-')
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : []
  const outputPath = `dist/${projectRoot}`

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    outputPath,
  }
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  }
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions,
  )
}

export default async function (tree: Tree, options: AppGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options)
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@nrwl/js:tsc',
        options: {
          main: `${normalizedOptions.projectRoot}/bin/${normalizedOptions.projectName}.ts`,
          tsConfig: `${normalizedOptions.projectRoot}/tsconfig.json`,
          outputPath: normalizedOptions.outputPath,
        },
        outputs: ['{options.outputPath}'],
      },
      deploy: {
        executor: '@memba-nx/core/cdk:cdk',
        options: {
          command: 'deploy',
          output: normalizedOptions.outputPath + '/cdk.out',
        },
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        configurations: {
          ephemeral: { context: { stageName: 'ephemeral' } },
          development: { context: { stageName: 'development' } },
          production: { context: { stageName: 'production' } },
        },
      },
      synth: {
        executor: '@memba-nx/core/cdk:cdk',
        options: {
          command: 'synth',
          output: normalizedOptions.outputPath + '/cdk.out',
        },
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        configurations: {
          ephemeral: { context: { stageName: 'ephemeral' } },
          development: { context: { stageName: 'development' } },
          production: { context: { stageName: 'production' } },
        },
      },
      diff: {
        executor: '@memba-nx/core/cdk:cdk',
        options: {
          command: 'diff',
          output: normalizedOptions.outputPath + '/cdk.out',
        },
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        configurations: {
          ephemeral: { context: { stageName: 'ephemeral' } },
          development: { context: { stageName: 'development' } },
          production: { context: { stageName: 'production' } },
        },
      },
      destroy: {
        executor: '@memba-nx/core/cdk:cdk',
        options: {
          command: 'destroy',
          output: normalizedOptions.outputPath + '/cdk.out',
        },
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        configurations: {
          ephemeral: { context: { stageName: 'ephemeral' } },
          development: { context: { stageName: 'development' } },
          production: { context: { stageName: 'production' } },
        },
      },
    },
    tags: normalizedOptions.parsedTags,
  })
  addFiles(tree, normalizedOptions)

  await jestProjectGenerator(tree, {
    project: normalizedOptions.projectName,
    supportTsx: false,
    setupFile: 'none',
    skipSerializers: true,
    testEnvironment: 'node',
    skipFormat: true,
  })

  updateJestConfig(tree, normalizedOptions)

  await formatFiles(tree)
}

/** fixes the linting error in jest config files... */
function updateJestConfig(tree: Tree, options: NormalizedSchema) {
  const jestConfigLocation = `${options.projectRoot}/jest.config.ts`
  const fileContents = tree.read(jestConfigLocation)
  let fileAsString = fileContents?.toString()

  fileAsString = `import type { Config } from 'jest';\n${fileAsString}`
  fileAsString = fileAsString?.replace('/* eslint-disable */', '')
  fileAsString = fileAsString?.replace(
    'export default',
    'const jestConfig: Config =',
  )
  fileAsString += `\nexport default jestConfig;`

  tree.write(jestConfigLocation, fileAsString)
}
