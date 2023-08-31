import '@testing-library/jest-dom'

window.scrollTo = jest.fn()
class LocalStorageMock {
  store: Record<string, string>

  constructor() {
    this.store = {}
  }

  clear() {
    this.store = {}
  }

  getItem(key: string) {
    return this.store[key] || null
  }

  setItem(key: string, value: unknown) {
    this.store[key] = String(value)
  }

  removeItem(key: string) {
    delete this.store[key]
  }

  get length() {
    return Object.keys(this.store).length
  }

  key(n: number) {
    return Object.keys(this.store)[n]
  }
}

global.sessionStorage = new LocalStorageMock()
global.localStorage = new LocalStorageMock()

expect.extend({
  toContainObject(received, argument) {
    const pass = this.equals(
      received,
      expect.arrayContaining([expect.objectContaining(argument)]),
    )

    return pass
      ? {
          message: () =>
            `expected ${this.utils.printReceived(
              received,
            )} not to contain object ${this.utils.printExpected(argument)}`,
          pass: true,
        }
      : {
          message: () =>
            `expected ${this.utils.printReceived(
              received,
            )} to contain object ${this.utils.printExpected(argument)}`,
          pass: false,
        }
  },
})
