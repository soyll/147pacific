/**
 * Saleor Configurator GraphQL Patterns
 * 
 * This file provides guidance for working with GraphQL in the Saleor Configurator
 * Based on actual implementation patterns from the codebase
 */

const configuratorGraphQLPatterns = {
  /**
   * Core GraphQL Client Pattern
   * 
   * The configurator uses urql as the GraphQL client with gql.tada for type safety
   */
  clientPattern: `
import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { graphql } from 'gql.tada';

// Create GraphQL client
export const createClient = (apiUrl, token) => {
  return new Client({
    url: apiUrl,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    },
  });
};
  `,

  /**
   * Repository Pattern
   * 
   * The configurator follows a repository pattern for GraphQL operations
   * Each domain entity has its own repository with typed operations
   */
  repositoryPattern: `
import { graphql, type VariablesOf, type ResultOf } from "gql.tada";

// 1. Define GraphQL operations with gql.tada
const createAttributeMutation = graphql(\`
  mutation CreateAttribute($input: AttributeCreateInput!) {
    attributeCreate(input: $input) {
      attribute {
        id
        name
        type
        inputType
        entityType
        choices(first: 100) {
          edges {
            node {
              name
            }
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
\`);

// 2. Extract TypeScript types from the operations
export type AttributeCreateInput = VariablesOf<
  typeof createAttributeMutation
>["input"];

type AttributeFragment = NonNullable<
  NonNullable<
    NonNullable<ResultOf<typeof createAttributeMutation>>["attributeCreate"]
  >["attribute"]
>;

export type Attribute = AttributeFragment;

// 3. Define interface for operations
export interface AttributeOperations {
  createAttribute(attributeInput: AttributeCreateInput): Promise<Attribute>;
  getAttributesByNames(
    input: GetAttributesByNamesInput
  ): Promise<Attribute[] | null | undefined>;
}

// 4. Implement repository with GraphQL operations
export class AttributeRepository implements AttributeOperations {
  constructor(private client: Client) {}

  async createAttribute(
    attributeInput: AttributeCreateInput
  ): Promise<Attribute> {
    const result = await this.client.mutation(createAttributeMutation, {
      input: attributeInput,
    });

    if (!result.data?.attributeCreate?.attribute) {
      throw new Error("Failed to create attribute");
    }

    return result.data.attributeCreate.attribute as Attribute;
  }
  
  // Additional methods...
}
  `,

  /**
   * Service Layer Pattern
   * 
   * The configurator implements a service layer on top of repositories
   * Services handle business logic and interact with repositories
   */
  servicePattern: `
import type { AttributeInput } from "../config/schema";
import { logger } from "../../lib/logger";
import type {
  AttributeCreateInput,
  AttributeOperations,
  Attribute,
} from "./repository";

// Helper function for data transformation
const createAttributeInput = (input: AttributeInput): AttributeCreateInput => {
  const base = {
    name: input.name,
    type: input.type,
    slug: input.name.toLowerCase().replace(/ /g, "-"),
    inputType: input.inputType,
  };

  if (input.inputType === "REFERENCE") {
    if (!input.entityType) {
      throw new Error(
        \`Entity type is required for reference attribute \${input.name}\`
      );
    }

    return {
      ...base,
      entityType: input.entityType,
    };
  }

  if ("values" in input && input.values) {
    return {
      ...base,
      values: input.values.map((value) => ({
        name: value.name,
      })),
    };
  }

  return base;
};

// Service implementation
export class AttributeService {
  constructor(private repository: AttributeOperations) {}

  // Method to get or create an attribute
  async getOrCreate(name: string, type: "PRODUCT_TYPE" | "PAGE_TYPE") {
    logger.debug("Looking up attribute", { name, type });
    const existingAttributes = await this.repository.getAttributesByNames({
      names: [name],
      type,
    });

    const existingAttribute = existingAttributes?.[0];
    if (existingAttribute) {
      logger.debug("Found existing attribute", {
        id: existingAttribute.id,
        name: existingAttribute.name,
      });
      return existingAttribute;
    }

    logger.debug("Creating new attribute", { name, type });
    return this.repository.createAttribute({
      name,
      type,
      inputType: "DROPDOWN",
    });
  }

  // Bootstrap method for initial setup
  async bootstrapAttributes({
    attributeInputs,
  }: {
    attributeInputs: AttributeInput[];
  }) {
    logger.debug("Bootstrapping attributes", {
      count: attributeInputs.length,
    });

    // Implementation details...
  }
}
  `,

  /**
   * Common GraphQL Mutations
   * 
   * Examples of common mutations used in the configurator
   */
  commonMutations: {
    createAttribute: `
mutation CreateAttribute($input: AttributeCreateInput!) {
  attributeCreate(input: $input) {
    attribute {
      id
      name
      type
      inputType
      entityType
      choices(first: 100) {
        edges {
          node {
            name
          }
        }
      }
    }
    errors {
      field
      message
    }
  }
}
    `,

    createProductType: `
mutation CreateProductType($input: ProductTypeInput!) {
  productTypeCreate(input: $input) {
    productType {
      id
      name
      productAttributes {
        id
        name
      }
    }
  }
}
    `,

    assignAttributesToProductType: `
mutation AssignAttributesToProductType(
  $productTypeId: ID!
  $operations: [ProductAttributeAssignInput!]!
) {
  productAttributeAssign(
    productTypeId: $productTypeId
    operations: $operations
  ) {
    productType {
      id
    }
    errors {
      message
    }
  }
}
    `,

    updateShopSettings: `
mutation UpdateShopSettings($input: ShopSettingsInput!) {
  shopSettingsUpdate(input: $input) {
    shop {
      defaultWeightUnit
      displayGrossPrices
      includeTaxesInPrices
      chargeTaxesOnShipping
      trackInventoryByDefault
      defaultDigitalMaxDownloads
      defaultDigitalUrlValidDays
      automaticFulfillmentDigitalProducts
      reserveStockDurationAnonymousUser
      reserveStockDurationAuthenticatedUser
      limitQuantityPerCheckout
    }
    errors {
      field
      message
    }
  }
}
    `,

    createChannel: `
mutation CreateChannel($input: ChannelCreateInput!) {
  channelCreate(input: $input) {
    channel {
      id
      slug
      name
      currencyCode
      defaultCountry {
        code
      }
    }
    errors {
      field
      message
    }
  }
}
    `,

    updateChannelSettings: `
mutation UpdateChannelSettings($id: ID!, $input: ChannelUpdateInput!) {
  channelUpdate(id: $id, input: $input) {
    channel {
      id
      slug
      name
      currencyCode
      defaultCountry {
        code
      }
    }
    errors {
      field
      message
    }
  }
}
    `,
  },

  /**
   * Common GraphQL Queries
   * 
   * Examples of common queries used in the configurator
   */
  commonQueries: {
    getAttributesByNames: `
query GetAttributesByNames($names: [String!]!, $type: AttributeTypeEnum) {
  attributes(
    first: 100
    where: { name: { oneOf: $names }, type: { eq: $type } }
  ) {
    edges {
      node {
        id
        name
        type
        inputType
        entityType
        choices(first: 100) {
          edges {
            node {
              name
            }
          }
        }
      }
    }
  }
}
    `,

    getProductTypeByName: `
query GetProductTypeByName($name: String!) {
  productTypes(filter: { search: $name }, first: 1) {
    edges {
      node {
        id
        name
        productAttributes {
          id
          name
        }
      }
    }
  }
}
    `,

    getChannels: `
query GetChannels {
  channels {
    edges {
      node {
        id
        slug
        name
        currencyCode
        defaultCountry {
          code
        }
      }
    }
  }
}
    `,

    getShopSettings: `
query GetShopSettings {
  shop {
    defaultWeightUnit
    displayGrossPrices
    includeTaxesInPrices
    chargeTaxesOnShipping
    trackInventoryByDefault
    defaultDigitalMaxDownloads
    defaultDigitalUrlValidDays
    automaticFulfillmentDigitalProducts
    reserveStockDurationAnonymousUser
    reserveStockDurationAuthenticatedUser
    limitQuantityPerCheckout
  }
}
    `,

    getPageTypeByName: `
query GetPageTypeByName($name: String!) {
  pageTypes(filter: { search: $name }, first: 1) {
    edges {
      node {
        id
        name
        attributes {
          id
          name
        }
      }
    }
  }
}
    `,
  },

  /**
   * Input Type Patterns
   * 
   * Based on Zod schema definitions in the configurator
   */
  inputTypePatterns: {
    attributeInputTypes: `
// Attribute input types supported by Saleor
const attributeInputTypes = [
  "DROPDOWN",     // Single selection from dropdown
  "MULTISELECT",  // Multiple selection
  "SWATCH",       // Color/image swatch
  "REFERENCE",    // Reference to another entity
  "PLAIN_TEXT",   // Simple text
  "NUMERIC",      // Numbers
  "DATE",         // Date picker
  "BOOLEAN",      // True/false
  "RICH_TEXT",    // Formatted text editor
  "DATE_TIME",    // Date and time
  "FILE"          // File upload
];

// Reference entity types
const referenceEntityTypes = [
  "PAGE",
  "PRODUCT",
  "PRODUCT_VARIANT"
];
    `,

    productTypeInput: `
// ProductType input structure
const productTypeInput = {
  name: "T-Shirt",              // Name of the product type
  isShippingRequired: true,     // Whether physical shipping is needed
  weight: 0.5,                  // Default weight
  hasVariants: true,            // Whether this product type has variants
  taxClass: "standard",         // Tax class
  kind: "NORMAL",               // NORMAL or GIFT_CARD
  isDigital: false,             // Whether this is a digital product
  attributes: [                 // Product attributes
    {
      name: "Brand",
      inputType: "DROPDOWN",
      values: [
        { name: "Nike" },
        { name: "Adidas" }
      ]
    }
  ],
  variantAttributes: [          // Attributes that create variants
    {
      name: "Size",
      inputType: "DROPDOWN",
      values: [
        { name: "S" },
        { name: "M" },
        { name: "L" }
      ]
    },
    {
      name: "Color",
      inputType: "SWATCH",
      values: [
        { name: "Red" },
        { name: "Blue" }
      ]
    }
  ]
};
    `,

    channelInput: `
// Channel input structure
const channelInput = {
  name: "Web Store",
  slug: "web-store",
  currencyCode: "USD",
  defaultCountry: "US",
  settings: {
    allocationStrategy: "PRIORITIZE_SORTING_ORDER",
    automaticallyConfirmAllNewOrders: true,
    automaticallyFulfillNonShippableGiftCard: true,
    expireOrdersAfter: 30,
    deleteExpiredOrdersAfter: 60,
    markAsPaidStrategy: "TRANSACTION_FLOW",
    allowUnpaidOrders: false,
    includeDraftOrderInVoucherUsage: true,
    useLegacyErrorFlow: false,
    automaticallyCompleteFullyPaidCheckouts: true,
    defaultTransactionFlowStrategy: "AUTHORIZATION"
  }
};
    `,

    shopSettingsInput: `
// Shop settings input structure
const shopSettingsInput = {
  defaultWeightUnit: "KG",
  displayGrossPrices: true,
  trackInventoryByDefault: true,
  defaultDigitalMaxDownloads: 5,
  defaultDigitalUrlValidDays: 30,
  defaultMailSenderName: "Saleor Store",
  defaultMailSenderAddress: "store@example.com",
  customerSetPasswordUrl: "https://example.com/set-password/",
  reserveStockDurationAnonymousUser: 60,
  reserveStockDurationAuthenticatedUser: 120,
  limitQuantityPerCheckout: 50,
  enableAccountConfirmationByEmail: true,
  allowLoginWithoutConfirmation: false
};
    `,
  },

  /**
   * Error Handling Patterns
   * 
   * How to handle GraphQL errors in the configurator
   */
  errorHandlingPatterns: `
// 1. Check for errors in the response
const result = await client.mutation(createAttributeMutation, {
  input: attributeInput,
});

// Check for GraphQL errors
if (result.error) {
  logger.error("GraphQL error", { error: result.error });
  throw new Error(\`GraphQL error: \${result.error.message}\`);
}

// Check for operation-specific errors
if (result.data?.attributeCreate?.errors?.length > 0) {
  const errors = result.data.attributeCreate.errors;
  logger.error("Operation errors", { errors });
  
  // Format a readable error message
  const errorMessage = errors
    .map(err => \`\${err.field ? err.field + ': ' : ''}\${err.message}\`)
    .join('; ');
    
  throw new Error(\`Failed to create attribute: \${errorMessage}\`);
}

// Check if the expected data is missing
if (!result.data?.attributeCreate?.attribute) {
  throw new Error("Failed to create attribute: Unexpected response format");
}

// 2. Centralized error handler
const handleGraphQLError = (result, operationName) => {
  // GraphQL transport/network errors
  if (result.error) {
    logger.error(\`\${operationName} failed with GraphQL error\`, { 
      error: result.error 
    });
    throw new Error(\`\${operationName} GraphQL error: \${result.error.message}\`);
  }
  
  // Check for operation-specific errors if available
  const errorsPath = getErrorsPath(result.data, operationName);
  const errors = errorsPath ? get(result.data, errorsPath) : null;
  
  if (errors && errors.length > 0) {
    logger.error(\`\${operationName} failed with operation errors\`, { errors });
    
    const errorMessage = errors
      .map(err => \`\${err.field ? err.field + ': ' : ''}\${err.message}\`)
      .join('; ');
      
    throw new Error(\`\${operationName} failed: \${errorMessage}\`);
  }
  
  return result;
};
  `,

  /**
   * Best Practices for GraphQL in the Configurator
   */
  bestPractices: [
    "Use the repository pattern to encapsulate GraphQL operations",
    "Extract TypeScript types from your GraphQL operations using gql.tada",
    "Implement service classes that use repositories and add business logic",
    "Handle errors consistently with detailed error messages",
    "Include pagination parameters (first: 100) for queries that return lists",
    "Use fragments for reusable parts of your queries",
    "Implement filtering with the 'where' parameter for efficient queries",
    "Cache frequently used data with the cacheExchange in urql",
    "Add custom scalars like 'JSON' for specialized data types",
    "Structure your GraphQL files by domain (attributes, products, etc.)",
    "Use consistent naming for mutations (create, update, delete prefixes)",
    "Always handle both GraphQL errors and operation-specific errors",
    "Add retry logic for network failures",
    "Add logging for all GraphQL operations for easier debugging",
    "Create helper functions for common data transformations",
  ],

  /**
   * Complete example of a configurator implementation
   */
  completeExample: `
// 1. Define the GraphQL operations
const createProductTypeMutation = graphql(\`
  mutation CreateProductType($input: ProductTypeInput!) {
    productTypeCreate(input: $input) {
      productType {
        id
        name
      }
      errors {
        field
        message
      }
    }
  }
\`);

// 2. Extract TypeScript types
type ProductTypeInput = VariablesOf<typeof createProductTypeMutation>["input"];
type ProductType = NonNullable<
  NonNullable<ResultOf<typeof createProductTypeMutation>["productTypeCreate"]>["productType"]
>;

// 3. Create repository interface
interface ProductTypeRepository {
  createProductType(input: ProductTypeInput): Promise<ProductType>;
  getProductTypeByName(name: string): Promise<ProductType | null>;
}

// 4. Implement repository
class SaleorProductTypeRepository implements ProductTypeRepository {
  constructor(private client: GraphQLClient) {}
  
  async createProductType(input: ProductTypeInput): Promise<ProductType> {
    const result = await this.client.mutation(createProductTypeMutation, { input });
    
    if (result.error) {
      throw new Error(\`GraphQL error: \${result.error.message}\`);
    }
    
    const errors = result.data?.productTypeCreate?.errors;
    if (errors && errors.length > 0) {
      const errorMessage = errors
        .map(err => \`\${err.field ? err.field + ': ' : ''}\${err.message}\`)
        .join('; ');
        
      throw new Error(\`Failed to create product type: \${errorMessage}\`);
    }
    
    if (!result.data?.productTypeCreate?.productType) {
      throw new Error("Failed to create product type: Unexpected response format");
    }
    
    return result.data.productTypeCreate.productType;
  }
  
  async getProductTypeByName(name: string): Promise<ProductType | null> {
    // Implementation...
  }
}

// 5. Create service
class ProductTypeService {
  constructor(
    private productTypeRepo: ProductTypeRepository,
    private attributeService: AttributeService
  ) {}
  
  async bootstrapProductType(config: {
    name: string;
    attributes: AttributeInput[];
  }): Promise<ProductType> {
    // 1. Check if product type already exists
    const existingProductType = await this.productTypeRepo.getProductTypeByName(config.name);
    if (existingProductType) {
      logger.debug("Product type already exists", { name: config.name });
      return existingProductType;
    }
    
    // 2. Create product type
    logger.debug("Creating new product type", { name: config.name });
    const productType = await this.productTypeRepo.createProductType({
      name: config.name,
      isShippingRequired: true,
    });
    
    // 3. Create attributes if needed
    if (config.attributes && config.attributes.length > 0) {
      logger.debug("Creating attributes for product type", { 
        productTypeId: productType.id,
        attributeCount: config.attributes.length 
      });
      
      // Create all attributes with attributeService
      const attributesWithType = config.attributes.map(attr => ({
        ...attr,
        type: "PRODUCT_TYPE" as const
      }));
      
      const createdAttributes = await this.attributeService.bootstrapAttributes({
        attributeInputs: attributesWithType
      });
      
      // 4. Associate attributes with product type
      // Implementation...
    }
    
    return productType;
  }
}

// 6. Use it in the configurator
async function bootstrapConfiguration(config) {
  if (config.productTypes) {
    logger.debug(\`Bootstrapping \${config.productTypes.length} product types\`);
    
    for (const productTypeConfig of config.productTypes) {
      await productTypeService.bootstrapProductType({
        name: productTypeConfig.name,
        attributes: productTypeConfig.attributes
      });
    }
  }
}
  `,
};

// Export the patterns
module.exports = configuratorGraphQLPatterns; 