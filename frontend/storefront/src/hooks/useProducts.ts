import { useQuery, useLazyQuery } from '@apollo/client';
import { 
  GetAutoAccessoryProductsDocument,
  GetAutoAccessoryProductDocument,
} from '@/graphql/generated/operations';

// Types for auto accessory products
interface AutoAccessoryProductsVariables {
  first?: number;
  after?: string;
  channel?: string;
  filter?: any;
}

interface AutoAccessoryProductVariables {
  id?: string;
  slug?: string;
  channel?: string;
}

// Hook for getting auto accessory products with pagination
export const useAutoAccessoryProducts = (
  variables: AutoAccessoryProductsVariables
) => {
  return useQuery(
    GetAutoAccessoryProductsDocument,
    {
      variables,
      notifyOnNetworkStatusChange: true,
    }
  );
};

// Hook for getting a single auto accessory product
export const useAutoAccessoryProduct = (
  variables: AutoAccessoryProductVariables
) => {
  return useQuery(
    GetAutoAccessoryProductDocument,
    {
      variables,
      skip: !variables.id && !variables.slug,
    }
  );
};

// Lazy hook for product search
export const useLazyProductSearch = () => {
  return useLazyQuery(GetAutoAccessoryProductsDocument);
};

// Hook for getting compatible accessories
export const useCompatibleAccessories = (productId: string) => {
  return useQuery(GetAutoAccessoryProductsDocument, {
    variables: {
      first: 20,
      channel: 'online-store',
      filter: {
        compatibleWith: productId
      }
    },
    skip: !productId,
  });
};

// Hook for getting compatible sub-accessories
export const useCompatibleSubAccessories = (accessoryId: string) => {
  return useQuery(GetAutoAccessoryProductsDocument, {
    variables: {
      first: 20,
      channel: 'online-store',
      filter: {
        compatibleWith: accessoryId,
        productType: 'SUB_ACCESSORY'
      }
    },
    skip: !accessoryId,
  });
};

// Hook for vehicle compatibility search
export const useVehicleCompatibility = (brand: string, model: string, year: string) => {
  return useQuery(GetAutoAccessoryProductsDocument, {
    variables: {
      first: 20,
      channel: 'online-store',
      filter: {
        vehicleCompatibility: {
          brand,
          model,
          year
        }
      }
    },
    skip: !brand || !model || !year,
  });
};

// Lazy hook for vehicle compatibility search
export const useLazyVehicleCompatibility = () => {
  return useLazyQuery(GetAutoAccessoryProductsDocument);
};

// Hook for bed rack products
export const useBedRackProducts = (variables: AutoAccessoryProductsVariables = {}) => {
  return useQuery(GetAutoAccessoryProductsDocument, {
    variables: {
      first: 20,
      channel: 'online-store',
      // Убираем неправильные поля фильтра, используем только стандартные поля Saleor
      ...variables
    },
    notifyOnNetworkStatusChange: true,
  });
};

// Hook for bull bar products
export const useBullBarProducts = (variables: AutoAccessoryProductsVariables = {}) => {
  return useQuery(GetAutoAccessoryProductsDocument, {
    variables: {
      first: 20,
      channel: 'online-store',
      ...variables
    },
    notifyOnNetworkStatusChange: true,
  });
};

// Hook for HD grille guard products
export const useHDGrilleGuardProducts = (variables: AutoAccessoryProductsVariables = {}) => {
  return useQuery(GetAutoAccessoryProductsDocument, {
    variables: {
      first: 20,
      channel: 'online-store',
      ...variables
    },
    notifyOnNetworkStatusChange: true,
  });
};

// Hook for running board products
export const useRunningBoardProducts = (variables: AutoAccessoryProductsVariables = {}) => {
  return useQuery(GetAutoAccessoryProductsDocument, {
    variables: {
      first: 20,
      channel: 'online-store',
      ...variables
    },
    notifyOnNetworkStatusChange: true,
  });
};

// Custom hook for product categories
export const useProductCategories = () => {
  // This would use a query for categories
  // For now, return static categories based on our config
  return {
    data: {
      categories: [
        {
          id: 'bed-rack',
          name: 'Bed Rack',
          slug: 'bed-rack',
          description: 'Конструкции на кузов пикапа для защиты грузов',
        },
        {
          id: 'bull-bar',
          name: 'Bull Bar',
          slug: 'bull-bar',
          description: 'Кенгурятники для защиты передней части',
        },
        {
          id: 'hd-grille-guard',
          name: 'HD Grille Guard',
          slug: 'hd-grille-guard',
          description: 'Кенгурятники HD для грузовых автомобилей',
        },
        {
          id: 'running-board',
          name: 'Running Board',
          slug: 'running-board',
          description: 'Пороги для удобства посадки',
        },
      ],
    },
    loading: false,
    error: null,
  };
};

// Custom hook for product filters
export const useProductFilters = () => {
  return {
    brands: [
      'GMC', 'CHEVROLET', 'FORD', 'RAM', 'TOYOTA', 'NISSAN',
      'FREIGHTLINER', 'INTERNATIONAL', 'PETERBILT', 'KENWORTH', 'VOLVO', 'MACK'
    ],
    models: {
      'GMC': ['CANYON', 'SIERRA'],
      'CHEVROLET': ['COLORADO', 'SILVERADO'],
      'FORD': ['F-150', 'RANGER'],
      'RAM': ['1500', '2500'],
      'TOYOTA': ['TACOMA', 'TUNDRA'],
      'NISSAN': ['FRONTIER', 'TITAN'],
      'FREIGHTLINER': ['CASCADIA'],
      'INTERNATIONAL': ['PROSTAR'],
      'PETERBILT': ['T680', 'T880'],
      'KENWORTH': ['T680', 'T880'],
      'VOLVO': ['VNL'],
      'MACK': ['ANTHEM'],
    },
    materials: ['ALUMINUM', 'STAINLESS_STEEL', 'STEEL'],
    colorSchemes: [
      'POWDER_COATED_BLACK_ALUMINUM_BASES_AND_BARS_POLISHED_STAINLESS_FIXTURE_PIPES_STAINLESS_HARDWARE',
      'POWDER_COATED_BLACK_ALUMINUM_BASES_AND_BARS_POWDER_COATED_BLACK_STAINLESS_FIXTURE_PIPES_STAINLESS_HARDWARE',
      'POWDER_COATED_BLACK_ALUMINUM',
      'POLISHED_STAINLESS',
    ],
    installationTypes: ['DIRECT_MOUNT', 'BRACKET_MOUNT', 'CLAMP_MOUNT'],
    productTypes: ['ACCESSORY', 'SUB_ACCESSORY'],
  };
};

