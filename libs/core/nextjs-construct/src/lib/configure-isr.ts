import { Construct } from 'constructs'
import { Duration as CDKDuration, Stack } from 'aws-cdk-lib'
import { Queue } from 'aws-cdk-lib/aws-sqs'
import { Function as CDKFunction, Runtime, Code } from 'aws-cdk-lib/aws-lambda'
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import * as path from 'node:path'
import * as os from 'node:os'
import * as fs from 'node:fs'

import { createArchive } from './util'

export type SetupISRProps = {
  buildPath: string
  serverFunction: CDKFunction
  bucket: Bucket
}

export function setupISR(scope: Construct, id: string, props: SetupISRProps) {
  const queue = createRevalidationQueue(scope, id)
  const consumer = createRevalidationFunction(scope, {
    path: props.buildPath,
  })
  const stack = Stack.of(scope)

  consumer.addEventSource(new SqsEventSource(queue, { batchSize: 5 }))

  // add the revalidation url
  props.serverFunction.addEnvironment('REVALIDATION_QUEUE_URL', queue.queueUrl)
  props.serverFunction.addEnvironment('REVALIDATION_QUEUE_REGION', stack.region)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  queue.grantSendMessages(props.serverFunction.role!)
  props.bucket.grantReadWrite(props.serverFunction)
  props.bucket.grantReadWrite(consumer)

  return { queue, function: consumer }
}

function createRevalidationQueue(scope: Construct, id: string) {
  return new Queue(scope, `${id}-isr-queue`, {
    fifo: true,
    receiveMessageWaitTime: CDKDuration.seconds(20),
  })
}

function createRevalidationFunction(scope: Construct, props: { path: string }) {
  const zippedFunctionPath = createArchive({
    zipFileName: 'function.zip',
    directory: path.join(props.path, '.open-next', 'revalidation-function'),
    zipOutDir: fs.mkdtempSync(
      path.join(os.tmpdir(), Stack.of(scope).stackName + '-'),
    ),
  })

  return new CDKFunction(scope, `isr-function`, {
    description: 'Next.js Revalidation',
    handler: 'index.handler',
    code: Code.fromAsset(zippedFunctionPath),
    runtime: Runtime.NODEJS_18_X,
    timeout: CDKDuration.seconds(30),
  })
}
