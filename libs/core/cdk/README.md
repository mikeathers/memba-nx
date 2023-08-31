# core-cdk

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build core-cdk` to build the library.

## Running unit tests

Run `nx test core-cdk` to execute the unit tests via [Jest](https://jestjs.io).

## Generators

### Generating CDK Applications

a basic CDKv2 application can be generated using the following command:

```bash
$ nx g @memba-nx/core/cdk:app [app-name]
```

this is an empty cdk, just like you would get if you generated an app with `cdk init`

### Generating an OpenNext Deployment CDK app.

this is likely what you are looking for, to deploy your nextjs application to AWS via OpenNext.
you can generate all of your instrastructure using the following command:

```bash
$ nx g @memba-labs/core-cdk:opennext-app my-super-cool-app-cdk \
    --frontEndProject my-super-cool-app \
    # All stageProps can be passed via the cli, or will be prompted for!
    --localProps.domainName some-app-name.snc-eph.aws.cinch.co.uk \
    --localProps.certificateArn some::arn::from::aws \
    --localProps.hostedZoneId iamanid \
    --localProps.hostedZoneName anidami \
    --localProps.datadogApiKeySecretArn SUPER::SECRET::ARN \
    --localProps.serviceName supercool-service \
    --localProps.webAclArn ANOTHER::ARN::FROM::AWS
    # you will be prompted for developmentPropss or productionProps later or
    # if you decide to skip them for now, you can add them later using the `add-stage-props` generator
```

### `add-stage-props` - adding stage props for your cdk app

if you skipped on adding props for a given stage when generating the app, you can always add them later (or even overwrite existing props) using this generator

```bash
$ nx g @cinch-labs/core-cdk:add-stage-props [app-name] \
    --stageName=[stage-name] \
    --domainName=[domain-name] \
    --certficiateArn=[certificateArn] \
    --hostedZoneId=[hostedZoneId] \
    --hostedZoneName=[hostedZoneName] \
    --datadogApiKeySecretArn=[datadogApiKeySecretArn] \
    --serviceName=[serviceName] \
    --webAclArn=[webAclARN]

```

where `[stage-name]` is one-of `local`, `development` or `production`, the rest of the config can be retrived via AWS, in the relevant sections.

for example, you get the certificate ARN from "AWS Certificate Manager (ACM)",
the HostedZone details can be retrived from "Route 53 -> Hosted Zones"
Web ACL Arn can be retrieved in "WAF & Shield -> Web ACLs"
and the datadog secret arn can be retrived via "Secrets Manager => DdApiKeySecret-{bunch of strings}"
