import {parseArgv} from './_util/argv'
import {getProjectPackageJson, getProjectPath} from './_util/cmd-util'
import * as git from './git'
import * as gh from './github'

async function getLastTag(packageName: string) {
  return git
    .listTags(`${packageName}@*`, '-v:refname')
    .then((stdout) => stdout.split('\n')[0])
    .catch(() => {
      // Unable to find last tag this way... try another way.
      return git.describe('HEAD', {match: `${packageName}@*`, abbrev: 0})
    })
}

async function getCurrentRef() {
  return git
    .revParse('HEAD', {
      verify: true,
    })
    .then((response) => response.trim().replace(new RegExp('\n', 'g'), ''))
}

async function main(): Promise<void> {
  console.log('Creating Github Release')
  const {projectName, releaseType} = parseArgv()
  const projectPath = await getProjectPath(projectName)
  const packageJson = await getProjectPackageJson(projectPath)
  const lastTag = await getLastTag(packageJson.name)

  const url = await gh.createRelease(`${packageJson.name}@${packageJson.version}`, {
    title: `Released ${packageJson.name} to version ${packageJson.version}`,
    target: await getCurrentRef(),
    latest: true,
    prerelease: releaseType === 'prerelease',
    generateNotes: true,
    notesStartTag: lastTag,
  })

  console.log(`Github Release: ${url}`)
  git.push({followTags: true})
}

main().catch((error: Error) => {
  console.error(`Failed to Create Github Release: ${error.message}`)
  process.exit(1)
})
