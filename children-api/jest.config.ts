import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': [ 
      'ts-jest', 
      {
        useEsm: true,
      }
    ]
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testRegex: '.*.spec.ts',
}

export default config
