import { Tree, formatFiles, getWorkspaceLayout, names } from '@nx/devkit'
import { Linter } from '@nx/linter'
import { libraryGenerator as createNextLibrary } from '@nx/next'
import { libraryGenerator as createReactLibrary } from '@nx/react'
import type { Schema as ReactLibrarySchema } from '@nx/react/src/generators/library/schema'

import setupTesting from '../jest-config'
import type { NormalizedSchema, Schema } from './schema'
import { generateTags, isProjectANextJSProject } from './util'

/**
 * TODO: move this to a shared space.
 */
const normalizeProjectName = (options: {
  name: string
  directory?: string
  project?: string
}) => {
  const { fileName: directory } = getNames(options.directory)
  const { fileName: name } = getNames(options.name)

  return [directory ?? null, name ?? null].filter(Boolean).join('-')
}

const getNames = (input: string | undefined) => {
  const noop: {
    name: string | null
    className: string | null
    propertyName: string | null
    constantName: string | null
    fileName: string | null
  } = {
    name: null,
    className: null,
    propertyName: null,
    constantName: null,
    fileName: null,
  }

  if (input) {
    return names(input)
  } else {
    return noop
  }
}

const normalizeProjectPath = (options: {
  name?: string
  directory?: string
  project?: string
  libsDir?: string
}) => {
  const { fileName: project } = getNames(options.project)
  const { fileName: directory } = getNames(options.directory)
  const { fileName: name } = getNames(options.name)

  return [options.libsDir, project, directory, name].filter(Boolean).join('/')
}

const normalizeSchema = (tree: Tree, schema: Schema): NormalizedSchema => {
  const { npmScope, libsDir } = getWorkspaceLayout(tree)
  const projectName = normalizeProjectName(schema)
  const projectImportPath = `@${npmScope}/${projectName}`
  const projectPath = normalizeProjectPath({
    libsDir,
    name: schema.name,
    directory: schema.directory,
  })

  const projectDirectory = normalizeProjectPath({
    directory: schema.directory,
  })

  return {
    projectParent: schema.project,
    name: schema.name,
    projectName,
    projectPath,
    projectDirectory,
    projectImportPath,
    projectTags: generateTags(schema.project, schema.tags),
  }
}
async function generateLibrary(tree: Tree, schema: NormalizedSchema) {
  const libraryOptions: ReactLibrarySchema = {
    name: schema.name,
    directory: schema.projectDirectory,
    linter: Linter.EsLint,
    style: 'styled-components',
    unitTestRunner: 'jest',
    buildable: true,
    importPath: schema.projectImportPath,
    component: false,
    tags: schema.projectTags,
    skipFormat: true,
    skipTsConfig: false,
  }

  if (isProjectANextJSProject(tree, schema.projectParent)) {
    // @ts-ignore
    await createNextLibrary(tree, libraryOptions)
  } else {
    await createReactLibrary(tree, libraryOptions)
  }

  await setupTesting(tree, {
    projectName: schema.projectName,
    prefillJestSetup: true,
    setupJestPath: `${schema.projectPath}/src/setup-jest.ts`,
  })
}

export default async function (tree: Tree, schema: Schema) {
  const normalizedSchema = normalizeSchema(tree, schema)
  await generateLibrary(tree, normalizedSchema)
  await formatFiles(tree)
}

export { Schema } from './schema'
