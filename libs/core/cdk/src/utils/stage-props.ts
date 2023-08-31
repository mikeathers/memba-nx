export type StageName = 'development' | 'production'

const accountMap = {
  Development: {
    stackPrefix: 'TestIdApp',
    stage: 'dev',
    url: '',
    hostedZoneUrl: 'dev.memba.co.uk',
    hostedZoneId: 'Z08078312PXP7EBTCJL8F',
    hostedZoneName: 'dev.memba.co.uk',
    region: 'eu-west-2',
  },
  Production: {
    stackPrefix: 'TestIdApp',
    stage: 'prod',
    url: '',
    hostedZoneUrl: 'memba.co.uk',
    hostedZoneId: 'Z08250957V80SGFDTWJA',
    hostedZoneName: 'memba.co.uk',
    region: 'eu-west-2',
  },
  // #endregion
} as const

export type StagePropsForAccount<
  AccountName extends 'development' | 'production',
> = ReturnType<typeof getAccountDetailsForSquad>[AccountName]

export function getAccountDetailsForSquad(projectName: string) {
  const domainNames = generateProjectDomain(projectName)

  return {
    development: {
      ...accountMap['Development'],
      url: domainNames.development,
    },
    production: {
      ...accountMap['Production'],
      url: domainNames.production,
    },
  } as const
}

export type AccountDetails = ReturnType<typeof getAccountDetailsForSquad>

export function generateProjectDomain(projectName: string) {
  const parsedProjName = projectName.replace('-web', '').replace('-www', '')
  return {
    development: `${parsedProjName}.${accountMap['Development'].hostedZoneUrl}`,
    production: `${parsedProjName}.${accountMap['Production'].hostedZoneUrl}`,
  }
}
