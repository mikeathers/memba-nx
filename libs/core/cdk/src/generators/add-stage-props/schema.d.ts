import { StageName } from '../../utils/stage-props'

export interface StageProps {
  /** stored in cdk.json#context.stackProps */
  stage: string
  stageName: string
  url: string
  hostedZoneUrl: string
  hostedZoneId: string
  hostedZoneName: string
  stackPrefix: string
  region: string
}

export interface AddStagePropsGeneratorSchema extends StageProps {
  /** identify the project */
  projectName: string
  /** used to define the stage */
  stageName: StageName
}
