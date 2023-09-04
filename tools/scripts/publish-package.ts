/**
 * Simple Script to publish the given project's dist folder
 **/
import * as path from 'node:path'

import * as nx from './determine-affected/nx'
import * as yarn from './yarn'

export const MONOREPO_ROOT = path.join(__dirname, '../../')
const IS_CI = !!process.env['CI']
const PROJECT_NAME = process.argv[2]

const helpText = `
  run the script like "ts-node ./tools/scripts/publish-package.ts [project-name]"
`

async function main() {
  if (PROJECT_NAME) {
    const projectConfig = await nx.readProjectConfiguration(PROJECT_NAME)
    if (!projectConfig) {
      throw new Error(`Project "${PROJECT_NAME}" not found.`)
    }

    const buildTarget = projectConfig.targets?.['build']
    if (!buildTarget) {
      throw new Error(`Project "${PROJECT_NAME}" is not buildable.`)
    }

    const outputDir = buildTarget?.options?.outputPath
    if (!outputDir) {
      throw new Error(`Project "${PROJECT_NAME}" does not have an outputDir`)
    }

    const success = await yarn.publish({
      silent: true,
      nonInteractive: true,
      cwd: path.join(MONOREPO_ROOT, outputDir),
    })

    if (!success) {
      throw new Error(`Failed to Publish ${PROJECT_NAME}.`)
    }

    console.log('Package Published.')
  } else {
    throw new Error(`Project Name not provided
       ${helpText}
    `)
  }
}

main().catch((error: Error) => {
  console.error(`Error: ${error.message}`)
  if (!IS_CI) {
    console.log(error.stack)
  }

  process.exit(1)
})
