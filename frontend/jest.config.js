module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/mocks/styleMocks.js',
  },
  testEnvironment: 'jsdom',
};
