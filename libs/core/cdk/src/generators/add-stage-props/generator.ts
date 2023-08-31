import {
  formatFiles,
  readProjectConfiguration,
  Tree,
  readJson,
  writeJson,
} from '@nrwl/devkit'
import { AddStagePropsGeneratorSchema, StageProps } from './schema'

interface NormalizedSchema extends AddStagePropsGeneratorSchema {
  projectRoot: string
}

function normalizeOptions(
  tree: Tree,
  options: AddStagePropsGeneratorSchema,
): NormalizedSchema {
  const { root } = readProjectConfiguration(tree, options.projectName)

  return {
    ...options,
    projectRoot: root,
  }
}

interface CDKJson {
  app: string
  output: string
  requireApproval: boolean
  watch: unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: Record<string, any>
}

export default async function (
  tree: Tree,
  options: AddStagePropsGeneratorSchema,
) {
  const normalizedOptions = normalizeOptions(tree, options)

  const stageConfig: StageProps = {
    stage: normalizedOptions.stage,
    stageName: normalizedOptions.stageName,
    url: normalizedOptions.url,
    hostedZoneUrl: normalizedOptions.hostedZoneUrl,
    stackPrefix: normalizedOptions.stackPrefix,
    region: normalizedOptions.region,
    hostedZoneId: normalizedOptions.hostedZoneId,
    hostedZoneName: normalizedOptions.hostedZoneName,
  }

  await updateCDKJson(tree, normalizedOptions, stageConfig)

  await formatFiles(tree)
}

async function updateCDKJson(
  tree: Tree,
  options: NormalizedSchema,
  stageConfig: StageProps,
) {
  const cdkJsonLocation = `${options.projectRoot}/cdk.json`
  const cdkJson = readJson<CDKJson>(tree, cdkJsonLocation)

  if (cdkJson.context.stageProps !== undefined) {
    cdkJson.context.stageProps[options.stageName] = stageConfig
  } else {
    cdkJson.context['stageProps'] = {
      [options.stageName]: stageConfig,
    }
  }

  writeJson(tree, cdkJsonLocation, cdkJson)
}
