import {
  Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
  updateJson,
} from '@nrwl/devkit'
import { addPropertyToJestConfig } from '@nrwl/jest'
import { parse, relative } from 'path'

import { Schema } from './schema'
import { getProjectRoot, getProjectType, relativePathToMocks } from './utils'

const JEST_SETUP_FILENAME = 'jest.setup.ts'

interface HasPathToFile {
  pathToFile: string
}

interface AddSetupFilesAfterEnvOptions extends HasPathToFile {
  newSetupFiles: string[]
}

interface NormalizedSchema extends Schema {
  projectRoot: string
  projectSetupJest: string
  projectTsConfig: string
}

function __addSetupFilesAfterEnv(
  tree: Tree,
  { newSetupFiles, pathToFile }: AddSetupFilesAfterEnvOptions,
) {
  return addPropertyToJestConfig(
    tree,
    pathToFile,
    'setupFilesAfterEnv',
    newSetupFiles,
  )
}

interface AddModuleNameMapperOptions extends HasPathToFile {
  moduleMapping: Record<string, string>
}

function __addModuleNameMapper(
  tree: Tree,
  { moduleMapping, pathToFile }: AddModuleNameMapperOptions,
) {
  return addPropertyToJestConfig(
    tree,
    pathToFile,
    'moduleNameMapper',
    moduleMapping,
  )
}

function createEmptySetupJestFile(tree: Tree, path: string, fileName: string) {
  tree.write(`${path}/${fileName}`, '// Add your Mocks here.')
}

function addJestSetupFile(
  tree: Tree,
  {
    projectName,
    prefillJestSetup,
    projectRoot,
    projectTsConfig,
    projectSetupJest,
  }: NormalizedSchema,
) {
  if (tree.exists(projectSetupJest)) {
    console.info(
      `>> [${projectName}] ${JEST_SETUP_FILENAME} file already exists. skipping generation of one.`,
    )
    return
  }

  const { base: jestSetupFile, dir: jestSetupFolder } = parse(projectSetupJest)
  const jestSetupRelativeToProjectRoot = relative(projectRoot, projectSetupJest)

  if (prefillJestSetup) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, './files'),
      jestSetupFolder,
      {
        jestSetupFile: jestSetupFile.replace('.ts', ''),
      },
    )
  } else {
    createEmptySetupJestFile(tree, jestSetupFolder, jestSetupFile)
  }

  // Add setup-jest to includes array in spec tsconfig
  updateJson(
    tree,
    joinPathFragments(projectRoot, 'tsconfig.spec.json'),
    (tsSpecConfig) => {
      tsSpecConfig.include = [
        jestSetupRelativeToProjectRoot,
        ...(tsSpecConfig?.include ?? []),
      ]

      return tsSpecConfig
    },
  )

  const jestSetupFilename =
    // Add setup-jest to Excludes Array in lib tsconfig
    updateJson(
      tree,
      joinPathFragments(projectRoot, projectTsConfig),
      (tsLibConfig) => {
        tsLibConfig.exclude = [
          jestSetupRelativeToProjectRoot,
          ...(tsLibConfig?.exclude ?? []),
        ]

        return tsLibConfig
      },
    )
}

function updateJestConfig(
  tree: Tree,
  { projectName, projectRoot, projectSetupJest }: NormalizedSchema,
) {
  const jestConfigPath = joinPathFragments(projectRoot, 'jest.config.js')

  const jestSetupPath = projectSetupJest.replace(projectRoot, '<rootDir>')

  const setupFiles = [jestSetupPath]

  __addSetupFilesAfterEnv(tree, {
    newSetupFiles: setupFiles,
    pathToFile: jestConfigPath,
  })

  const relativePathToMocksFolder = relativePathToMocks(tree, projectName)

  const mocks = {
    '\\.svg$': joinPathFragments(relativePathToMocksFolder, 'svgrMock.tsx'),
  }

  __addModuleNameMapper(tree, {
    moduleMapping: mocks,
    pathToFile: jestConfigPath,
  })
}

const normalizeSchema = (
  tree: Tree,
  { projectName, prefillJestSetup, setupJestPath }: Schema,
): NormalizedSchema => {
  const projectRoot = getProjectRoot(tree, projectName)
  const projectType = getProjectType(tree, projectName)
  const pathToSetupJest = setupJestPath
    ? setupJestPath
    : `${projectRoot}/${JEST_SETUP_FILENAME}`
  const projectTsConfig =
    projectType === 'application' ? 'tsconfig.json' : 'tsconfig.lib.json'

  return {
    projectName,
    prefillJestSetup,
    setupJestPath,
    projectRoot,
    projectSetupJest: pathToSetupJest,
    projectTsConfig: projectTsConfig,
  }
}

export default async (tree: Tree, schema: Schema) => {
  const normalizedSchema = normalizeSchema(tree, schema)
  addJestSetupFile(tree, normalizedSchema)
  updateJestConfig(tree, normalizedSchema)
  await formatFiles(tree)
}
