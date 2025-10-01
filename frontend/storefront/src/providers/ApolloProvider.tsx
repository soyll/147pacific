import React from 'react';
import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import apolloClient from '@/lib/apollo';

interface ApolloProviderProps {
  children: React.ReactNode;
}

export const ApolloProvider: React.FC<ApolloProviderProps> = ({ children }) => {
  return (
    <BaseApolloProvider client={apolloClient}>
      {children}
    </BaseApolloProvider>
  );
};

export default ApolloProvider;

