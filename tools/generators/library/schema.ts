export interface Schema {
  name: string
  project?: string
  directory?: string
  tags?: string
}

export interface NormalizedSchema {
  name: string
  projectName: string
  projectPath: string
  projectDirectory: string
  projectImportPath: string
  projectTags: string
  projectParent?: string
}
