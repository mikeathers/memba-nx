import {InvalidateCloudfrontExecutorSchema} from './schema'

import {CloudFrontClient, CreateInvalidationCommand} from '@aws-sdk/client-cloudfront'
import {fromSSO} from '@aws-sdk/credential-providers'
import * as fs from 'fs'

interface StackOutputs {
  [key: string]: string
}

export default async function runExecutor(options: InvalidateCloudfrontExecutorSchema) {
  const outputs = JSON.parse(fs.readFileSync(options.outputsFile, 'utf8'))
  const client = new CloudFrontClient({
    region: options.region,
    ...(options.ssoCredentials && {
      credentials: fromSSO({profile: options.profile}),
    }),
  })

  const stacks = Object.entries(outputs)

  if (stacks.length > 1) {
    throw new Error('Outputs file containing more than one stack not supported')
  }

  const stack = stacks[0][1] as StackOutputs

  const id = stack[options.exportName]

  const reference = Date.now()

  const command = new CreateInvalidationCommand({
    DistributionId: id,
    InvalidationBatch: {
      Paths: {Items: ['/*'], Quantity: 1},
      CallerReference: String(reference),
    },
  })

  await client.send(command)

  return {success: true}
}
