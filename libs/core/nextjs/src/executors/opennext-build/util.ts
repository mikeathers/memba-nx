import { exec } from 'node:child_process'
import { logger } from '@nrwl/devkit'
import { access, constants as fsConstants } from 'node:fs/promises'

export const LARGE_BUFFER = 1024 * 1_000_000

export function runCommandProcess(
  command: string,
  cwd: string,
): Promise<boolean> {
  return new Promise((resolve) => {
    logger.debug(`Executing command: ${command}`)

    const childProcess = exec(command, {
      maxBuffer: LARGE_BUFFER,
      env: process.env,
      cwd: cwd,
    })

    // Ensure the child process is killed when the parent exits
    const processExitListener = () => childProcess.kill()
    process.on('exit', processExitListener)
    process.on('SIGTERM', processExitListener)

    process.stdin.on('data', (data) => {
      childProcess.stdin?.write(data)
      childProcess.stdin?.end()
    })

    childProcess.stdout?.on('data', (data) => {
      process.stdout.write(data)
    })

    childProcess.stderr?.on('data', (err) => {
      process.stderr.write(err)
    })

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(true)
      } else {
        resolve(false)
      }

      process.removeListener('exit', processExitListener)

      if (process.stdin.isTTY) {
        process.stdin.end()
      }
      process.stdin.removeListener('data', processExitListener)
    })
  })
}

export async function runCommands(commands: (() => Promise<boolean>)[]) {
  const results = []

  for (const command of commands) {
    results.push(await command())
  }

  return results
}

export function replaceAllString(
  input: string,
  stringToReplace: string | RegExp,
  stringToReplaceWith: string,
) {
  // If a regex pattern
  if (
    Object.prototype.toString.call(stringToReplace).toLowerCase() ===
    '[object regexp]'
  ) {
    return input.replace(stringToReplace, stringToReplaceWith)
  }

  // If a string
  return input.replace(new RegExp(stringToReplace, 'g'), stringToReplaceWith)
}

export function isTrue(input: unknown): input is true {
  return input === true
}

export async function exists(path: string): Promise<boolean> {
  try {
    await access(path, fsConstants.F_OK)
    return true
  } catch {
    return false
  }
}
