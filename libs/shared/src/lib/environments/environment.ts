import {environmentDev} from './environment-dev'
import {environmentProd} from './environment-prod'
import {IEnvironment} from './environment.types'
import {environmentLocal} from './environment-local'
import * as process from 'process'

export const environment = (): IEnvironment => {
  console.log('ENV: ', process.env['STAGE_NAME'])
  if (process.env['STAGE_NAME'] === 'production') return environmentProd
  else if (process.env['STAGE_NAME'] === 'development') return environmentDev
  else return environmentLocal
}
