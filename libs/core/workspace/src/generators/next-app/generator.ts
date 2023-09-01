import {
  formatFiles,
  names,
  Tree,
  installPackagesTask,
  readProjectConfiguration,
  updateProjectConfiguration,
  getWorkspaceLayout,
} from '@nx/devkit'
import {cypressProjectGenerator} from '@nx/cypress'
import {AppGeneratorSchema} from './schema'
import {applicationGenerator} from '@nx/next'
import convertAppToOpenNext from '../convert-to-opennext/generator'

export default async function (tree: Tree, _options: AppGeneratorSchema) {
  const options = normalizeOptions(_options)
  await applicationGenerator(tree, {
    swc: true,
    style: 'css',
    tags: `domain:${options.appName}`,
    directory: options.appName,
    name: options.name,
    e2eTestRunner: 'none',
    appDir: true,
  })
  addStageNameAsInput(tree, options.projectName)
  installPackagesTask(tree)
  await convertAppToOpenNext(tree, {name: options.projectName})
  // const projectRoot = readProjectConfiguration(tree, options.projectName).root
  // disabledCssStyleLint(tree, projectRoot)
  // outputJestConfig(tree, projectRoot)
  //generateCustomE2EProject(tree, options)
  await formatFiles(tree)
}

interface NormalizedSchema extends AppGeneratorSchema {
  projectName: string
}

function normalizeOptions(options: AppGeneratorSchema): NormalizedSchema {
  const name = names(options.name).fileName
  const projectDirectory = `${options.appName ? `${options.appName}/` : ''}${name}`
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
  fileAsString = fileAsString?.replace('export default', 'const jestConfig: Config =')
  fileAsString += `\nexport default jestConfig;`

  tree.write(jestConfigLocation, fileAsString)
}

function generateCustomE2EProject(tree: Tree, options: NormalizedSchema) {
  const e2eProjectName = `${options.name}-e2e`
  const e2eProjectRoot = `${getWorkspaceLayout(tree).appsDir}/${
    options.appName
  }/${e2eProjectName}`

  cypressProjectGenerator(tree, {
    name: e2eProjectName,
    directory: options.appName,
    project: options.projectName,
  })

  const path = `${e2eProjectRoot}/src/e2e/app.cy.ts`
  const contents = tree.read(path)?.toString()

  let updatedContent = contents ?? ''
  updatedContent = updatedContent.replace(
    `Welcome ${options.appName}-${options.name}`,
    `Welcome ${options.name}`,
  )
  tree.write(path, updatedContent)
}
