import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    "@libs/(.*)": "<rootDir>/src/libs/$1",
    "@functions/(.*)": "<rootDir>/src/functions/$1",
}
}

export default config
