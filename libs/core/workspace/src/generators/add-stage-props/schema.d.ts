import {StageName} from '../../utils/stage-props'

export interface StageProps {
  /** stored in cdk.json#context.stackProps */
  domainName: string
  certificateArn: string
  hostedZoneId: string
  hostedZoneName: string
  serverCachePolicyId?: string
  imageCachePolicyId?: string
  accountId: string
}

export interface AddStagePropsGeneratorSchema extends StageProps {
  /** identify the project */
  projectName: string
  /** used to define the stage */
  stageName: StageName
}
