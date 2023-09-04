#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import {
  NextJsConstruct,
  readConfig,
  generateStackName,
} from '@memba-nx/core/nextjs-construct'

const app = new cdk.App()
const stackName = generateStackName('HomeWebStack')
const config = readConfig(app)

new NextJsConstruct(app, stackName, {
  buildPath: '../../../dist/apps/home-web/www',
  ...config,
})
