# CDK App Generator for OpenNext Projects

## 1. Introduction

The CDK app generator is a custom plugin designed to create an AWS Cloud Development Kit (CDK) app compatible with an OpenNext application. It automates creating and configuring a CDK app, making it easier to deploy Next.js applications on AWS.

## 2. Pre-requisites

Before you start, please ensure you have read and understood the [main migration guide](/docs/migrating-from-slsnext-to-opennext.md), which mentions the use of the `convert-to-opennext` generator and the following are installed and configured in your development environment:

- Nx workspace set up,
- OpenNext app is already created and configured,
- Node.js and npm installed,
- AWS CLI installed and configured,
- AWS CDK is installed and configured globally.

## 3. Generator Function

The `core-cdk:opennext-app` generator is an asynchronous function that performs nine primary tasks to create an OpenNext-compatible CDK app:

1. Normalising Options
2. Generating a CDK App
3. Generating a CDK Stack File
4. Deleting the lib and test Folders
5. Creating Non-Stage Properties
6. Adding Stage Properties
7. Adding Output Metadata Target
8. Replacing Deploy Target
9. Format Files

And it is executed with the following signature:

```
async  function ( tree: Tree, options: OpennextAppGeneratorSchema)
```

Here, the `tree` is an abstract representation of the file system, and `options` is an object containing the schema options.

Upon the initial run of the function, three questions will be prompted in regards to the desired application conversion:

```
✔ What name would you like to use? · unsubscribe-opennext-cdk
✔ What is the project name of associated nextjs app? (e.g landing-www) · customer-interactions-unsubscribe
✔ What is the name of your squad? (use kebab-case) · customer-interactions
```

The answers provided will then be used as schema options for the main function.

Let's explore each function in detail:

### 3.1. Normalising Options

The `normalizeOptions` function is an asynchronous utility function used within the generator. This function processes and normalises input options and returns an object with information that is needed for the generation of the CDK app, including project names, directories, paths, tags, and more.

The `normalizeOptions` function is essential for the OpenNext-compatible CDK app generator, as it processes and prepares all the necessary data for the generation process. It ensures consistency and standardisation in naming conventions and paths throughout the generator.

### 3.2. Generating a CDK App

The `cdkAppGenerator` function is an asynchronous generator function that sets up a new CDK application within an Nx workspace. It is responsible for normalising options, generating files, adding project configuration, configuring testing with Jest, and formatting files.

When this function works, it prompts three questions regarding your project, and then it makes the following changes in the file directory:

```
CREATE apps/customer-interactions/unsubscribe-opennext-cdk/project.json
UPDATE workspace.json
CREATE apps/customer-interactions/unsubscribe-opennext-cdk/bin/unsubscribe-opennext-cdk.ts
CREATE apps/customer-interactions/unsubscribe-opennext-cdk/cdk.json
CREATE apps/customer-interactions/unsubscribe-opennext-cdk/lib/unsubscribe-opennext-cdk-stack.ts
CREATE apps/customer-interactions/unsubscribe-opennext-cdk/test/unsubscribe-opennext-cdk.test.ts
CREATE apps/customer-interactions/unsubscribe-opennext-cdk/tsconfig.json
CREATE apps/customer-interactions/unsubscribe-opennext-cdk/jest.config.ts
CREATE apps/customer-interactions/unsubscribe-opennext-cdk/tsconfig.spec.json
```

However, this itself isn't enough for an OpenNext deployment, so the generator calls additional functions to make it OpenNext compatible.

### 3.3. Generating a CDK Stack File

The `generateCdkStackFile` function is used to generate the necessary files for a CDK (Cloud Development Kit) stack in an Nx workspace. This function utilises the `generateFiles` method from the Nx Devkit to populate templates and create the CDK stack files in the specified directory.

When this function works,

- it will create three `.env` files for the `ephemeral`, `development` and `production` stages, and
- make the following changes on the `unsubscribe-opennext-cdk.ts` file generated in the `cdkAppGenerator` function in the previous step:

:point_down: The initial file, when generated in `cdkAppGenerator()`.

```typescript
unsubscribe-opennext-cdk.ts

#!/usr/bin/env node
import  'source-map-support/register'
import  *  as cdk from  'aws-cdk-lib'
import  { UnsubscribeOpennextCdkStack }  from  '../lib/unsubscribe-opennext-cdk-stack.ts'

const app =  new cdk.App()
new  UnsubscribeOpennextCdkStack(app,  {
  ...
})
```

:point_down: The updated file after `generateCdkStackFile()`

```typescript
unsubscribe-opennext-cdk.ts

#!/usr/bin/env node
import  'source-map-support/register'
import  *  as cdk from  'aws-cdk-lib'
import  { NextJsConstruct, readConfig, generateStackName }  from  '@cinch-nx/core-nextjs-construct'

const  app  =  new cdk.App()
const  stackName  =  generateStackName(app,  'ArticlesOpennextCdkStack')

new  NextJsConstruct(app,  stackName,  {
	buildPath:  '../../../dist/apps/landing/articles',
	...readConfig(app),
})
```

### 3.4. Cleaning Up

The `deleteLibFolder` function is used for deleting the `lib` and `test` directories from the project root specified in the given schema.

```
DELETE apps/customer-interactions/unsubscribe-opennext-cdk/lib
DELETE apps/customer-interactions/unsubscribe-opennext-cdk/test
```

The function utilises a file tree representation provided by the `Tree` object to execute the deletions. If the directories don’t exist, calling this function will not throw an error, as this function does not perform any error handling. If the `tree` object cannot delete the directories due to file system permissions or any other reason, this function will not handle those errors.

### 3.5. Creating Non-Stage Properties

The `createNonStageProps` function is used for updating the `cdk.json` file within the project by setting the `tribe` and `squad` properties within the context object:

```
cdk.json
{
  ...
  "context":  {
    "tribe":  "explore-and-decide",
    "squad":  "customer-interactions",
    "serviceName": "customer-interactions-unsubscribe",
	...
  }
}
```

The function takes in a file tree representation (`Tree`), the project root directory (`projectRoot`), and an object with `tribe` and `squad` properties (`NonStageProps`). If the `tree` object is not able to read or write the file due to file system permissions or any other reason, this function will not handle those errors. Moreover, if the `cdk.json` file is not present or is in an invalid format, the function behaviour is undefined.

### 3.6. Adding Stage Properties

`addStageProps` is an asynchronous operation that adds stage properties to a Cloud Development Kit (CDK) project. It modifies the `cdk.json` file in the project root directory and updates its `context` property with the provided stage configuration:

```
cdk.json
{
  ...
  "context": {
    ...
    "stageProps": {
      "ephemeral": {
        "domainName": "customer-interactions-unsubscribe.snc-eph.aws.cinch.co.uk",
        "certificateArn": "arn:aws:acm:us-east-1:374122556424:certificate/3f0c45f6-5f92-44bc-a5a0-87e3493bd1b2",
        "hostedZoneId": "Z01313322TQYHCA57ZBYB",
        "hostedZoneName": "snc-eph.aws.cinch.co.uk",
        "webAclArn": "arn:aws:wafv2:us-east-1:374122556424:global/webacl/FMManagedWebACLV2-global-shared-web-acl-1656500751185/2831144b-15c7-4f6b-bc33-e99b1d366429",
      },
      "development": {
        "domainName": "customer-interactions-unsubscribe-opennext.snc-dev.aws.cinch.co.uk",
        "certificateArn": "arn:aws:acm:us-east-1:632364969579:certificate/29ba943b-0704-4a07-9a60-d0c24db2aa7e",
        "hostedZoneId": "Z00964852Q5CO4U3SC7GY",
        "hostedZoneName": "snc-dev.aws.cinch.co.uk",
        "webAclArn": "arn:aws:wafv2:us-east-1:632364969579:global/webacl/FMManagedWebACLV2-global-shared-web-acl-1650449573713/b006df17-daf2-4121-b563-50a0d5eeb606",
      },
      "production": {
        "domainName": "customer-interactions-unsubscribe-opennext.snc-prod.aws.cinch.co.uk",
        "certificateArn": "arn:aws:acm:us-east-1:542324569862:certificate/9c88fc72-c6c5-4d6e-8403-b4bd827c2522",
        "hostedZoneId": "Z0661420159D5O9B2JAWL",
        "hostedZoneName": "snc-prod.aws.cinch.co.uk",
        "webAclArn": "arn:aws:wafv2:us-east-1:542324569862:global/webacl/FMManagedWebACLV2-global-shared-web-acl-1650533012913/c378711e-caec-4677-b010-7bc44578f4db",
      }
    }
  }
}
```

### 3.7. Adding Output Metadata Target

The `addOutputMetadataTarget` asynchronous function updates the configuration of a project within an Nx workspace to include output metadata targets. It normalises the provided options, generates metadata configurations, and updates the project's configuration.

```
project.json
{
  ...
  "targets": {
    ...
    "output-metadata": {
      "executor": "@cinch-nx/core-cdk:output-metadata",
      "options": {
        "sharedOutputs": {
          "squad": "customer-interactions",
          "tribe": "explore-and-decide",
          "oidc-aws-region": "eu-west-1"
        }
      },
      "configurations": {
        "ephemeral": {
          "outputs": {
            "oidc-role-to-assume": "arn:aws:iam::374122556424:role/infrastructure/service-deployment-customer-interactions",
            "oidc-role-session-name": "customer-interactions_deploy_role",
            "project-url": "https://customer-interactions-unsubscribe-opennext-cdk.snc-eph.aws.cinch.co.uk"
          }
        },
        "development": {
          "outputs": {
            "oidc-role-to-assume": "arn:aws:iam::632364969579:role/infrastructure/service-deployment-customer-interactions",
            "oidc-role-session-name": "customer-interactions_deploy_role",
            "project-url": "https://customer-interactions-unsubscribe-opennext-cdk.snc-dev.aws.cinch.co.uk"
          }
        },
        "production": {
          "outputs": {
            "oidc-role-to-assume": "arn:aws:iam::542324569862:role/infrastructure/service-deployment-customer-interactions",
            "oidc-role-session-name": "customer-interactions_deploy_role",
            "project-url": "https://customer-interactions-unsubscribe-opennext-cdk.snc-dev.aws.cinch.co.uk"
          }
        }
      }
    }
  },
  ...
}
```

### 3.8. Replacing Deploy Target

The `replaceDeployTarget` function is an asynchronous function that replaces the `deploy` target of a given project within an Nx workspace. It updates the executor to `nx:run-commands` and configures a set of deployment-related commands that are executed in a sequence. The function also retains the original `deploy` target under a new key, `cdk-deploy`.

Finally, it makes the following changes in the `project.json` file:

```diff
project.json
{
  "deploy": {
-   "executor":  "@cinch-nx/core-cdk:cdk",
+   "executor":  "nx:run-commands",
    "options": {
-     "command": "deploy",
-     "output": "dist/apps/customer-interactions/unsubscribe-opennext-cdk/cdk.out"
+     "commands": [
+       "nx opennext-build customer-interactions-unsubscribe --configuration {args.frontEndConfiguration}",
+.      "nx cdk-deploy customer-interactions-unsubscribe-opennext-cdk --configuration={args.configuration} --profile {args.profile}"
+     ],
+     "frontEndConfiguration": "production",
+     "parallel": false
    },
-   "outputs": [
-     "{options.outputPath}"
-   ],
-   "defaultConfiguration": "production",
    "configurations": {
      "ephemeral": {
-       "context": {
-         "stageName": "ephemeral"
-       }
+.      "configuration": "ephemeral",
+       "envFile": "apps/customer-interactions/unsubscribe-opennext-cdk/.env.ephemeral",
+       "frontEndConfiguration": "development"
      },
      "development": {
-       "context": {
-         "stageName": "development"
-       }
+       "configuration": "development",
+       "envFile": "apps/customer-interactions/unsubscribe-opennext-cdk/.env.development"
      },
      "production": {
-       "context": {
-         "stageName": "production"
-       }
+.      "configuration": "production",
+       "envFile": "apps/customer-interactions/unsubscribe-opennext-cdk/.env.production"
      }
    },
+   "cdk-deploy": {
+     "executor": "@cinch-nx/core-cdk:cdk",
+     "options": {
+       "command": "deploy",
+       "output": "dist/apps/customer-interactions/unsubscribe-opennext-cdk/cdk.out"
+     },
+     "outputs": [
+       "{options.outputPath}"
+     ],
+     "defaultConfiguration": "production",
+     "configurations": {
+       "ephemeral": {
+         "context": {
+           "stageName": "ephemeral"
+        }
+       },
+       "development": {
+         "context": {
+           "stageName": "development"
+         }
+       },
+       "production": {
+         "context": {
+           "stageName": "production"
+         }
+       }
+     }
+   }
  }
}
```

### 3.9. Format Files

Finally, the `formatFiles` function is used to format the newly generated or updated files using Prettier.

## 4. Conclusion

This OpenNext-compatible CDK app generator is a powerful tool to facilitate the deployment of Next.js applications on AWS through a streamlined and automated process. Ensure that all prerequisites are installed and configured before using the generator in your Nx workspace.
