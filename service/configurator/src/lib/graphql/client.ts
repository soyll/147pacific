import { createClient, fetchExchange } from '@urql/core';
import { logger } from '../logger';

// Get Saleor API URL from environment variables
const SALEOR_API_URL = process.env.SALEOR_API_URL;
const SALEOR_EMAIL = process.env.SALEOR_EMAIL;
const SALEOR_PASSWORD = process.env.SALEOR_PASSWORD;

// Log environment variables (without password)
logger.debug('GraphQL Client Configuration', {
  SALEOR_API_URL,
  SALEOR_EMAIL,
  SALEOR_PASSWORD_SET: !!SALEOR_PASSWORD,
  SALEOR_PASSWORD_LENGTH: SALEOR_PASSWORD?.length || 0
});

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
  logger.info('Starting authentication process', {
    apiUrl: SALEOR_API_URL,
    email: SALEOR_EMAIL,
    password: SALEOR_PASSWORD
  });

  // Validate environment variables
  if (!SALEOR_API_URL) {
    const error = 'SALEOR_API_URL is not defined';
    logger.error(error);
    throw new Error(error);
  }
  
  if (!SALEOR_EMAIL) {
    const error = 'SALEOR_EMAIL is not defined';
    logger.error(error);
    throw new Error(error);
  }
  
  if (!SALEOR_PASSWORD) {
    const error = 'SALEOR_PASSWORD is not defined';
    logger.error(error);
    throw new Error(error);
  }

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

  const requestBody = {
    query: loginMutation,
    variables: {
      email: SALEOR_EMAIL,
      password: SALEOR_PASSWORD,
    },
  };

  logger.debug('Sending authentication request', {
    url: SALEOR_API_URL,
    email: SALEOR_EMAIL,
    mutation: loginMutation.trim(),
    fullRequestBody: requestBody
  });

  try {
    const response = await fetch(SALEOR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    logger.debug('Received authentication response', {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'content-type': response.headers.get('content-type'),
        'content-length': response.headers.get('content-length')
      }
    });

    // Log raw response text before parsing
    const responseText = await response.text();
    logger.debug('Raw response text', {
      responseText: responseText
    });

    const result = JSON.parse(responseText);
    
    logger.debug('Authentication response body', {
      hasData: !!result.data,
      hasToken: !!result.data?.tokenCreate?.token,
      hasErrors: !!result.data?.tokenCreate?.errors,
      errors: result.data?.tokenCreate?.errors,
      fullResponse: result
    });
    
    if (result.data?.tokenCreate?.token) {
      const token = result.data.tokenCreate.token;
      logger.info('Authentication successful', {
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 10) + '...'
      });
      
      setAuthToken(token);
      return token;
    } else {
      const errorMessage = 'Authentication failed: ' + JSON.stringify(result.data?.tokenCreate?.errors);
      logger.error('Authentication failed', {
        errors: result.data?.tokenCreate?.errors,
        fullResponse: result
      });
      throw new Error(errorMessage);
    }
  } catch (error) {
    logger.error('Authentication request failed', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      url: SALEOR_API_URL
    });
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
  
  logger.debug('Authorization token set successfully');
};

// Helper function to clear authorization header
export const clearAuthToken = () => {
  logger.debug('Clearing authorization token');
  
  if (graphqlClient.fetchOptions?.headers) {
    const { Authorization, ...headers } = graphqlClient.fetchOptions.headers as any;
    graphqlClient.fetchOptions = {
      ...graphqlClient.fetchOptions,
      headers,
    };
    logger.debug('Authorization token cleared successfully');
  } else {
    logger.debug('No authorization token to clear');
  }
};
