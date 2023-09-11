interface ConfigProps {
  STACK_PREFIX: string
  REGION: string
  AWS_ACCOUNT_ID_PROD: string
  STORYBOOK_URL: string
  HOSTED_ZONE_ID: string
  HOSTED_ZONE_NAME: string
  CERTIFICATE_ARN: string
}

const CONFIG: ConfigProps = {
  STACK_PREFIX: 'DesignSystem',
  REGION: 'eu-west-2',
  AWS_ACCOUNT_ID_PROD: '635800996936',
  STORYBOOK_URL: 'storybook.memba.co.uk',
  HOSTED_ZONE_ID: 'Z08250957V80SGFDTWJA',
  HOSTED_ZONE_NAME: 'memba.co.uk',
  CERTIFICATE_ARN:
    'arn:aws:acm:us-east-1:635800996936:certificate/9f86b653-943b-4fb3-97d1-b4d13e6a4e25',
}

export default CONFIG
