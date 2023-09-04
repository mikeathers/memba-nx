// Plan for this:
// Run like ts-node ./tools/scripts/bump-package-version.ts [project-name]
// this will then go into the package.json for the project and increase the [version] {major,minor,patch}
import path from 'node:path'
import type {ReleaseType} from 'semver'
import increment from 'semver/functions/inc'
import parseVersion from 'semver/functions/parse'

import {parseArgv} from './_util/argv'
import {
  getProjectPackageJson,
  getProjectPath,
  updateProjectPackageJson,
} from './_util/cmd-util'
import type {PackageJson} from './_util/packageJson'
import * as git from './git'

function incrementPackageVersion(
  packageJson: PackageJson,
  releaseType: ReleaseType,
  identifier?: string,
) {
  const oldVersion = parseVersion(packageJson.version)

  if (!oldVersion) {
    throw new Error(`Old Version for ${packageJson.name} is invalid, bailing.`)
  }

  const newVersion = increment(oldVersion, releaseType, undefined, identifier)

  if (!newVersion) {
    throw new Error(`New Version for ${packageJson.name} is invalid, bailing.`)
  }

  return newVersion
}

async function getCurrentBranch() {
  return git
    .revParse('HEAD', {
      abbrevRef: true,
    })
    .then((response) =>
      response
        .trim()
        .replace(new RegExp('\n', 'g'), '')
        .replace(new RegExp(' ', 'g'), '-')
        .replace(new RegExp('/', 'g'), '-')
        .toLocaleLowerCase(),
    )
}

async function commitProjectPackageJson(
  projectPath: string,
  packageName: string,
  newVersion: string,
) {
  const pathToPackageJson = path.join(projectPath, 'package.json')

  await git.add(pathToPackageJson)
  await git.commit(`chore: bump ${packageName} version to ${newVersion} [skip-ci]`)
  await git.push()
}

/**
 * Actual Stuff Happens here.
 */
async function main() {
  const {projectName, releaseType} = parseArgv()
  const projectPath = await getProjectPath(projectName)
  const packageJson = await getProjectPackageJson(projectPath)
  const branch = await getCurrentBranch()
  const newVersion = incrementPackageVersion(
    packageJson,
    releaseType,
    releaseType === 'prerelease' ? branch : undefined,
  )

  await updateProjectPackageJson(projectPath, {
    ...packageJson,
    version: newVersion,
  })

  await commitProjectPackageJson(projectPath, packageJson.name, newVersion)
}

main().catch((error: Error) => {
  console.error(`Error: ${error}`)
  process.exit(1)
})
