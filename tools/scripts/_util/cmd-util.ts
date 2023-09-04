import {readJsonFile, writeJsonFile} from '@nrwl/devkit'
import path from 'node:path'

import * as nx from '../determine-affected/nx'
import {PackageJson, packageJsonParser} from './packageJson'

const MONOREPO_ROOT = path.join(__dirname, '../../../')

export function camelCaseToKebabCase(input: string): string {
  return input.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

export function optionsToArgs<Opt extends {}>(options: Opt): string {
  return Object.entries(options)
    .filter(([, value]) => !(value === undefined || value === null || value === ''))
    .map(([key, value]) => {
      if (typeof value === 'boolean' && value === true) {
        return `--${camelCaseToKebabCase(key)}`
      } else {
        return `--${camelCaseToKebabCase(key)}="${value}"`
      }
    })
    .join(' ')
}

export async function getProjectPath(projectName: string) {
  const projectPath = await nx.getProjectRoot(projectName)

  if (!projectPath) {
    throw new Error(`Project "${projectName}" not found.`)
  }

  return projectPath
}

export async function getProjectPackageJson(projectPath: string): Promise<PackageJson> {
  const pathToPackageJson = path.join(MONOREPO_ROOT, projectPath, 'package.json')

  const json = readJsonFile(pathToPackageJson, {expectComments: true})

  return packageJsonParser.parse(json)
}

export async function updateProjectPackageJson(
  projectPath: string,
  packagejson: PackageJson,
) {
  const pathToPackageJson = path.join(MONOREPO_ROOT, projectPath, 'package.json')

  writeJsonFile(pathToPackageJson, packagejson)
}
