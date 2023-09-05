import * as fs from 'node:fs'
import * as path from 'node:path'
import {spawnSync} from 'node:child_process'

export const normalizeBasePath = (path?: string) =>
  path ? (path.length > 0 ? path?.slice(1) : '') : ''

export const normalizedPathPattern = (basePath = '/', folder = '') =>
  joinPath(normalizeBasePath(basePath))(folder)

export function pathPattern(basePath = '') {
  return (pattern: string) =>
    basePath && basePath.length > 0 ? `${basePath}${pattern}` : pattern
}

function joinPath(basePath = '') {
  return (folder: string) =>
    basePath && basePath.length > 0 ? `${basePath}/${folder}` : folder
}

/** Stolen from cdk-nextjs **/
export type CompressionLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface CreateArchiveArgs {
  readonly compressionLevel?: CompressionLevel
  readonly directory: string
  readonly zipFileName: string
  readonly zipOutDir: string
  readonly fileGlob?: string
  readonly excludeGlob?: string
  readonly quiet?: boolean
}
export function createArchive({
  directory,
  zipFileName,
  zipOutDir,
  fileGlob = '.',
  excludeGlob,
  compressionLevel = 1,
  quiet,
}: CreateArchiveArgs): string {
  console.log({directory})
  // if directory is empty, can skip
  if (!fs.existsSync(directory) || fs.readdirSync(directory).length === 0)
    throw new Error('Directory is Empty!')

  zipOutDir = path.resolve(zipOutDir)
  if (!fs.existsSync(zipOutDir)) {
    fs.mkdirSync(zipOutDir)
  }
  // get output path
  const zipFilePath = path.join(zipOutDir, zipFileName)

  // delete existing zip file
  if (fs.existsSync(zipFilePath)) {
    fs.unlinkSync(zipFilePath)
  }

  // run script to create zipfile, preserving symlinks for node_modules (e.g. pnpm structure)
  const result = spawnSync(
    'bash',
    [
      quiet ? '-c' : '-xc',
      [
        `cd ${directory}`,
        `zip -ryq${compressionLevel} "${zipFilePath}" ${fileGlob} ${
          excludeGlob ? `-x "${excludeGlob}"` : ''
        }`,
      ].join('&&'),
    ],
    {stdio: 'inherit', encoding: 'utf8'},
  )

  if (result.status !== 0) {
    throw new Error(
      `There was a problem generating the package for ${zipFileName} with ${directory}: ${result.error}`,
    )
  }
  // check output
  if (!fs.existsSync(zipFilePath)) {
    throw new Error(
      `There was a problem generating the archive for ${directory}; the archive is missing in ${zipFilePath}.`,
    )
  }

  return zipFilePath
}

const ANSI_YELLOW = '\u001B[33m'
const ANSI_RED = '\u001B[31m'
const ANSI_RESET = '\u001B[0m'
export const yellowText = colorText(ANSI_YELLOW)
export const redText = colorText(ANSI_RED)

function colorText(color: string) {
  return (text: string) => `${color}${text}${ANSI_RESET}`
}
