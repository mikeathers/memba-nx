# ..-tools-plugins-workspace

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build ..-tools-plugins-workspace` to build the library.

## Running unit tests

Run `nx test ..-tools-plugins-workspace` to execute the unit tests via [Jest](https://jestjs.io).

## Public Generators

### Generate a NextJS Application

Generates a NextJS application ready to be deployed using open-next.

`nx g @cinch-nx/workspace:next-app <name> --squad=<squad> --skip-cdk=<skip-cdk>`

#### options

| key | Possible Values | Description |
| === | =============== | =========== |
| `name` | `string` | name of the project |
| `squad` | `enum` | name of your squad in kebab-case. if unsure, it will prompt you. |
| `skip-cdk` | `boolean` | whether or not to skip the generation of the CDK Project [can be generated later](#Generate-a-CDK-Stack-With-Then-Open-next-Construct) |

### Generate a CDK Stack Project

`nx g @cinch-nx/workspace:cdk-stack`

### Generate a CDK Stack with the open-next Construct.

`nx g @cinch-nx/workspace:open-next-stack`

## Executors

### CDK Executor

An Executors to run CDK Commands on your Nx Project.

_executor path:_ `@cinch-nx/workspace:cdk`

#### options

| key | Possible Values | Description |
| === | =============== | =========== |
| `command` | `deploy`, `synth`, `list`, `destroy` | any of the CDK toolkit commands are technically supported. |
| `profile` | `string` | the name of the profile you are using (used locally only) |
| `args` | `{ [key: string]: string | boolean }` | arbitrary CDK Arguments for the chosen command |
| `context` | `Record<string, string>` | Context args to be passed to your stack. |

### output-metadata Executor

An Executor to output your project metadata while deploying your project. (for Github Actions)

`@cinch-nx/workspace:output-metadata`

### opennext-build

An Executor to run `open-next build` on your NextJS Project.

`@cinch-nx/workspace:opennext-build`

### invalidate-cloudfront

`@cinch-nx/workspace:invalidate-cloudfront`
