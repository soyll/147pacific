import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

const SALEOR_API_URL = (import.meta as any).env?.VITE_SALEOR_API_URL;
const SALEOR_CHANNEL = (import.meta as any).env?.VITE_SALEOR_CHANNEL || 'online-store';

if (!SALEOR_API_URL) {
  console.error('VITE_SALEOR_API_URL не установлена!');
  throw new Error('VITE_SALEOR_API_URL environment variable is required');
}

console.log('SALEOR_API_URL: ', SALEOR_API_URL);
console.log('SALEOR_CHANNEL: ', SALEOR_CHANNEL);

// HTTP Link
const httpLink = createHttpLink({
  uri: SALEOR_API_URL,
});

// Auth Link
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage
  const token = localStorage.getItem('authToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'X-Refresh-Token': refreshToken || '',
      'Saleor-Channel': SALEOR_CHANNEL,
    },
  };
});

// Error Link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        extensions
      );
      
      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Clear tokens and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Handle network errors
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }
});

// Retry Link
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // Retry on network errors, but not on GraphQL errors
      return !!error && !error.result;
    },
  },
});

// Cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Cache products with pagination
        products: {
          keyArgs: ['filter', 'sortBy', 'channel'],
          merge(existing = { edges: [], pageInfo: {} }, incoming) {
            return {
              ...incoming,
              edges: [...existing.edges, ...incoming.edges],
              pageInfo: incoming.pageInfo,
            };
          },
        },
        bedRackProducts: {
          keyArgs: ['channel'],
          merge(existing = { edges: [], pageInfo: {} }, incoming) {
            return {
              ...incoming,
              edges: [...existing.edges, ...incoming.edges],
              pageInfo: incoming.pageInfo,
            };
          },
        },
        bullBarProducts: {
          keyArgs: ['channel'],
          merge(existing = { edges: [], pageInfo: {} }, incoming) {
            return {
              ...incoming,
              edges: [...existing.edges, ...incoming.edges],
              pageInfo: incoming.pageInfo,
            };
          },
        },
        hdGrilleGuardProducts: {
          keyArgs: ['channel'],
          merge(existing = { edges: [], pageInfo: {} }, incoming) {
            return {
              ...incoming,
              edges: [...existing.edges, ...incoming.edges],
              pageInfo: incoming.pageInfo,
            };
          },
        },
        runningBoardProducts: {
          keyArgs: ['channel'],
          merge(existing = { edges: [], pageInfo: {} }, incoming) {
            return {
              ...incoming,
              edges: [...existing.edges, ...incoming.edges],
              pageInfo: incoming.pageInfo,
            };
          },
        },
        // Cache checkout
        checkout: {
          keyArgs: ['id', 'token'],
        },
        // Cache user orders - removed complex configuration
      },
    },
    Product: {
      fields: {
        variants: {
          merge(_existing = [], incoming) {
            return incoming;
          },
        },
        attributes: {
          merge(_existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
    Checkout: {
      fields: {
        lines: {
          merge(_existing = [], incoming) {
            return incoming;
          },
        },
        autoAccessoryLines: {
          merge(_existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

// Create Apollo Client
const apolloClient = new ApolloClient({
  link: from([errorLink, retryLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: (import.meta as any).env?.DEV || false,
});

export default apolloClient;
