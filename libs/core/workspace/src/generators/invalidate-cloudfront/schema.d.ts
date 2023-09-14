export interface InvalidateCloudfrontExecutorSchema {
  outputsFile: string
  exportName: string
  region: string
  profile?: string
  ssoCredentials?: boolean
}
