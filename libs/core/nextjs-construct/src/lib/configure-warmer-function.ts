import { Duration, Stack } from 'aws-cdk-lib'
import { Rule, Schedule } from 'aws-cdk-lib/aws-events'
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets'
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import {
  Architecture,
  Function as CDKFunction,
  Code,
  Runtime,
} from 'aws-cdk-lib/aws-lambda'
import {
  AwsCustomResource,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources'
import { Construct } from 'constructs'
import { createArchive } from './util'
import * as path from 'node:path'
import * as os from 'node:os'
import * as fs from 'node:fs'

export interface WarmerFunctionProps {
  buildPath: string
  concurrency?: number
  schedule?: number
  serverFunction: CDKFunction
}

export function createWarmerFunction(
  scope: Construct,
  {
    buildPath,
    serverFunction,
    concurrency = 1,
    schedule = 5,
  }: WarmerFunctionProps,
) {
  const zippedFunctionPath = createArchive({
    zipFileName: 'function.zip',
    directory: `${buildPath}/.open-next/warmer-function`,
    zipOutDir: fs.mkdtempSync(
      path.join(os.tmpdir(), Stack.of(scope).stackName + '-'),
    ),
  })

  const warmerFunctionCode = Code.fromAsset(zippedFunctionPath)

  const warmerFunction = new CDKFunction(scope, 'warmer-function', {
    description: 'OpenNext Warmer Function',
    handler: 'index.handler',
    code: warmerFunctionCode,
    runtime: Runtime.NODEJS_18_X,
    architecture: Architecture.ARM_64,
    timeout: Duration.minutes(15),
    memorySize: 512,
    environment: {
      FUNCTION_NAME: serverFunction.functionName,
      CONCURRENCY: concurrency.toString(),
    },
  })

  serverFunction.grantInvoke(warmerFunction)

  //   Create Event bridge
  createEventBridge(scope, warmerFunction, schedule)

  //   Create Custom Resource
  createCustomResource(scope, warmerFunction)

  return warmerFunction
}

function createEventBridge(
  scope: Construct,
  warmerFunction: CDKFunction,
  schedule: number,
) {
  const rule = new Rule(scope, 'warmer-function-rule', {
    schedule: Schedule.rate(Duration.minutes(schedule)),
  })
  rule.addTarget(new LambdaFunction(warmerFunction))
  return rule
}

/**
Custom resource for prewarm
**/

function createCustomResource(scope: Construct, warmerFunction: CDKFunction) {
  // Grant lambda:InvokeFunction permission to allow the custom resource to invoke the warmer function.
  const invokePolicy = new PolicyStatement({
    actions: ['lambda:InvokeFunction'],
    resources: [warmerFunction.functionArn],
  })

  // Create an IAM role for the Custom Resource
  const customResourceRole = new Role(scope, 'custom-resource-role', {
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
  })

  // Attach the policy to the role
  customResourceRole.addToPolicy(invokePolicy)

  // Custom Resource
  const warmerCustomResource = new AwsCustomResource(
    scope,
    'warmer-custom-resource',
    {
      onCreate: {
        physicalResourceId: PhysicalResourceId.of('warmer-custom-resource'),
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: warmerFunction.functionArn,
          Payload: JSON.stringify({ timestamp: new Date().toISOString() }),
        },
      },
      onUpdate: {
        physicalResourceId: PhysicalResourceId.of('warmer-custom-resource'),
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: warmerFunction.functionArn,
          Payload: JSON.stringify({ timestamp: new Date().toISOString() }),
        },
      },
      role: customResourceRole,
    },
  )

  // Make sure the Custom Resource runs on every deployment
  warmerCustomResource.node.addDependency(warmerFunction)
}
