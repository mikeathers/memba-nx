import {
  readProjectConfiguration,
  formatFiles,
  Tree,
  generateFiles,
  ProjectConfiguration,
  joinPathFragments,
  updateJson,
} from '@nrwl/devkit'
import {AddOpennextPackageJsonGeneratorSchema} from './schema'
import {ensureNextJsApp} from '../../utils/ensure-nextjs-app'

interface NormalizedSchema extends AddOpennextPackageJsonGeneratorSchema {
  projectName: string
  projectRoot: string
  projectConfiguration: ProjectConfiguration
}

function normalizeOptions(
  tree: Tree,
  options: AddOpennextPackageJsonGeneratorSchema,
): NormalizedSchema {
  const projectName = options.name
  const projectConfiguration = readProjectConfiguration(tree, projectName)
  const projectRoot = `${projectConfiguration.root}`

  return {
    ...options,
    projectName,
    projectRoot,
    projectConfiguration,
  }
}

const PACKAGE_JSON = 'package.json'

function generatePackageJsonFile(tree: Tree, path: string, projectName: string) {
  const templateOptions = {
    projectName: projectName,
    template: '',
  }

  generateFiles(tree, joinPathFragments(__dirname, './files'), path, templateOptions)
}

function addPackageJsonFile(tree: Tree, {projectName, projectRoot}: NormalizedSchema) {
  if (tree.exists(`${projectRoot}/${PACKAGE_JSON}`)) {
    console.info(
      `>> [${projectName}] ${PACKAGE_JSON} file already exists. skipping generation of one.`,
    )
    return
  }
}

function updateTsConfig(tree: Tree, {projectRoot}: NormalizedSchema) {
  updateJson(tree, `${projectRoot}/tsconfig.json`, (tsConfig) => {
    tsConfig.compilerOptions = {
      target: 'ES2020',
      module: 'commonjs',
      lib: ['es2020'],
      declaration: true,
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      noImplicitThis: true,
      alwaysStrict: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
      noImplicitReturns: false,
      noFallthroughCasesInSwitch: false,
      inlineSources: true,
      typeRoots: ['../../../node_modules/@types'],
      allowJs: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      incremental: true,
      esModuleInterop: true,
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      plugins: [
        {
          name: 'next',
        },
      ],
    }
    // return modified JSON object
    return tsConfig
  })
}

function updateProjectMap(tree: Tree, {projectRoot, projectName}: NormalizedSchema) {
  updateJson(tree, `project-map.json`, (map) => {
    map.projects = {
      ...map.projects,
      [projectName]: projectRoot,
    }
    // return modified JSON object
    return map
  })
}

export default async function (
  tree: Tree,
  options: AddOpennextPackageJsonGeneratorSchema,
) {
  const normalizedOptions = normalizeOptions(tree, options)
  ensureNextJsApp(normalizedOptions.projectConfiguration)

  const projectPath = normalizedOptions.projectConfiguration.root

  generatePackageJsonFile(tree, projectPath, normalizedOptions.name)
  addPackageJsonFile(tree, normalizedOptions)
  updateTsConfig(tree, normalizedOptions)
  updateProjectMap(tree, normalizedOptions)

  await formatFiles(tree)
}
