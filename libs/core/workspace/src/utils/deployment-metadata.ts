import {generateProjectDomain} from './stage-props'

const accountNameToAccountIdDict = {
  development: '544312030237',
  production: '635800996936',
} as const

function getDeploymentMetadataForAccount(stageName: 'development' | 'production') {
  const accountId = accountNameToAccountIdDict[stageName]

  return {
    'oidc-role-to-assume': `arn:aws:iam::${accountId}:role/infra-service-deployment`,
    'oidc-role-session-name': `web-app-deploy-role`,
  } as const
}

export function getDeploymentMetadata() {
  return {
    development: {
      ...getDeploymentMetadataForAccount('development'),
    },
    production: {
      ...getDeploymentMetadataForAccount('production'),
    },
  }
}

export type StageDeploymentMetadata = ReturnType<
  typeof getDeploymentMetadata
>['development']

export function getProjectUrl(projectName: string) {
  const domainNames = generateProjectDomain(projectName)

  return {
    development: `https://${domainNames.development}`,
    production: `https://${domainNames.production}`,
  }
}
