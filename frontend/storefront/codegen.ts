import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8000/graphql/',
  documents: ['src/graphql/**/*.graphql', 'src/graphql/**/*.ts', 'src/graphql/**/*.tsx'],
  generates: {
    './src/graphql/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
    './src/graphql/generated/types.ts': {
      plugins: ['typescript'],
      config: {
        scalars: {
          DateTime: 'string',
          Date: 'string',
          JSONString: 'string',
          UUID: 'string',
          Decimal: 'number',
          WeightScalar: 'string',
          Metadata: 'Record<string, string>',
        },
      },
    },
    './src/graphql/generated/operations.ts': {
      plugins: ['typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        scalars: {
          DateTime: 'string',
          Date: 'string',
          JSONString: 'string',
          UUID: 'string',
          Decimal: 'number',
          WeightScalar: 'string',
          Metadata: 'Record<string, string>',
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;

