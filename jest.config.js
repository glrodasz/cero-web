module.exports = {
  moduleNameMapper: { '\\.css$': 'identity-obj-proxy' },
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverageFrom: [
    '{features,api}/**/!(index).js',
    '{pages,helpers,scripts}/*.js',
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      lines: 60,
      functions: 60,
    },
  },
}
