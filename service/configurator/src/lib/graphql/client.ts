import { createClient, fetchExchange } from '@urql/core';
import { logger } from '../logger';

// Get Saleor API URL from environment variables
const SALEOR_API_URL = process.env.SALEOR_API_URL;
const SALEOR_EMAIL = process.env.SALEOR_EMAIL;
const SALEOR_PASSWORD = process.env.SALEOR_PASSWORD;

// Create GraphQL client using URQL
export const graphqlClient = createClient({
  url: SALEOR_API_URL,
  exchanges: [fetchExchange],
  fetchOptions: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

// Login and get token
export const authenticate = async () => {
  const loginMutation = `
    mutation TokenCreate($email: String!, $password: String!) {
      tokenCreate(email: $email, password: $password) {
        token
        errors {
          field
          message
        }
      }
    }
  `;

  try {
    const response = await fetch(SALEOR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: loginMutation,
        variables: {
          email: SALEOR_EMAIL,
          password: SALEOR_PASSWORD,
        },
      }),
    });

    const result = await response.json();
    
    if (result.data?.tokenCreate?.token) {
      setAuthToken(result.data.tokenCreate.token);
      return result.data.tokenCreate.token;
    } else {
      throw new Error('Authentication failed: ' + JSON.stringify(result.data?.tokenCreate?.errors));
    }
  } catch (error) {
    throw new Error('Authentication error: ' + error);
  }
};

// Helper function to set authorization header
export const setAuthToken = (token: string) => {
  logger.debug('Setting authorization token', {
    tokenLength: token.length,
    tokenPrefix: token.substring(0, 10) + '...'
  });
  
  graphqlClient.fetchOptions = {
    ...graphqlClient.fetchOptions,
    headers: {
      ...graphqlClient.fetchOptions?.headers,
      'Authorization': `Bearer ${token}`,
    },
  };
  
  logger.debug('Authorization token set successfully', {
    headers: graphqlClient.fetchOptions?.headers
  });
};

// Helper function to clear authorization header
export const clearAuthToken = () => {
  if (graphqlClient.fetchOptions?.headers) {
    const { Authorization, ...headers } = graphqlClient.fetchOptions.headers as any;
    graphqlClient.fetchOptions = {
      ...graphqlClient.fetchOptions,
      headers,
    };
  }
};
