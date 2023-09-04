import {z} from 'zod'

const argvErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === 'too_small') {
    return {
      message:
        'Missing Arguments, Expected command to be called like: "./path/to/script.ts [project-name] [release-type]"',
    }
  }

  if (issue.code === 'too_big') {
    return {
      message: `Too many Arguments, expected ${issue.maximum} received ${ctx.data.length}. Expected command to be called like: "./path/to/script.ts [project-name] [release-type]"`,
    }
  }

  return {message: ctx.defaultError}
}

const argv = z
  .tuple(
    [
      z.string({description: 'Project Name'}),
      z.union(
        [
          z.literal('major'),
          z.literal('minor'),
          z.literal('patch'),
          z.literal('prerelease'),
        ],
        {description: 'Release Type'},
      ),
    ],
    {
      description: 'ARGV Array',
      errorMap: argvErrorMap,
    },
  )
  .transform(([projectName, releaseType]) => ({projectName, releaseType}))

export const parseArgv = () => argv.parse(process.argv.splice(2))
