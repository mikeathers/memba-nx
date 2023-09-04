export interface NxAffectedOutput {
  tasks: Task[]
  projects: string[]
  projectGraph: ProjectGraph
}

export interface ProjectGraph {
  nodes: string[]
  dependencies: {[key: string]: Dependency[]}
}

export interface Dependency {
  source: string
  target: string
  type: Type
}

export enum Type {
  Implicit = 'implicit',
  Static = 'static',
}

export interface Task {
  id: string
  overrides: Overrides
  target: Target
  command: string
  outputs: string[]
}

export interface Overrides {
  [key: string]: string
}

export interface Target {
  project: string
  target: string
  configuration: string
}

export interface ProjectConfigurations {
  [projectName: string]: string[]
}

export interface IProjectConfig {
  project: string
  configuration: string
}

export interface IMatrixObject {
  include: IProjectConfig[]
}
