import {
  readProjectConfiguration,
  formatFiles,
  Tree,
  generateFiles,
  ProjectConfiguration,
  joinPathFragments,
} from '@nrwl/devkit'
import { AddOpennextPackageJsonGeneratorSchema } from './schema'
import { ensureNextJsApp } from '../../shared-utils/ensure-nextjs-app'

interface NormalizedSchema extends AddOpennextPackageJsonGeneratorSchema {
  projectName: string
  projectRoot: string
  projectConfiguration: ProjectConfiguration
}

function normalizeOptions(
  tree: Tree,
  options: AddOpennextPackageJsonGeneratorSchema,
): NormalizedSchema {
  const projectName = options.name
  const projectConfiguration = readProjectConfiguration(tree, projectName)
  const projectRoot = `${projectConfiguration.root}`

  return {
    ...options,
    projectName,
    projectRoot,
    projectConfiguration,
  }
}

const PACKAGE_JSON = 'package.json'

function generatePackageJsonFile(
  tree: Tree,
  path: string,
  projectName: string,
) {
  const templateOptions = {
    projectName: projectName,
    template: '',
  }

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    path,
    templateOptions,
  )
}

function addPackageJsonFile(
  tree: Tree,
  { projectName, projectRoot }: NormalizedSchema,
) {
  console.log({ projectRoot })
  if (tree.exists(`${projectRoot}/${PACKAGE_JSON}`)) {
    console.info(
      `>> [${projectName}] ${PACKAGE_JSON} file already exists. skipping generation of one.`,
    )
    return
  }
}

export default async function (
  tree: Tree,
  options: AddOpennextPackageJsonGeneratorSchema,
) {
  const normalizedOptions = normalizeOptions(tree, options)
  ensureNextJsApp(normalizedOptions.projectConfiguration)

  const projectPath = normalizedOptions.projectConfiguration.root

  generatePackageJsonFile(tree, projectPath, normalizedOptions.name)
  addPackageJsonFile(tree, normalizedOptions)

  await formatFiles(tree)
}
