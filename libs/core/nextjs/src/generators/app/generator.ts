import {
  formatFiles,
  names,
  Tree,
  installPackagesTask,
  readProjectConfiguration,
  updateProjectConfiguration,
  getWorkspaceLayout,
} from '@nx/devkit'
import { cypressProjectGenerator } from '@nx/cypress'
import { AppGeneratorSchema } from './schema'
import { applicationGenerator } from '@nx/next'
import convertAppToOpenNext from '../convert-to-opennext/generator'

export default async function (tree: Tree, _options: AppGeneratorSchema) {
  const options = normalizeOptions(_options)
  await applicationGenerator(tree, {
    swc: true,
    style: 'css',
    tags: `domain:${options.directory}`,
    directory: options.directory,
    name: options.name,
    e2eTestRunner: 'none',
  })
  addStageNameAsInput(tree, options.projectName)
  installPackagesTask(tree)
  await convertAppToOpenNext(tree, { name: options.projectName })
  const projectRoot = readProjectConfiguration(tree, options.projectName).root
  disabledCssStyleLint(tree, projectRoot)
  outputJestConfig(tree, projectRoot)
  await formatFiles(tree)
}

interface NormalizedSchema extends AppGeneratorSchema {
  projectName: string
}

function normalizeOptions(options: AppGeneratorSchema): NormalizedSchema {
  const name = names(options.name).fileName
  const projectDirectory = `${
    options.directory ? `${options.directory}/` : ''
  }${name}`
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-')

  return {
    ...options,
    projectName,
  }
}

function addStageNameAsInput(tree: Tree, projectName: string) {
  const projectConfig = readProjectConfiguration(tree, projectName)

  const nextBuild = Object.assign(
    {
      inputs: ['default', 'stageName'],
    },
    projectConfig.targets?.build,
  )

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  projectConfig.targets!.build = nextBuild

  updateProjectConfiguration(tree, projectName, projectConfig)
}

function disabledCssStyleLint(
  tree: Tree,
  path: string,
  files = ['index.module.css', 'styles.css'],
) {
  files.forEach((file) => {
    const filePath = `${path}/pages/${file}`
    const contents = tree.read(filePath)?.toString()
    const newContent = `/* stylelint-disable  */`
    let updatedContent = contents ?? ''

    if (contents && !contents?.includes(newContent)) {
      updatedContent = `${newContent}\n${contents}`
    }

    tree.write(filePath, updatedContent)
  })
}

function outputJestConfig(tree: Tree, path: string) {
  const jestConfigLocation = `${path}/jest.config.ts`

  const fileContents = tree.read(jestConfigLocation)
  let fileAsString = "import type { Config } from 'jest'\n"

  fileAsString += fileContents?.toString()

  fileAsString = fileAsString?.replace('/* eslint-disable */', '')
  fileAsString = fileAsString?.replace(
    'export default',
    'const jestConfig: Config =',
  )
  fileAsString += `\nexport default jestConfig;`

  tree.write(jestConfigLocation, fileAsString)
}
