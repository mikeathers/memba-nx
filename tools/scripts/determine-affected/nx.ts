import {ProjectConfiguration, ProjectsConfigurations} from '@nrwl/devkit'
import {exec} from 'node:child_process'
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import process from 'node:process'

import {optionsToArgs} from '../_util/cmd-util'

export const MONOREPO_ROOT = join(__dirname, '../../../')
const NODE_BIN = join(MONOREPO_ROOT, 'node_modules/.bin')
// const EXCLUDE_NX_PROJECTS = process.env.EXCLUDE_NX_PROJECTS ?? ''

async function resolveProjectPath(projectName: string) {
  const workspaceJson = await readFile(join(MONOREPO_ROOT, 'workspace.json')).then(
    (buffer) => JSON.parse(buffer.toString()) as ProjectsConfigurations,
  )

  const projectPath = workspaceJson.projects[projectName] as unknown as string

  if (!projectPath) {
    throw new Error(`Unable to find root for project: ${projectName}`)
  }

  return projectPath
}

function nx(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let stderr: string = '',
      stdout: string = ''

    const cmd = `nx ${command}`
    console.log(`❯ ${cmd}`)
    const prog = exec(cmd, {cwd: MONOREPO_ROOT, env: process.env})

    prog.stderr?.on('data', (data) => {
      stderr += data
      console.error(data)
    })

    prog.stdout?.on('data', (data) => {
      stdout += data
      console.log(data)
    })

    prog?.on('close', (exitCode) => {
      if (exitCode === 0) {
        resolve(stdout)
      }
      reject(new Error(stderr))
    })
  })
}

interface PrintAffectedOptions {
  target: string
  select: string
  exclude: string
  type: 'app' | 'lib'
  configuration: string
}

export function printAffected(options: Partial<PrintAffectedOptions> = {}) {
  const args = optionsToArgs(options)

  return nx(`print-affected ${args}`).then((stdout) => {
    if (!!options.select) {
      return stdout
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
    } else {
      return JSON.parse(stdout)
    }
  })
}

export async function getProjectRoot(projectName: string) {
  return await resolveProjectPath(projectName)
}

export async function readProjectConfiguration(
  projectName: string,
): Promise<ProjectConfiguration> {
  const projectPath = await resolveProjectPath(projectName)
  const projectJSONPath = join(MONOREPO_ROOT, projectPath, 'project.json')
  const projectJSON = await readFile(projectJSONPath).then(
    (buffer) => JSON.parse(buffer.toString()) as ProjectConfiguration,
  )

  return projectJSON
}

export function determineProjectConfigurations(projectJson: ProjectConfiguration) {
  const metadataTarget = projectJson.targets?.['output-metadata']

  if (!metadataTarget || !metadataTarget.configurations) {
    throw new Error(
      `Project ${projectJson.name ?? projectJson.root} is not a valid deploy target`,
    )
  }

  return Object.keys(metadataTarget.configurations)
}
