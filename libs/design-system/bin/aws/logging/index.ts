import {Construct} from 'constructs'
import {CfnStage, IRestApi} from 'aws-cdk-lib/aws-apigateway'
import {LogGroup, RetentionDays} from 'aws-cdk-lib/aws-logs'
import {RemovalPolicy} from 'aws-cdk-lib'
import {ServicePrincipal} from 'aws-cdk-lib/aws-iam'
import CONFIG from '../../config'

interface EnableLoggingProps {
  scope: Construct
  id: string
  api: IRestApi
}

export const enableLogging = (props: EnableLoggingProps) => {
  const {scope, id, api} = props

  const logGroup = new LogGroup(scope, `${CONFIG.STACK_PREFIX}${id}LogGroup`, {
    logGroupName: `${CONFIG.STACK_PREFIX}ApiGateway${id}Logs`,
    removalPolicy: RemovalPolicy.DESTROY,
    retention: RetentionDays.ONE_MONTH,
  })

  const stage = api.deploymentStage.node.defaultChild as CfnStage

  stage.accessLogSetting = {
    destinationArn: logGroup.logGroupArn,
    format: JSON.stringify({
      requestId: '$context.requestId',
      ip: '$context.identity.sourceIp',
      caller: '$context.identity.caller',
      user: '$context.identity.user',
      requestTime: '$context.requestTimeEpoch',
      httpMethod: '$context.httpMethod',
      resourcePath: '$context.resourcePath',
      status: '$context.status',
      protocol: '$context.protocol',
      responseLength: '$context.responseLength',
    }),
  }

  logGroup.grantWrite(new ServicePrincipal('apigateway.amazonaws.com'))

  return logGroup
}
