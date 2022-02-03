const redirectConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/planning',
        permanent: true,
      },
    ]
  },
}

module.exports = redirectConfig
