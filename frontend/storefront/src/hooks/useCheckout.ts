import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { 
  GetCheckoutDocument,
  GetCheckoutLinesDocument,
  GetAvailableShippingMethodsDocument,
  GetAvailablePaymentGatewaysDocument,
  GetAvailableCollectionPointsDocument,
  ValidateAccessoryCompatibilityDocument,
  CreateAutoAccessoryCheckoutDocument,
  AddAutoAccessoryCheckoutLinesDocument,
  UpdateAutoAccessoryCheckoutLinesDocument,
  RemoveCheckoutLinesDocument,
  UpdateCheckoutShippingAddressDocument,
  UpdateCheckoutBillingAddressDocument,
  UpdateCheckoutShippingMethodDocument,
  UpdateCheckoutCollectionPointDocument,
  AddCheckoutPromoCodeDocument,
  RemoveCheckoutPromoCodeDocument,
  CompleteAutoAccessoryCheckoutDocument,
  UpdateCheckoutEmailDocument,
  UpdateCheckoutLanguageDocument,
  type GetCheckoutQuery,
  type GetCheckoutQueryVariables,
  type GetCheckoutLinesQuery,
  type GetCheckoutLinesQueryVariables,
  type GetAvailableShippingMethodsQuery,
  type GetAvailableShippingMethodsQueryVariables,
  type GetAvailablePaymentGatewaysQuery,
  type GetAvailablePaymentGatewaysQueryVariables,
  type GetAvailableCollectionPointsQuery,
  type GetAvailableCollectionPointsQueryVariables,
  type ValidateAccessoryCompatibilityQuery,
  type ValidateAccessoryCompatibilityQueryVariables,
  type CreateAutoAccessoryCheckoutMutation,
  type CreateAutoAccessoryCheckoutMutationVariables,
  type AddAutoAccessoryCheckoutLinesMutation,
  type AddAutoAccessoryCheckoutLinesMutationVariables,
  type UpdateAutoAccessoryCheckoutLinesMutation,
  type UpdateAutoAccessoryCheckoutLinesMutationVariables,
  type RemoveCheckoutLinesMutation,
  type RemoveCheckoutLinesMutationVariables,
  type UpdateCheckoutShippingAddressMutation,
  type UpdateCheckoutShippingAddressMutationVariables,
  type UpdateCheckoutBillingAddressMutation,
  type UpdateCheckoutBillingAddressMutationVariables,
  type UpdateCheckoutShippingMethodMutation,
  type UpdateCheckoutShippingMethodMutationVariables,
  type UpdateCheckoutCollectionPointMutation,
  type UpdateCheckoutCollectionPointMutationVariables,
  type AddCheckoutPromoCodeMutation,
  type AddCheckoutPromoCodeMutationVariables,
  type RemoveCheckoutPromoCodeMutation,
  type RemoveCheckoutPromoCodeMutationVariables,
  type CompleteAutoAccessoryCheckoutMutation,
  type CompleteAutoAccessoryCheckoutMutationVariables,
  type UpdateCheckoutEmailMutation,
  type UpdateCheckoutEmailMutationVariables,
  type UpdateCheckoutLanguageMutation,
  type UpdateCheckoutLanguageMutationVariables,
} from '@/graphql/generated/operations';

// Hook for getting checkout
export const useCheckout = (variables: GetCheckoutQueryVariables) => {
  return useQuery<GetCheckoutQuery, GetCheckoutQueryVariables>(
    GetCheckoutDocument,
    {
      variables,
      skip: !variables.token,
      notifyOnNetworkStatusChange: true,
    }
  );
};

// Hook for getting checkout lines
export const useCheckoutLines = (variables: GetCheckoutLinesQueryVariables) => {
  return useQuery<GetCheckoutLinesQuery, GetCheckoutLinesQueryVariables>(
    GetCheckoutLinesDocument,
    {
      variables,
      skip: !variables.token,
    }
  );
};

// Hook for getting available shipping methods
export const useAvailableShippingMethods = (
  variables: GetAvailableShippingMethodsQueryVariables
) => {
  return useQuery<GetAvailableShippingMethodsQuery, GetAvailableShippingMethodsQueryVariables>(
    GetAvailableShippingMethodsDocument,
    {
      variables,
      skip: !variables.token,
    }
  );
};

// Hook for getting available payment gateways
export const useAvailablePaymentGateways = (
  variables: GetAvailablePaymentGatewaysQueryVariables
) => {
  return useQuery<GetAvailablePaymentGatewaysQuery, GetAvailablePaymentGatewaysQueryVariables>(
    GetAvailablePaymentGatewaysDocument,
    {
      variables,
      skip: !variables.token,
    }
  );
};

// Hook for getting available collection points
export const useAvailableCollectionPoints = (
  variables: GetAvailableCollectionPointsQueryVariables
) => {
  return useQuery<GetAvailableCollectionPointsQuery, GetAvailableCollectionPointsQueryVariables>(
    GetAvailableCollectionPointsDocument,
    {
      variables,
      skip: !variables.token,
    }
  );
};

// Hook for validating accessory compatibility
export const useValidateAccessoryCompatibility = (
  variables: ValidateAccessoryCompatibilityQueryVariables
) => {
  return useQuery<ValidateAccessoryCompatibilityQuery, ValidateAccessoryCompatibilityQueryVariables>(
    ValidateAccessoryCompatibilityDocument,
    {
      variables,
      skip: !variables.accessoryIds || variables.accessoryIds.length === 0,
    }
  );
};

// Lazy hook for validating accessory compatibility
export const useLazyValidateAccessoryCompatibility = () => {
  return useLazyQuery<ValidateAccessoryCompatibilityQuery, ValidateAccessoryCompatibilityQueryVariables>(
    ValidateAccessoryCompatibilityDocument
  );
};

// Mutation hooks
export const useCreateAutoAccessoryCheckout = () => {
  return useMutation<CreateAutoAccessoryCheckoutMutation, CreateAutoAccessoryCheckoutMutationVariables>(
    CreateAutoAccessoryCheckoutDocument
  );
};

export const useAddAutoAccessoryCheckoutLines = () => {
  return useMutation<AddAutoAccessoryCheckoutLinesMutation, AddAutoAccessoryCheckoutLinesMutationVariables>(
    AddAutoAccessoryCheckoutLinesDocument
  );
};

export const useUpdateAutoAccessoryCheckoutLines = () => {
  return useMutation<UpdateAutoAccessoryCheckoutLinesMutation, UpdateAutoAccessoryCheckoutLinesMutationVariables>(
    UpdateAutoAccessoryCheckoutLinesDocument
  );
};

export const useRemoveCheckoutLines = () => {
  return useMutation<RemoveCheckoutLinesMutation, RemoveCheckoutLinesMutationVariables>(
    RemoveCheckoutLinesDocument
  );
};

export const useUpdateCheckoutShippingAddress = () => {
  return useMutation<UpdateCheckoutShippingAddressMutation, UpdateCheckoutShippingAddressMutationVariables>(
    UpdateCheckoutShippingAddressDocument
  );
};

export const useUpdateCheckoutBillingAddress = () => {
  return useMutation<UpdateCheckoutBillingAddressMutation, UpdateCheckoutBillingAddressMutationVariables>(
    UpdateCheckoutBillingAddressDocument
  );
};

export const useUpdateCheckoutShippingMethod = () => {
  return useMutation<UpdateCheckoutShippingMethodMutation, UpdateCheckoutShippingMethodMutationVariables>(
    UpdateCheckoutShippingMethodDocument
  );
};

export const useUpdateCheckoutCollectionPoint = () => {
  return useMutation<UpdateCheckoutCollectionPointMutation, UpdateCheckoutCollectionPointMutationVariables>(
    UpdateCheckoutCollectionPointDocument
  );
};

export const useAddCheckoutPromoCode = () => {
  return useMutation<AddCheckoutPromoCodeMutation, AddCheckoutPromoCodeMutationVariables>(
    AddCheckoutPromoCodeDocument
  );
};

export const useRemoveCheckoutPromoCode = () => {
  return useMutation<RemoveCheckoutPromoCodeMutation, RemoveCheckoutPromoCodeMutationVariables>(
    RemoveCheckoutPromoCodeDocument
  );
};

export const useCompleteAutoAccessoryCheckout = () => {
  return useMutation<CompleteAutoAccessoryCheckoutMutation, CompleteAutoAccessoryCheckoutMutationVariables>(
    CompleteAutoAccessoryCheckoutDocument
  );
};

export const useUpdateCheckoutEmail = () => {
  return useMutation<UpdateCheckoutEmailMutation, UpdateCheckoutEmailMutationVariables>(
    UpdateCheckoutEmailDocument
  );
};

export const useUpdateCheckoutLanguage = () => {
  return useMutation<UpdateCheckoutLanguageMutation, UpdateCheckoutLanguageMutationVariables>(
    UpdateCheckoutLanguageDocument
  );
};

// Custom hook for checkout management
export const useCheckoutManager = () => {
  const [createCheckout] = useCreateAutoAccessoryCheckout();
  const [addLines] = useAddAutoAccessoryCheckoutLines();
  const [updateLines] = useUpdateAutoAccessoryCheckoutLines();
  const [removeLines] = useRemoveCheckoutLines();
  const [updateShippingAddress] = useUpdateCheckoutShippingAddress();
  const [updateBillingAddress] = useUpdateCheckoutBillingAddress();
  const [updateShippingMethod] = useUpdateCheckoutShippingMethod();
  const [updateCollectionPoint] = useUpdateCheckoutCollectionPoint();
  const [addPromoCode] = useAddCheckoutPromoCode();
  const [removePromoCode] = useRemoveCheckoutPromoCode();
  const [completeCheckout] = useCompleteAutoAccessoryCheckout();
  const [updateEmail] = useUpdateCheckoutEmail();
  const [updateLanguage] = useUpdateCheckoutLanguage();

  return {
    createCheckout,
    addLines,
    updateLines,
    removeLines,
    updateShippingAddress,
    updateBillingAddress,
    updateShippingMethod,
    updateCollectionPoint,
    addPromoCode,
    removePromoCode,
    completeCheckout,
    updateEmail,
    updateLanguage,
  };
};

