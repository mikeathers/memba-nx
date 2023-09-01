import {
  readProjectConfiguration,
  formatFiles,
  Tree,
  ProjectConfiguration,
  offsetFromRoot as getOffsetFromRoot,
} from '@nrwl/devkit'
import {AllowStandaloneBuildsGeneratorSchema} from './schema'
import {ensureNextJsApp} from '../../utils/ensure-nextjs-app'
import {parse, print, types} from 'recast'

interface NormalizedSchema extends AllowStandaloneBuildsGeneratorSchema {
  projectName: string
  projectRoot: string
  projectConfiguration: ProjectConfiguration
}

export default async function (
  tree: Tree,
  options: AllowStandaloneBuildsGeneratorSchema,
) {
  const normalizedOptions = normalizeOptions(tree, options)
  ensureNextJsApp(normalizedOptions.projectConfiguration)

  const projectPath = normalizedOptions.projectConfiguration.root

  // updateIndexFile(tree, projectPath)
  updateNextJsConfig(tree, projectPath)

  await formatFiles(tree)
}

function normalizeOptions(
  tree: Tree,
  options: AllowStandaloneBuildsGeneratorSchema,
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

export const RESOLVE_NEXT_CONFIG_STATEMENT = `/** work-around for making standalone builds work in older versions of Nx **/
/** TODO: Remove this when we upgrade to Nx 16.3.0+ **/
import path from 'path'
path.resolve(__dirname, '../next.config.js')
`
export const EMPTY_INDEX_CONTENT = `
      /** Act like this "page" doesn't exist. **/
      export function getServerSideProps() {
        return {
          notFound: true,
        }
      }

      export default function page() {
        return null
      }
`

function updateIndexFile(tree: Tree, path: string, indexFile = 'index.tsx') {
  const filePath = `${path}/pages/${indexFile}`
  const originalContents = tree.read(filePath)?.toString()
  let updatedContent = originalContents ?? ''

  if (originalContents && !originalContents?.includes(RESOLVE_NEXT_CONFIG_STATEMENT)) {
    updatedContent = `
    ${RESOLVE_NEXT_CONFIG_STATEMENT}\n${originalContents}`
  }

  if (!originalContents) {
    updatedContent = `${RESOLVE_NEXT_CONFIG_STATEMENT}\n${EMPTY_INDEX_CONTENT}`
  }

  tree.write(filePath, updatedContent)
}

function updateNextJsConfig(tree: Tree, path: string) {
  const filePath = `${path}/next.config.js`
  const contents = tree.read(filePath)?.toString() || ''
  traverseAst(tree, contents, path)
}

function traverseAst(tree: Tree, contents: string, path: string) {
  // Parse the input code into an AST
  const ast = parse(contents, {parser: require('recast/parsers/babel')})
  const builders = types.builders
  const offsetFromRoot = getOffsetFromRoot(path)

  // Check if the required import statement exists as node:path or path
  let hasPathImport = false
  types.visit(ast, {
    visitVariableDeclarator(path) {
      if (
        types.namedTypes.Identifier.check(path.node.id) &&
        path.node.id.name === 'path' &&
        types.namedTypes.CallExpression.check(path.node.init) &&
        types.namedTypes.Identifier.check(path.node.init.callee) &&
        path.node.init.callee.name === 'require' &&
        path.node.init.arguments.length === 1 &&
        types.namedTypes.StringLiteral.check(path.node.init.arguments[0]) &&
        (path.node.init.arguments[0].value === 'node:path' ||
          path.node.init.arguments[0].value === 'path')
      ) {
        hasPathImport = true
      }
      return false
    },
  })

  // If the required import statement doesn't exist (node:path or path), add it
  /**
   const path = require('node:path')
  **/
  if (!hasPathImport) {
    const requireStatement = builders.variableDeclaration('const', [
      builders.variableDeclarator(
        builders.identifier('path'),
        builders.callExpression(builders.identifier('require'), [
          builders.stringLiteral('node:path'),
        ]),
      ),
    ])
    ast.program.body.unshift(requireStatement)
  }

  // Traverse the AST and add output: standalone and experimental if they don't exist
  types.visit(ast, {
    visitObjectExpression(path) {
      // Find the object expression that represents `nextConfig`
      if (path.parentPath.value.id?.name === 'nextConfig') {
        let hasOutput = false
        let hasExperimental = false

        // Filter out the `target: 'serverless'` property
        path.node.properties = path.node.properties.filter((prop) => {
          if (
            types.namedTypes.ObjectProperty.check(prop) &&
            types.namedTypes.Identifier.check(prop.key) &&
            prop.key.name === 'target' &&
            types.namedTypes.StringLiteral.check(prop.value) &&
            prop.value.value === 'serverless'
          ) {
            return false
          }
          if (
            types.namedTypes.ObjectProperty.check(prop) &&
            types.namedTypes.Identifier.check(prop.key) &&
            prop.key.name === 'output' &&
            types.namedTypes.StringLiteral.check(prop.value) &&
            prop.value.value === 'standalone'
          ) {
            hasOutput = true
          }
          if (
            types.namedTypes.ObjectProperty.check(prop) &&
            types.namedTypes.Identifier.check(prop.key) &&
            prop.key.name === 'experimental' &&
            types.namedTypes.ObjectExpression.check(prop.value)
          ) {
            hasExperimental = true
          }
          return true
        })

        // Add the output: standalone property if it doesn't exist
        /**
        output: 'standalone',
         * **/
        if (!hasOutput) {
          path.node.properties.unshift(
            builders.objectProperty(
              builders.stringLiteral('output'),
              builders.stringLiteral('standalone'),
            ),
          )
        }

        // Add the experimental object property if it doesn't exist
        /**
        experimental: {
          outputFileTracingRoot: path.join(__dirname, '../../'),
          externalDir: true,
        },
        * **/
        if (!hasExperimental) {
          path.node.properties.unshift(
            builders.objectProperty(
              builders.stringLiteral('experimental'),
              builders.objectExpression([
                builders.objectProperty(
                  builders.identifier('outputFileTracingRoot'),
                  builders.callExpression(
                    builders.memberExpression(
                      builders.identifier('path'),
                      builders.identifier('join'),
                    ),
                    [
                      builders.identifier('__dirname'),
                      builders.stringLiteral(offsetFromRoot),
                    ],
                  ),
                ),
                builders.objectProperty(
                  builders.identifier('externalDir'),
                  builders.booleanLiteral(true),
                ),
              ]),
            ),
          )
        }
      }
      // Continue traversal
      return this.traverse(path)
    },
  })

  const outputCode = print(ast).code
  tree.write(`${path}/next.config.js`, outputCode)
}
