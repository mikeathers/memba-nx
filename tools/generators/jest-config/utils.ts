import {
  Tree,
  joinPathFragments,
  normalizePath,
  readProjectConfiguration,
} from '@nrwl/devkit'
import { ProjectConfiguration } from 'nx-stylelint/node_modules/@nrwl/devkit'
import { relative } from 'path'

export const getProjectRoot = (tree: Tree, projectName: string) => {
  return readProjectConfiguration(tree, projectName).root
}

export const getProjectType = (tree: Tree, projectName: string) => {
  return readProjectConfiguration(tree, projectName).projectType
}

const MOCKS_FOLDER_NAME = '__mocks__'
const JEST_SETUP_FILE_NAME = 'jest.setup.ts'

const getJestSetupPath = (tree: Tree) =>
  joinPathFragments(tree.root, JEST_SETUP_FILE_NAME)

const getMocksPath = (tree: Tree) =>
  joinPathFragments(tree.root, MOCKS_FOLDER_NAME)

export const relativePathToMocks = (tree: Tree, projectName: string) => {
  const projectRootDir = getProjectRoot(tree, projectName)
  const mocksPath = getMocksPath(tree)

  return relative(normalizePath(projectRootDir), normalizePath(mocksPath))
}

export const relativePathToJestSetupFile = (
  tree: Tree,
  projectName: string,
) => {
  const projectRootDir = getProjectRoot(tree, projectName)
  const mocksPath = getJestSetupPath(tree)

  return relative(normalizePath(projectRootDir), normalizePath(mocksPath))
}
