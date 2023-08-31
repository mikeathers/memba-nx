import { z } from 'zod'
import { Construct, IConstruct } from 'constructs'
import { execSync } from 'child_process'

export function generateStackName(app: Construct, base: string) {
  return base
}

/**
 *
 * @param app the CDK App Construct
 */
export function readConfig(app: Construct): Config {
  try {
    const stageName = readStageName(app)
    const stageProps = readStageProps(app)
    const configForStage = stageProps[stageName]

    if (configForStage === undefined) {
      throw new Error(
        'Error while Reading Config, Error: Configuration for stageName "production" does not exist, has it been added to the cdk.json?',
      )
    }

    return configSchema.parse({
      ...configForStage,
      version: readCommitSha(),
      environment: stageName,
      serviceName: app.node.tryGetContext('serviceName'),
    })
  } catch (error: unknown) {
    let message
    if (error instanceof z.ZodError) {
      message = formatZodIssues(error)
    } else if (error instanceof Error) {
      message = error.message
    } else {
      message = 'Unknown Error!' + error
    }

    throw new Error(message)
  }
}

const stageNameSchema = z.union(
  [z.literal('development'), z.literal('production')],
  {
    errorMap(_, context) {
      return {
        message: `Expected one of "development" | "production" but received: '${context.data}'`,
      }
    },
  },
)

const kebabStringSchema = (
  label: string,
  rawStringParams?: { required_error?: string },
) =>
  z
    .string({ required_error: rawStringParams?.required_error })
    .regex(/^([a-z](?!\d)|\d(?![a-z]))+(-?([a-z](?!\d)|\d(?![a-z])))*$|^$/, {
      message: `"${label}" should be kebab-case`,
    })

const generalConfigSchema = z.object({
  version: z.string(),
  environment: stageNameSchema,
  serviceName: kebabStringSchema('serviceName'),
})

/**
 * the shape of  the props stored in the apps cdk.json
 */
const stageConfigSchema = z.object(
  {
    stackPrefix: z.string({
      required_error: 'Stack prefix has not been provided for this stage',
    }),
    stage: z.string({
      required_error: 'Stage has not been provided for this stage',
    }),
    url: z.string({
      required_error: 'Url has not been provided for this stage',
    }),
    hostedZoneUrl: z.string({
      required_error: 'Hosted zone url has not been provided for this stage',
    }),
    hostedZoneId: z.string({
      required_error: 'The Hosted Zone Id has not been provided for this stage',
    }),
    hostedZoneName: z.string({
      required_error:
        'The Hosted Zone Name has not been provided for this stage',
    }),
    region: z.string({
      required_error: 'Region has not been provided for this stage',
    }),

    // domainName: z.string({
    //   required_error: 'Domain name has not been provided for this stage',
    // }),
    // certificateArn: z.string({
    //   required_error:
    //     'The Certificate ARN has not been provided for this stage',
    // }),
    // hostedZoneId: z.string({
    //   required_error: 'The Hosted Zone Id has not been provided for this stage',
    // }),
    // hostedZoneName: z.string({
    //   required_error:
    //     'The Hosted Zone Name has not been provided for this stage',
    // }),
    // datadogApiKeySecretArn: z.string({
    //   required_error:
    //     'The Datadog API Key Secret has not been provided for this stage',
    // }),
    // webAclArn: z.string({
    //   required_error: 'The Web ACL ARN has not been provided for this stage',
    // }),
    // serverCachePolicyId: z.string({
    //   required_error:
    //     'The serverCachePolicyId has not been provided for this stage',
    // }),
    // imageCachePolicyId: z.string({
    //   required_error:
    //     'The serverCachePolicyId has not been provided for this stage',
    // }),
  },
  {
    description: 'the configuration of a stage',
    invalid_type_error: 'the stage config does not match the schema',
    required_error: 'we are missing the stage config for selected stage',
  },
)

export type StageConfig = z.infer<typeof stageConfigSchema>

const stagePropsSchema = z.object({
  development: stageConfigSchema,
  production: stageConfigSchema,
})

export type StageProps = z.infer<typeof stagePropsSchema>

const configSchema = generalConfigSchema.and(stageConfigSchema)

export type Config = z.infer<typeof configSchema>

function readCommitSha() {
  return execSync('git rev-parse --short HEAD', {
    encoding: 'utf8',
  }).trim()
}

function readGitUser() {
  return execSync('git config user.name', { encoding: 'utf8' })
    .trim()
    .replace(' ', '-')
    .toLocaleLowerCase()
}

function readBranchName() {
  return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' })
    .trim()
    .replace('/', '-')
    .toLocaleLowerCase()
}

function readStageName(app: IConstruct) {
  const parseResults = stageNameSchema.safeParse(
    app.node.tryGetContext('stageName'),
  )

  if (parseResults.success) {
    return parseResults.data
  } else {
    throw new TypeError(formatZodIssues(parseResults.error))
  }
}

function readStageProps(app: Construct) {
  const parseResults = stagePropsSchema.safeParse(
    app.node.tryGetContext('stageProps'),
  )

  if (parseResults.success) {
    return parseResults.data
  } else {
    throw new TypeError(formatZodIssues(parseResults.error))
  }
}

function formatZodIssues(error: z.ZodError) {
  const prefix = (issue: z.ZodIssue) =>
    issue.path && issue.path.length > 0 ? `[${issue.path}] ` : ''

  if (error.issues.length === 1) {
    const issue = error.issues[0]
    return `Error: ${prefix(issue)}${issue.message}`
  } else {
    let message = 'Multiple Errors:'

    error.issues.forEach(
      (issue) => (message += `\n -  ${prefix(issue)}${issue.message}.`),
    )

    return message
  }
}
