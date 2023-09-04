import {exec} from 'node:child_process'

import {optionsToArgs} from './_util/cmd-util'

function gh(subcommands: TemplateStringsArray | string) {
  return new Promise((resolve, reject) => {
    const cmd = `gh ${subcommands}`
    console.log(`> ${cmd}`)

    let stderr: string = '',
      stdout: string = ''

    const prog = exec(cmd, {env: process.env})

    prog.stderr?.on('data', (data) => {
      stderr += data
      console.error(data)
    })

    prog.stdout?.on('data', (data) => {
      stdout += data
      console.log(data)
    })

    prog.once('close', (exitCode) => {
      if (exitCode === 0) {
        resolve(stdout)
      }

      reject(stderr)
    })
  })
}

interface CreateReleaseOptions {
  /**
   * Start a discussion in the specified category
   */
  discussionCategory?: string
  /**
   * Save the release as a draft instead of publishing it
   */
  draft?: boolean
  /**
   * Automatically generate title and notes for the release
   */
  generateNotes?: boolean
  /**
   * Mark this release as "Latest" (default: automatic based on date and version)
   */
  latest?: boolean
  /**
   * Release notes
   */
  notes?: string
  /**
   * Mark the release as a prerelease
   */
  prerelease?: boolean
  /**
   * Read release notes from file
   */
  notesFile?: string
  /**
   * Tag to use as the starting point for generating release notes
   */
  notesStartTag?: string
  /**
   * Target branch or full commit SHA (default: main branch)
   * @default "main"
   */
  target?: string
  /**
   * Release title
   */
  title?: string
}

export async function createRelease(tag: string, options: CreateReleaseOptions) {
  const args = optionsToArgs(options)
  return await gh(`release create "${tag}" ${args}`)
}
