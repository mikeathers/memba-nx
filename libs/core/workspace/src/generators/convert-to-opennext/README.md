# convert-to-opennext Generator

## 1. Introduction

This document outlines the technical details of the convert-to-opennext generator used in the migration process from the **sls-next** app to **OpenNext**. This generator is responsible for converting an existing application to be compatible with OpenNext.

## 2. Pre-requisites

Before you start, please ensure you have read and understood the [main migration guide](/docs/migrating-from-slsnext-to-opennext.md), which mentions the use of the `convert-to-opennext` generator.

## 3. Generator Function

The `convert-to-opennext` generator is an asynchronous function that performs three primary tasks. It is executed with the following signature:

` async function(tree: Tree, options: ConvertToOpennextGeneratorSchema)`

Here, the `tree` is an abstract representation of the file system, and `options` is an object containing the schema options.

The generator internally calls three functions:

1. `addOpenNextConfig()`

2. `addPackageJson()`

3. `allowStandaloneBuilds()`

Let's explore each function in detail:

### 3.1. addOpenNextConfig()

This function calls the generator from the `add-opennext-build-config` folder. It's used for adding build configuration for the OpenNext build in the `project.json` file situated in the app's root directory.

This function adds the following configuration for the _**customer-interactions-unsubscribe**_ app:

```
{
  ...
  "targets": {
    ...
    "opennext-build": {
      "executor": "@cinch-nx/core-nextjs:opennext-build",
      "outputs": ["dist/apps/customer-interactions/unsubscribe/.open-next"],
      "options": {
        "buildTarget": "customer-interactions-unsubscribe:build"
      }
    },
    ...
  }
}
```

This configuration specifies the executor for the OpenNext build, the output directory for the build artefacts, and the build target.

### 3.2. addPackageJson()

This function calls the generator from the `add-opennext-package-json` folder and is used for creating a `package.json` file in the app's root directory with the default build script.

The `package.json` file will contain the following for the **_customer-interactions-unsubscribe_** app:

```
{
  "name": "customer-interactions-unsubscribe",
  "version": "0.0.1",
  "scripts": {
    "build": "true"
  }
}
```

This file is essential for npm, and it contains meta information about the app and the build script.

### 3.3 allowStandaloneBuilds()

This function calls the generator from the `allow-standalone-builds` folder and changes two files to allow standalone builds.

**1. next.config.js**
It adds experimental configuration options to allow the application to be built in standalone mode, meaning it can be built without relying on the workspace configuration.

```
{
  ...
  "targets": {
    ...
    "opennext-build": {
      "executor": "@cinch-nx/core-nextjs:opennext-build",
      "outputs": ["dist/apps/customer-interactions/unsubscribe/.open-next"],
      "options": {
        "buildTarget": "customer-interactions-unsubscribe:build"
      }
    },
    ...
  }
}
```

This configuration specifies the executor for the OpenNext build, the output directory for the build artefacts, and the build target.

**2. index.tsx** in the `pages` folder
This update sets the path resolution for the `next.config.js ` file relative to the `index.tsx` file.

```
import path from 'path'
path.resolve(__dirname, '../next.config.js')
...
```

## 4. Conclusion

The `convert-to-opennext` generator performs a series of operations to convert an existing application to be compatible with OpenNext by updating the build configuration, adding a `package.json` file, and enabling standalone builds. This is crucial for deploying the application to AWS using OpenNext.
