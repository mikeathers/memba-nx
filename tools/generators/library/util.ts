import {
  Tree,
  joinPathFragments,
  parseJson,
  readProjectConfiguration,
} from '@nx/devkit'

export const isProjectANextJSProject = (tree: Tree, projectName?: string) => {
  // Shared and Data should never be applications - so we can early exit.
  if (!projectName || projectName === 'shared' || projectName === 'data') {
    return false
  }

  const projectRootDir = readProjectConfiguration(tree, projectName).root
  const projectJSONPath = joinPathFragments(projectRootDir, 'project.json')

  if (tree.exists(projectJSONPath)) {
    const projectJSON = tree.read(projectJSONPath)

    try {
      const parsedProjectJSON = parseJson(projectJSON?.toString() ?? '')

      return (
        parsedProjectJSON?.projectType === 'application' &&
        parsedProjectJSON?.targets?.build?.executor?.includes('@nrwl/next')
      )
    } catch {
      console.error(
        `Project "${projectName}"'s project.json is malformed. please check and try again.`,
      )
    }
  }

  return false
}

export const generateTags = (projectName?: string, extraTags?: string) =>
  [projectName && `${projectName}:lib`, extraTags && extraTags]
    .filter(Boolean)
    .join(',')

export const getProjectRoot = (tree: Tree, projectName: string) => {
  return readProjectConfiguration(tree, projectName).root
}
