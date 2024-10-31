import type { Config } from 'jest';

const config: Config = {
  displayName: 'react-components',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/react-components',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
};

export default config;
