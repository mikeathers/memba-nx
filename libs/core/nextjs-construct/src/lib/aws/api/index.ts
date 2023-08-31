import { Construct } from 'constructs'
import {
  EndpointType,
  LambdaIntegration,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway'
import { Function as CdkFunction } from 'aws-cdk-lib/aws-lambda'

interface CreateApiGatewayProps {
  scope: Construct
  id: string
}

export const createApiGateway = (props: CreateApiGatewayProps) => {
  const { scope, id } = props
  return new RestApi(scope, `${id}-Api`, {
    binaryMediaTypes: ['*/*'],
    endpointTypes: [EndpointType.REGIONAL],
  })
}

type ImageApiGatewayProps = {
  scope: Construct
  cdkFunction: CdkFunction
  desiredPath: string
  region: string
  urlSuffix: string
  stackPrefix: string
}

export const createImageApiGateway = (props: ImageApiGatewayProps) => {
  const { scope, region, urlSuffix, desiredPath, cdkFunction, stackPrefix } =
    props
  const apiGateway = createApiGateway({
    scope,
    id: `${stackPrefix}ImageOptimisation`,
  })
  // const logGroup = enableLogging({scope, id: `ImageOptimisation`, api: apiGateway})
  const url = `${apiGateway.restApiId}.execute-api.${region}.${urlSuffix}`

  const functionIntegration = new LambdaIntegration(cdkFunction)

  const defaultEndpoint = apiGateway.root.resourceForPath(desiredPath)
  const greedyEndpoint = defaultEndpoint.addResource('{route+}')

  defaultEndpoint.addMethod('ANY', functionIntegration)
  greedyEndpoint.addMethod('ANY', functionIntegration)

  return {
    apiGateway,
    // logGroup,
    domain: url,
    path: `/prod${defaultEndpoint.path}`,
  }
}

type ServerApiProps = {
  scope: Construct
  cdkFunction: CdkFunction
  desiredPath: string
  region: string
  urlSuffix: string
  stackPrefix: string
}

export const createServerApiGateway = (props: ServerApiProps) => {
  const { scope, urlSuffix, desiredPath, cdkFunction, region, stackPrefix } =
    props
  const api = createApiGateway({ scope, id: `${stackPrefix}Server` })
  // const logGroup = enableLogging({scope, id: `Server`, api})
  const url = `${api.restApiId}.execute-api.${region}.${urlSuffix}`

  const serverFunctionIntegration = new LambdaIntegration(cdkFunction)

  const serverFunctionEndpoint = api.root.resourceForPath(desiredPath)
  const serverGreedyRoute = serverFunctionEndpoint.addResource('{route+}')

  serverFunctionEndpoint.addMethod('ANY', serverFunctionIntegration)
  serverGreedyRoute.addMethod('ANY', serverFunctionIntegration)

  return {
    domain: url,
    path: `/prod${serverFunctionEndpoint.path}`,
    // logGroup,
  }
}

// const apiLogRole = new Role(this, "CloudWatchRole", {
//   assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
//   managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonAPIGatewayPushToCloudWatchLogs")],
//   permissionsBoundary: ManagedPolicy.fromManagedPolicyArn(
//     this,
//     "app-boundary",
//     `arn:aws:iam::${Stack.of(this).account}:policy/app-boundary`,
//   ),
//   roleName: "app-role",
// });
