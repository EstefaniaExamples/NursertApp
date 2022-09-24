// The rest of the project is Typescript, this might as well be too - otherwise
//  you have to do that spicy new type import thing to satisfy your editor... no
//  need to do that if your editor is already setup for Typescript
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};

export default config;
