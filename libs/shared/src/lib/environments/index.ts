import {environment} from './environment'
import {keys} from './environment.types'

export function readFromEnv(key: keys) {
  const envValue = environment()[key]
  console.log({envValue})

  if (envValue === undefined || envValue === null) {
    throw new Error(`
        Missing environment variable value for key ${key}.
        Running locally: Do you have a .env.local file in your app folder that contains ${key}?
        Running in CI: Is ${key} exposed in the CI pipeline file?
        `)
  }

  return envValue
}

export {Env} from './environment.types'
