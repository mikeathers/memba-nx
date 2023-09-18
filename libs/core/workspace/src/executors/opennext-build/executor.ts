import {OpennextBuildExecutorSchema} from './schema'
import {ExecutorContext, logger} from '@nrwl/devkit'

import {
  doFixRequiredServerFiles,
  doOpenNextBuild,
  doUpdatePublicFilesJSON,
} from './commands'

import {isTrue, runCommands} from './util'

export default async function runExecutorMain(
  options: OpennextBuildExecutorSchema,
  context: ExecutorContext,
) {
  try {
    const projectName = context.projectName ?? ''
    const projectRoot = context.workspace?.projects[projectName].root ?? ''
    const projectOutputDir = `${context.root}/dist/${projectRoot}`

    const results = await runCommands([
      // Run open-next build
      () =>
        doOpenNextBuild(context, {
          cwd: projectOutputDir,
          debug: options.debug ?? false,
          minify: options.minify ?? false,
        }),
      // Update required-server-files.json to the correct path.
      () => doFixRequiredServerFiles({workspaceRoot: context.root, projectRoot}),
      // Update public-files.json to include basePath
      () => doUpdatePublicFilesJSON({workspaceRoot: context.root, projectRoot}),
    ])

    return {
      success: results.every((element) => isTrue(element)),
    }
  } catch (error) {
    logger.error(error)

    return {
      success: false,
    }
  }
}
