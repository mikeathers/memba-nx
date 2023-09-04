import valid from 'semver/functions/valid'
import {z} from 'zod'

const semver = z.string().refine(
  (input) => valid(input) !== null,
  (input) => ({message: `"${input}" is not a valid semver version`}),
)
const packageList = z.record(z.string(), z.string()).optional()

export const packageJsonParser = z.object({
  name: z.string(),
  version: semver,
  license: z.string().optional(),
  private: z.boolean().optional(),
  scripts: z.record(z.string(), z.string()).optional(),
  dependencies: packageList,
  devDependencies: packageList,
  resolutions: packageList,
  volta: z
    .object({
      node: semver,
      yarn: semver,
    })
    .optional(),
  engines: z
    .object({
      node: semver,
      yarn: semver,
    })
    .optional(),
  publishConfig: z.object({
    registry: z.string(),
  }),
  repository: z.string(),
})

export type PackageJson = z.infer<typeof packageJsonParser>
