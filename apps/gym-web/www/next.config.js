const CopyPlugin = require('copy-webpack-plugin')
const path = require('node:path')
//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {composePlugins, withNx} = require('@nx/next')

const STAGE_NAME = resolveStageName()

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../../'),
    externalDir: true,
  },

  output: 'standalone',

  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },

  compiler: {
    // For other options, see https://styled-components.com/docs/tooling#babel-plugin
    styledComponents: true,
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, '../../../public'),
            to: path.join(__dirname, 'public'),
          },
        ],
      }),
    )

    return config
  },

  env: {STAGE_NAME},
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
]

function resolveStageName() {
  const STAGE_NAME = process.env['STAGE_NAME'] ?? 'local'
  const VALID_STAGES = ['local', 'development', 'production']

  if (!VALID_STAGES.includes(STAGE_NAME)) {
    throw new Error(
      `Unknown STAGE_NAME provided: '${STAGE_NAME}', expected one of 'local', 'development' or 'production'`,
    )
  }

  return STAGE_NAME
}

module.exports = composePlugins(...plugins)(nextConfig)
