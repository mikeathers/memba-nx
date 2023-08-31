export interface Schema {
  command: string
  app?: string
  context?: Record<string, string>
  stacks?: string
  profile?: string
  trace?: boolean
  strict?: boolean
  json?: boolean
  force?: boolean
  debug?: boolean
  noColour?: boolean
  outputPath?: string
  outputsFile?: string
  all?: boolean
  arbitrary?: string
}
