const libraryTypes = [
  'feature',
  'ui',
  'util',
  'plugin',
  'app',
  'cdk-stack',
] as const

export type TypeTag = `type:${typeof libraryTypes[number]}`

import { SquadName } from './stage-props'

export type DomainTag = `domain:${SquadName}`

const scopes = ['shared-externally', 'shared-internally', 'private'] as const

export type ScopeTag = `scope:${typeof scopes[number]}`

// (string & {}) is a hack that allows you to open the type up to strings, but also gives you auto-complete.
// eslint-disable-next-line @typescript-eslint/ban-types
export type Tag = TypeTag | DomainTag | ScopeTag | (string & {})
