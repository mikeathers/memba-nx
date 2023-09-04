const libraryTypes = ['feature', 'ui', 'util', 'plugin', 'app', 'cdk-stack'] as const

export type TypeTag = `type:${typeof libraryTypes[number]}`

export type DomainTag = `domain:${string}`

const scopes = ['shared-externally', 'shared-internally', 'private'] as const

export type ScopeTag = `scope:${typeof scopes[number]}`

// (string & {}) is a hack that allows you to open the type up to strings, but also gives you auto-complete.
// eslint-disable-next-line @typescript-eslint/ban-types
export type Tag = TypeTag | DomainTag | ScopeTag | (string & {})
