# library Generator

## How to use

Use this to generate Libraries:

```sh
yarn nx workspace-generator library --project=<project-name> --name=<library-name> <flags>
```

### flags

| flag  | type | description |
| :--- | :---: | :---    |
| `--dryRun` OR `--dry-run` | `Boolean` | run, but don't write the changes (I  Recommend using this first when running this for the first time.) |
| `--tags` | `string` | Comma Seperated strings to be used for tags, which in turn is used for linting. |
