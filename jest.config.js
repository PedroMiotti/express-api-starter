module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      require.resolve('@swc/jest'),
      {
        jsc: {
          parser: {
            syntax: 'typescript',
          },
          target: 'es2022',
        },
      },
    ],
  },
  modulePathIgnorePatterns: ['/build/*', '/src/infra/database'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
