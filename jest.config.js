module.exports = {
  collectCoverageFrom: [
    '{features,api}/**/!(index|constants).js',
    '{helpers,scripts}/*.js',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/utils/testUtils/svgrMock.js',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?!(*.integration.)+(spec|test).[jt]s?(x)',
  ],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: ['node_modules/(?!@glrodasz/components)'],
}
