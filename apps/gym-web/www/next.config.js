const CopyPlugin = require('copy-webpack-plugin')
const path = require('node:path')
//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {composePlugins, withNx} = require('@nx/next')

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
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
]

module.exports = composePlugins(...plugins)(nextConfig)
