import { exec } from 'node:child_process'
import { logger } from '@nrwl/devkit'
export const LARGE_BUFFER = 1024 * 1_000_000

const NX_WORKSPACE_ROOT = process.env.NX_WORKSPACE_ROOT ?? ''

if (!NX_WORKSPACE_ROOT) {
  throw new Error('CDK not Found')
}

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
