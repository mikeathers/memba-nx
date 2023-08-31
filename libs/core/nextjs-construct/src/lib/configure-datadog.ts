// import { Tags } from 'aws-cdk-lib'
// import { IFunction } from 'aws-cdk-lib/aws-lambda'
// import { ILogGroup } from 'aws-cdk-lib/aws-logs'
// import { Secret } from 'aws-cdk-lib/aws-secretsmanager'
// import { Construct } from 'constructs'
// import { Datadog } from 'datadog-cdk-constructs-v2'
//
// type DatadogIntegrationProps = {
//   apiKeySecretArn: string
//   serviceName: string
//   environment: string
//   version: string
//   tribe: string
//   squad: string
//   lambdaFunctions?: IFunction[]
//   nonLambdaLogGroups?: ILogGroup[]
// }
//
// export function createDatadogIntegration(
//   scope: Construct,
//   props: DatadogIntegrationProps,
// ) {
//   const DD_SERVICE = props.serviceName
//   const DD_ENV = props.environment
//   const DD_VERSION = props.version
//
//   Tags.of(scope).add('DD_SERVICE', DD_SERVICE)
//   Tags.of(scope).add('DD_ENV', DD_ENV)
//   Tags.of(scope).add('DD_VERSION', DD_VERSION)
//   Tags.of(scope).add('squad', props.squad)
//   Tags.of(scope).add('tribe', props.tribe)
//
//   const datadog = new Datadog(scope, `Datadog`, {
//     addLayers: true,
//     site: 'datadoghq.eu',
//     service: DD_SERVICE,
//     env: DD_ENV,
//     version: DD_VERSION,
//     // https://github.com/DataDog/datadog-lambda-js/releases
//     nodeLayerVersion: 91,
//     // https://github.com/DataDog/datadog-lambda-extension/releases
//     extensionLayerVersion: 44,
//     apiKeySecret: Secret.fromSecretCompleteArn(
//       scope,
//       'Datadog-Api-Key-Secret',
//       props.apiKeySecretArn,
//     ),
//   })
//
//   if (props.lambdaFunctions) {
//     datadog.addLambdaFunctions(props.lambdaFunctions)
//     datadog.addGitCommitMetadata(props.lambdaFunctions, props.version)
//   }
//
//   if (props.nonLambdaLogGroups) {
//     datadog.addForwarderToNonLambdaLogGroups(props.nonLambdaLogGroups)
//   }
//
//   return datadog
// }
export {}
