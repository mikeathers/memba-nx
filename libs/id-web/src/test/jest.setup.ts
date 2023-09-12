import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    isReady: true,
    pathname: '/',
    hash: '',
    query: {},
    asPath: '/',
    basePath: '',
  }),
}))
