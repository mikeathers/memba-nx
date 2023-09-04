import type {OutputMetadataExecutorSchema} from './schema'

import {setOutput} from '@actions/core'

export default async function runExecutor(options: OutputMetadataExecutorSchema) {
  const {outputs} = normalizeOutputs(options)

  Object.entries(outputs).forEach(([name, value]) => setOutput(name, value))

  return {success: true}
}

interface NormalisedOutputs {
  outputs: Record<string, string>
}

function normalizeOutputs({
  outputs,
  sharedOutputs,
}: OutputMetadataExecutorSchema): NormalisedOutputs {
  return {outputs: {...sharedOutputs, ...outputs}}
}
