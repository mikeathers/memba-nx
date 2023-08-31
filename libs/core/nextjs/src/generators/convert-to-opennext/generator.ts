import { Tree } from '@nx/devkit'
import { ConvertToOpennextGeneratorSchema } from './schema'
import addOpenNextConfig from '../add-opennext-build-config/generator'
import addPackageJson from '../add-opennext-package-json/generator'
import allowStandaloneBuilds from '../allow-standalone-builds/generator'

export default async function (
  tree: Tree,
  options: ConvertToOpennextGeneratorSchema,
) {
  await addOpenNextConfig(tree, {
    name: options.name,
  })

  await addPackageJson(tree, {
    name: options.name,
  })

  await allowStandaloneBuilds(tree, {
    name: options.name,
  })
}
