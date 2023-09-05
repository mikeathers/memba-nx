import {ExecutorContext, joinPathFragments, logger} from '@nrwl/devkit'
import {exists, isTrue, replaceAllString, runCommandProcess} from './util'
import {readFile, writeFile} from 'node:fs/promises'
import path = require('node:path')

export async function doOpenNextBuild(
  context: ExecutorContext,
  {
    debug,
    minify,
    cwd,
  }: {
    debug: boolean
    minify: boolean
    cwd: string
  },
) {
  const NODE_MODULES = joinPathFragments(context.root, 'node_modules')
  const openNextBinary = joinPathFragments(NODE_MODULES, '.bin/open-next')
  const openNextArgs = `${minify ? '--minify' : ''}`

  process.env['OPEN_NEXT_DEBUG'] = debug ? 'true' : 'false'

  return await runCommandProcess(`node ${openNextBinary} build ${openNextArgs}`, cwd)
}

/**
 * This function opens the .open-next/servier-function/<path>/.next/required-server-files.json
 * and replaces the reference to the dist folder.
 */
export async function doFixRequiredServerFiles({
  workspaceRoot,
  projectRoot,
}: {
  projectRoot: string
  workspaceRoot: string
}) {
  const requiredServerFilesJsonPath = `${workspaceRoot}/dist/${projectRoot}/.open-next/server-function/dist/${projectRoot}/.next/required-server-files.json`
  const fileContents = replaceAllString(
    (await readFile(requiredServerFilesJsonPath)).toString('utf8'),
    '../../../dist',
    '../../../../dist',
  )

  try {
    const parsedFileContents = JSON.parse(fileContents) // this is valid json...

    await writeFile(
      requiredServerFilesJsonPath,
      JSON.stringify(parsedFileContents, null, 2),
    )
    return true
  } catch {
    return false
  }
}

export async function readBasePath({
  workspaceRoot,
  projectRoot,
}: {
  workspaceRoot: string
  projectRoot: string
}) {
  // Read the routes-manifest.json for the basePath.
  const routeManifestJsonPath = `${workspaceRoot}/dist/${projectRoot}/.open-next/server-function/dist/${projectRoot}/.next/routes-manifest.json`

  try {
    const fileContents = (await readFile(routeManifestJsonPath)).toString('utf8')
    const routesManifest = JSON.parse(fileContents) as RouteManifest
    return routesManifest.basePath
  } catch (error) {
    logger.error(error)
    return '/'
  }
}

export async function doUpdatePublicFilesJSON({
  workspaceRoot,
  projectRoot,
}: {
  workspaceRoot: string
  projectRoot: string
}) {
  const publicFilesJsonPath = `${workspaceRoot}/dist/${projectRoot}/.open-next/server-function/dist/${projectRoot}/.open-next/public-files.json`

  try {
    const fileContents = (await readFile(publicFilesJsonPath)).toString('utf8')
    const basePath = await readBasePath({workspaceRoot, projectRoot})
    const publicFiles = JSON.parse(fileContents) as PublicFiles

    // if the asset path does not already start with basePath, append it.
    publicFiles.files = publicFiles.files.map((assetPath: string) =>
      assetPath.startsWith(basePath) ? assetPath : `${basePath}${assetPath}`,
    )

    await writeFile(publicFilesJsonPath, JSON.stringify(publicFiles, null, 2))
    return true
  } catch (error) {
    logger.error(error)
    return false
  }
}

/**
 * Fix datadog by adding an empty file in node_modules/
 * this resolves https://github.com/vercel/next.js/issues/40735
 */
export async function doFixDatadog(props: {workspaceRoot: string; projectRoot: string}) {
  const functions = ['server-function']
  const distPath = `${props.workspaceRoot}/dist/${props.projectRoot}/.open-next`
  const emptyFile = `"use strict";
  Object.defineProperty(exports, "__esModule", {
      value: true
  });
  exports.default = void 0;
  `

  const results = await Promise.all(
    functions.map(async (functionName) => {
      console.log(`Patching ${functionName} for datadog`)
      const functionDistPath = `${distPath}/${functionName}/`
      const nextJSPackageDir = path.resolve(`${functionDistPath}/node_modules/next`)
      const nextPkg = await readFile(path.join(nextJSPackageDir, 'package.json'), 'utf8')
      const nextJSPackageJson = JSON.parse(nextPkg.toString())
      const mainEntryFile = path.join(nextJSPackageDir, nextJSPackageJson.main)
      if (!(await exists(mainEntryFile))) {
        await writeFile(mainEntryFile, emptyFile)
      }

      return true
    }),
  )

  return results.every((result) => isTrue(result))
}

type RouteManifest = {
  version: number
  pages404: boolean
  basePath: string
  redirects: unknown[]
  headers: unknown[]
  dynamicRotes: unknown[]
  staticRoutes: unknown[]
  dataRoutes: unknown[]
  rewrites: unknown[]
}

type PublicFiles = {
  files: string[]
}
