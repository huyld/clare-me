import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  // Indicates whether each individual test should be reported during the run
  verbose: true,

};

export default config;
