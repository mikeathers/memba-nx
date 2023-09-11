#!/usr/bin/env node
import 'source-map-support/register'
import {App} from 'aws-cdk-lib'

import CONFIG from './config'
import {DeploymentStack} from './deployment-stack'

const app = new App()
const stackName = `${CONFIG.STACK_PREFIX}DeploymentStack`

const defaultConfig = {
  stackName,
  tags: {
    service: 'storybook-deployment',
    version: 'N/A',
    env: 'prod',
  },
}

console.log('DEPLOYMENT')

new DeploymentStack(app, stackName, {
  ...defaultConfig,
  env: {
    account: CONFIG.AWS_ACCOUNT_ID_PROD,
    region: CONFIG.REGION,
  },
  tags: {
    ...defaultConfig.tags,
    env: 'prod',
  },
})
