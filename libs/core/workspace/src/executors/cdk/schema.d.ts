export interface CdkSynthExecutorSchema {
  command: 'synth' | 'deploy' | 'destroy' | 'diff'
  profile?: string
  output: string
  args?: Record<string, string | boolean>
  context?: Record<string, string>
}
