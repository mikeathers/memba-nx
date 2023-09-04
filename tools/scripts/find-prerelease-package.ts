/**
 * Uses Nx Affected to determine if a project has a pre-release
 */
import {setFailed} from '@actions/core'
import prerelease from 'semver/functions/prerelease'

import {getProjectPackageJson, getProjectPath} from './_util/cmd-util'
import * as nx from './determine-affected/nx'

function isError(input: unknown): input is Error {
  return input instanceof Error
}

function assert<A extends unknown, B extends A>(a: A, b: B): a is typeof b {
  if (a !== b) {
    throw new Error('assertion failed')
  }

  return true
}

async function main() {
  const affectedProjects = await nx.printAffected({
    target: 'publish',
    select: 'tasks.target.project',
  })

  const results: [string, ReturnType<typeof prerelease>][] = []
  let failingProjectName: string = ''

  if (!Array.isArray(affectedProjects) || affectedProjects.length === 0) {
    console.log('Nothing to do, bailing...')
    return
  }

  for (const projectName of affectedProjects) {
    const projectPath = await getProjectPath(projectName)
    const projectPackageJson = await getProjectPackageJson(projectPath)
    const result = prerelease(projectPackageJson.version)
    results.push([projectName, result])
  }

  try {
    results.forEach(([projectName, result]) => {
      if (result !== null) {
        failingProjectName = projectName
      }

      assert(result, null)
    })
    console.log('success: no pre-release found.')
  } catch {
    setFailed(` pre-release found for project: ${failingProjectName}`)
  }
}

main().catch((error) => {
  let errorMessage = error
  if (isError(error)) {
    errorMessage = error.message
  }

  console.error(errorMessage)
  process.exit(1)
})
