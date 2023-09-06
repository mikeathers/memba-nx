export type StageName = 'development' | 'production'

const accountMap = {
  development: {
    certificateArn:
      'arn:aws:acm:us-east-1:544312030237:certificate/4221282e-56f6-4e91-96af-d2d553f1ddc4',
    hostedZoneId: 'Z08078312PXP7EBTCJL8F',
    hostedZoneName: 'dev.memba.co.uk',
    serverCachePolicyId: '59e8ca20-753d-4309-8ae2-f19cbc72f85f',
    imageCachePolicyId: '3992a123-07d4-4058-86ec-b1a97e9f8647',
    accountId: '544312030237',
  },
  production: {
    certificateArn:
      'arn:aws:acm:us-east-1:635800996936:certificate/9f86b653-943b-4fb3-97d1-b4d13e6a4e25',
    hostedZoneId: 'Z08250957V80SGFDTWJA',
    hostedZoneName: 'memba.co.uk',
    serverCachePolicyId: '944e6dc9-e7f3-49f4-b3bc-6f7f4a0e3841',
    imageCachePolicyId: '82155427-7087-484a-aab3-e2b6a1c409f7',
    accountId: '635800996936',
  },
} as const

export type StagePropsForAccount<AccountName extends 'development' | 'production'> =
  ReturnType<typeof getAccountDetailsForStage>[AccountName]

export function getAccountDetailsForStage(projectName: string) {
  const domainNames = generateProjectDomain(projectName)

  return {
    development: {
      ...accountMap['development'],
      domainName: domainNames.development,
    },
    production: {
      ...accountMap['production'],
      domainName: domainNames.production,
    },
  } as const
}

export function generateProjectDomain(projectName: string) {
  const urlPrefix = projectName.replace('-web', '').replace('-www', '')
  console.log('URL: ', `${urlPrefix}.${accountMap['development'].hostedZoneName}`)
  return {
    development: `${urlPrefix}.${accountMap['development'].hostedZoneName}`,
    production: `${urlPrefix}.${accountMap['production'].hostedZoneName}`,
  }
}
