import {
  SquadName,
  tribeMap,
  squadMap,
  generateProjectDomain,
} from './stage-props'

const accountNameToAccountIdDict = {
  'Workload-SNC-Eph': '374122556424',
  'Workload-SNC-Dev': '632364969579',
  'Workload-SNC-Prod': '542324569862',
  'Workload-SNP-Eph': '511560072567',
  'Workload-SNP-Dev': '972301299190',
  'Workload-SNP-Prod': '718453389550',
  'Workload-ONR-Eph': '315037948697',
  'Workload-ONR-Dev': '615258155346',
  'Workload-ONR-Prod': '572171994716',
  'Workload-Vela-Eph': '486467686305',
  'Workload-Vela-Dev': '597019955801',
  'Workload-Vela-Prod': '674138859249',
} as const

function getDeploymentMetadataForAccount(
  squad: SquadName,
  stageName: 'ephemeral' | 'development' | 'production',
) {
  const tribe = squadMap[squad]
  const accounts = tribeMap[tribe]
  const accountName = accounts[stageName]
  const accountId = accountNameToAccountIdDict[accountName]

  return {
    'oidc-role-to-assume': `arn:aws:iam::${accountId}:role/infrastructure/service-deployment-${squad}`,
    'oidc-role-session-name': `${squad}_deploy_role`,
  } as const
}

export function getDeploymentMetadata(squad: SquadName, projectName: string) {
  const tribe = squadMap[squad]
  const projectUrls = getProjectUrl(squad, projectName)

  return {
    tribe,
    ephemeral: {
      ...getDeploymentMetadataForAccount(squad, 'ephemeral'),
      'project-url': projectUrls.ephemeral,
    },
    development: {
      ...getDeploymentMetadataForAccount(squad, 'development'),
      'project-url': projectUrls.development,
    },
    production: {
      ...getDeploymentMetadataForAccount(squad, 'production'),
      'project-url': projectUrls.development,
    },
  }
}

export type StageDeploymentMetadata = ReturnType<
  typeof getDeploymentMetadata
>['ephemeral']

export function getProjectUrl(squad: SquadName, projectName: string) {
  const domainNames = generateProjectDomain(squad, projectName)

  return {
    ephemeral: `https://${domainNames.ephemeral}`,
    development: `https://${domainNames.development}`,
    production: `https://${domainNames.production}`,
  }
}
