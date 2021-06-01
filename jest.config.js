module.exports = {
  moduleNameMapper: { '\\.css$': 'identity-obj-proxy' },
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverageFrom: [
    '{features,api}/**/!(index|constants).js',
    '{helpers,scripts}/*.js',
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      lines: 60,
      functions: 60,
    },
  },
  transformIgnorePatterns: ['node_modules/(?!@glrodasz/components)'],
}
