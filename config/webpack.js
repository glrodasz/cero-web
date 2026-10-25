const path = require('path')

const customConfig = {
  transpilePackages: ['@glrodasz/components'],
  webpack: (config, options) => {
    // resolve unique version of react
    // https://github.com/martpie/next-transpile-modules#i-have-trouble-with-duplicated-dependencies-or-the-invalid-hook-call-error-in-react
    if (options.isServer) {
      config.externals = ['react', ...config.externals]
    }

    config.resolve.alias['react'] = path.resolve(
      __dirname,
      '../node_modules/react'
    )

    // Load SVG as inline React component
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

module.exports = customConfig
