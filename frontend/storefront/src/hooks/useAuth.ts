import { useQuery, useMutation } from '@apollo/client';
import { 
  GetCurrentUserDocument,
  GetUserOrdersDocument,
  GetOrderDetailsDocument,
  RegisterUserDocument,
  LoginUserDocument,
  RefreshTokenDocument,
  LogoutUserDocument,
  ChangePasswordDocument,
  RequestPasswordResetDocument,
  ConfirmPasswordResetDocument,
  UpdateUserAccountDocument,
  DeleteUserAccountDocument,
  CreateUserAddressDocument,
  UpdateUserAddressDocument,
  DeleteUserAddressDocument,
  SetDefaultUserAddressDocument,
  type GetCurrentUserQuery,
  type GetCurrentUserQueryVariables,
  type GetUserOrdersQuery,
  type GetUserOrdersQueryVariables,
  type GetOrderDetailsQuery,
  type GetOrderDetailsQueryVariables,
  type RegisterUserMutation,
  type RegisterUserMutationVariables,
  type LoginUserMutation,
  type LoginUserMutationVariables,
  type RefreshTokenMutation,
  type RefreshTokenMutationVariables,
  type LogoutUserMutation,
  type LogoutUserMutationVariables,
  type ChangePasswordMutation,
  type ChangePasswordMutationVariables,
  type RequestPasswordResetMutation,
  type RequestPasswordResetMutationVariables,
  type ConfirmPasswordResetMutation,
  type ConfirmPasswordResetMutationVariables,
  type UpdateUserAccountMutation,
  type UpdateUserAccountMutationVariables,
  type DeleteUserAccountMutation,
  type DeleteUserAccountMutationVariables,
  type CreateUserAddressMutation,
  type CreateUserAddressMutationVariables,
  type UpdateUserAddressMutation,
  type UpdateUserAddressMutationVariables,
  type DeleteUserAddressMutation,
  type DeleteUserAddressMutationVariables,
  type SetDefaultUserAddressMutation,
  type SetDefaultUserAddressMutationVariables,
} from '@/graphql/generated/operations';

// Hook for getting current user
export const useCurrentUser = () => {
  return useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(
    GetCurrentUserDocument,
    {
      errorPolicy: 'all',
    }
  );
};

// Hook for getting user orders
export const useUserOrders = (variables: GetUserOrdersQueryVariables) => {
  return useQuery<GetUserOrdersQuery, GetUserOrdersQueryVariables>(
    GetUserOrdersDocument,
    {
      variables,
      notifyOnNetworkStatusChange: true,
    }
  );
};

// Hook for getting order details
export const useOrderDetails = (variables: GetOrderDetailsQueryVariables) => {
  return useQuery<GetOrderDetailsQuery, GetOrderDetailsQueryVariables>(
    GetOrderDetailsDocument,
    {
      variables,
      skip: !variables.id,
    }
  );
};

// Authentication mutation hooks
export const useRegisterUser = () => {
  return useMutation<RegisterUserMutation, RegisterUserMutationVariables>(
    RegisterUserDocument
  );
};

export const useLoginUser = () => {
  return useMutation<LoginUserMutation, LoginUserMutationVariables>(
    LoginUserDocument
  );
};

export const useRefreshToken = () => {
  return useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(
    RefreshTokenDocument
  );
};

export const useLogoutUser = () => {
  return useMutation<LogoutUserMutation, LogoutUserMutationVariables>(
    LogoutUserDocument
  );
};

export const useChangePassword = () => {
  return useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(
    ChangePasswordDocument
  );
};

export const useRequestPasswordReset = () => {
  return useMutation<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>(
    RequestPasswordResetDocument
  );
};

export const useConfirmPasswordReset = () => {
  return useMutation<ConfirmPasswordResetMutation, ConfirmPasswordResetMutationVariables>(
    ConfirmPasswordResetDocument
  );
};

export const useUpdateUserAccount = () => {
  return useMutation<UpdateUserAccountMutation, UpdateUserAccountMutationVariables>(
    UpdateUserAccountDocument
  );
};

export const useDeleteUserAccount = () => {
  return useMutation<DeleteUserAccountMutation, DeleteUserAccountMutationVariables>(
    DeleteUserAccountDocument
  );
};

// Address management hooks
export const useCreateUserAddress = () => {
  return useMutation<CreateUserAddressMutation, CreateUserAddressMutationVariables>(
    CreateUserAddressDocument
  );
};

export const useUpdateUserAddress = () => {
  return useMutation<UpdateUserAddressMutation, UpdateUserAddressMutationVariables>(
    UpdateUserAddressDocument
  );
};

export const useDeleteUserAddress = () => {
  return useMutation<DeleteUserAddressMutation, DeleteUserAddressMutationVariables>(
    DeleteUserAddressDocument
  );
};

export const useSetDefaultUserAddress = () => {
  return useMutation<SetDefaultUserAddressMutation, SetDefaultUserAddressMutationVariables>(
    SetDefaultUserAddressDocument
  );
};

// Custom hook for authentication management
export const useAuth = () => {
  const { data: userData, loading: userLoading, error: userError } = useCurrentUser();
  const [login] = useLoginUser();
  const [register] = useRegisterUser();
  const [logout] = useLogoutUser();
  const [refreshToken] = useRefreshToken();
  const [changePassword] = useChangePassword();
  const [requestPasswordReset] = useRequestPasswordReset();
  const [confirmPasswordReset] = useConfirmPasswordReset();
  const [updateAccount] = useUpdateUserAccount();
  const [deleteAccount] = useDeleteUserAccount();

  const isAuthenticated = !!userData?.me;
  const user = userData?.me;

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({
        variables: { email, password },
      });

      if (result.data?.tokenCreate?.token) {
        localStorage.setItem('authToken', result.data.tokenCreate.token);
        if (result.data.tokenCreate.refreshToken) {
          localStorage.setItem('refreshToken', result.data.tokenCreate.refreshToken);
        }
        return { success: true, user: result.data.tokenCreate.user };
      }

      return { 
        success: false, 
        errors: result.data?.tokenCreate?.errors || [{ message: 'Login failed' }] 
      };
    } catch (error) {
      return { 
        success: false, 
        errors: [{ message: 'Network error occurred' }] 
      };
    }
  };

  const handleRegister = async (input: RegisterUserMutationVariables['input']) => {
    try {
      const result = await register({
        variables: { input },
      });

      if (result.data?.accountRegister?.user) {
        return { 
          success: true, 
          user: result.data.accountRegister.user,
          requiresConfirmation: result.data.accountRegister.requiresConfirmation 
        };
      }

      return { 
        success: false, 
        errors: result.data?.accountRegister?.errors || [{ message: 'Registration failed' }] 
      };
    } catch (error) {
      return { 
        success: false, 
        errors: [{ message: 'Network error occurred' }] 
      };
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }
  };

  const handleRefreshToken = async () => {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (!refreshTokenValue) return false;

    try {
      const result = await refreshToken({
        variables: { refreshToken: refreshTokenValue },
      });

      if (result.data?.tokenRefresh?.token) {
        localStorage.setItem('authToken', result.data.tokenRefresh.token);
        if (result.data.tokenRefresh.refreshToken) {
          localStorage.setItem('refreshToken', result.data.tokenRefresh.refreshToken);
        }
        return true;
      }
      return false;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    loading: userLoading,
    error: userError,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken: handleRefreshToken,
    changePassword,
    requestPasswordReset,
    confirmPasswordReset,
    updateAccount,
    deleteAccount,
  };
};
