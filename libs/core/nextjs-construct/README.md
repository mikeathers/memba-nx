# core-nextjs-construct

To use this Construct, you need a CDK Application. You can now use a custom nx generator to create a new CDK Application. See details here - [Migrating from sls next to open next](./docs/migrating-from-slsnext-to-opennext.md)

Example usage
```typescript
// cdk/app.ts
import { App } from 'aws-cdk-lib';
import { NextJsConstruct, readConfig } from '@cinch-nx/core-nextjs-construct'

const app = new App();

const stageConfig = readConfig(app);

new NextJsConstruct(app, 'SomeNextJSCdkApp', {
    buildPath: path.join(__dirName,'../../../dist/path/to/app'),
    basePath: "/nextjs-config-basepath"
    ...stageConfig
})
```
Optionally, you can create dynamic stack names that use your git username (Emphemeral deployments locally) or branch name (CI Deployments).
```typescript
// cdk/app.ts

import {
  NextJsConstruct,
  generateStackName,
} from '@cinch-nx/core-nextjs-construct'

const app = new cdk.App()
const stackName = generateStackName('SomeNextJSCdkApp')

new NextJsConstruct(app, stackName, {
    // Add your params
})

```

```json
// cdk.json 
{
    "stackProps": {
        "ephemeral": {
            "certificateArn": "some.arn",
            "domainName": "a.domain.name",
            "webAclArn": "another:arn:here",
            "hostedZoneId": "hostedZoneId",
            "hostedZoneName": "hostZoneName",
            "serviceName": "MyReallyCoolApp",
        },
        "development": {
            // see above
        },
        "production": {
            // see above
        },
        
    }
}
```

and build like `nx cdk-build app-name --stageName=ephemeral`
