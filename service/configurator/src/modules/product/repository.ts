import type { Client } from "@urql/core";
import { graphql, type VariablesOf, type ResultOf } from "gql.tada";
import { logger } from "../../lib/logger";

const createProductMutation = graphql(`
  mutation CreateProduct($input: ProductCreateInput!) {
    productCreate(input: $input) {
      product {
        id
        name
        slug
      }
      errors {
        message
        field
        code
      }
    }
  }
`);

export type Product = NonNullable<
  NonNullable<ResultOf<typeof createProductMutation>["productCreate"]>["product"]
>;

export type ProductCreateInput = VariablesOf<typeof createProductMutation>["input"];

const getProductByNameQuery = graphql(`
  query GetProductByName($name: String!, $channel: String) {
    products(filter: { search: $name }, channel: $channel, first: 1) {
      edges {
        node {
          id
          name
          slug
          description
          productType {
            id
            name
          }
          category {
            id
            name
          }
        }
      }
    }
  }
`);

const updateProductMutation = graphql(`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    productUpdate(id: $id, input: $input) {
      product {
        id
        name
        slug
      }
      errors {
        message
        field
        code
      }
    }
  }
`);

const productVariantBulkCreateMutation = graphql(`
  mutation ProductVariantBulkCreate($productId: ID!, $variants: [ProductVariantBulkCreateInput!]!) {
    productVariantBulkCreate(product: $productId, variants: $variants) {
      productVariants {
        id
        name
        sku
      }
      errors {
        message
        field
        code
      }
    }
  }
`);

const productChannelListingUpdateMutation = graphql(`
  mutation ProductChannelListingUpdate($id: ID!, $input: ProductChannelListingUpdateInput!) {
    productChannelListingUpdate(id: $id, input: $input) {
      product {
        id
        name
      }
      errors {
        message
        field
        code
      }
    }
  }
`);

export interface ProductOperations {
  createProduct(input: ProductCreateInput): Promise<Product>;
  getProductByName(name: string, channel?: string): Promise<Product | null | undefined>;
  updateProduct(id: string, input: any): Promise<Product>;
  createProductVariants(productId: string, variants: any[]): Promise<any>;
  updateProductChannelListing(productId: string, input: any): Promise<any>;
}

export class ProductRepository implements ProductOperations {
  constructor(private client: Client) {}

  async createProduct(input: ProductCreateInput) {
    try {
      // Log basic request information
      logger.debug("Creating product with GraphQL", {
        name: input.name,
        productTypeId: input.productTypeId,
      });

      try {
        const result = await this.client.mutation(createProductMutation, {
          input,
        });

        // Handle empty responses
        if (!result) {
          logger.error("Empty response received from GraphQL server", { name: input.name });
          throw new Error("Failed to create product: Empty response from server");
        }

        // Handle GraphQL errors
        if (result.error) {
          logger.error("GraphQL error in createProduct", {
            message: result.error.message,
            name: input.name,
            graphQLErrors: result.error.graphQLErrors?.map((e: { message: string }) => e.message).join(", ") || "None",
            networkError: result.error.networkError ? String(result.error.networkError) : "None"
          });
          throw new Error(`Failed to create product: [GraphQL] ${result.error.message}`);
        }

        // Handle API-level errors
        if (result.data?.productCreate?.errors && result.data.productCreate.errors.length > 0) {
          const errors = result.data.productCreate.errors;
          logger.error("Product creation returned API errors", {
            name: input.name,
            errors: errors.map((e: any) => `${e.field || 'general'}: ${e.message} (${e.code || 'unknown'})`).join(", ")
          });
          throw new Error(`Failed to create product: ${errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')}`);
        }

        // Handle missing product
        if (!result.data?.productCreate?.product) {
          logger.error("Product creation returned no product data", {
            name: input.name,
            hasData: !!result.data,
            hasProductCreate: !!result.data?.productCreate
          });
          throw new Error("Failed to create product: Unknown error");
        }

        const product = result.data.productCreate.product;

        logger.info("Product created successfully", {
          name: product.name,
          id: product.id,
        });

        return product;
      } catch (graphQLError) {
        // Special handling for JSON parse errors which often indicate network or server issues
        if (graphQLError instanceof Error && 
            (graphQLError.message.includes('Unexpected token') || 
             graphQLError.message.includes('Expecting value'))) {
          logger.error("JSON parsing error in GraphQL response", {
            error: graphQLError.message,
            name: input.name
          });
          throw new Error(`Failed to create product: Empty or invalid response from GraphQL server. Check network connectivity and API URL.`);
        }
        throw graphQLError;
      }
    } catch (error) {
      logger.error("Error in createProduct", {
        error: error instanceof Error ? error.message : "Unknown error",
        input: JSON.stringify(input)
      });
      throw error;
    }
  }

  async getProductByName(name: string, channel?: string) {
    try {
      const result = await this.client.query(getProductByNameQuery, {
        name,
        channel,
      });

      if (result.error) {
        logger.error("Error fetching product by name", {
          name,
          error: result.error.message,
        });
        return null;
      }

      return result.data?.products?.edges?.[0]?.node;
    } catch (error) {
      logger.error("Error in getProductByName", {
        name,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      return null;
    }
  }

  async updateProduct(id: string, input: any) {
    try {
      const result = await this.client.mutation(updateProductMutation, {
        id,
        input,
      });

      if (result.error) {
        throw new Error(`Failed to update product: ${result.error.message}`);
      }

      if (result.data?.productUpdate?.errors && result.data.productUpdate.errors.length > 0) {
        const errors = result.data.productUpdate.errors;
        throw new Error(`Failed to update product: ${errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')}`);
      }

      if (!result.data?.productUpdate?.product) {
        throw new Error("Failed to update product: Unknown error");
      }

      const product = result.data.productUpdate.product;

      logger.info("Product updated", {
        name: product.name,
        id: product.id,
      });

      return product;
    } catch (error) {
      logger.error("Error in updateProduct", {
        id,
        error: error instanceof Error ? error.message : "Unknown error",
        input: JSON.stringify(input)
      });
      throw error;
    }
  }

  async createProductVariants(productId: string, variants: any[]) {
    try {
      const result = await this.client.mutation(productVariantBulkCreateMutation, {
        productId,
        variants,
      });

      if (result.error) {
        throw new Error(`Failed to create product variants: ${result.error.message}`);
      }

      if (result.data?.productVariantBulkCreate?.errors && result.data.productVariantBulkCreate.errors.length > 0) {
        const errors = result.data.productVariantBulkCreate.errors;
        throw new Error(`Failed to create product variants: ${errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')}`);
      }

      if (!result.data?.productVariantBulkCreate?.productVariants) {
        throw new Error("Failed to create product variants: Unknown error");
      }

      return result.data.productVariantBulkCreate.productVariants;
    } catch (error) {
      logger.error("Error in createProductVariants", {
        productId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async updateProductChannelListing(productId: string, input: any) {
    try {
      logger.info("Executing productChannelListingUpdate mutation", {
        productId,
        input: JSON.stringify(input)
      });

      const result = await this.client.mutation(productChannelListingUpdateMutation, {
        id: productId,
        input,
      });

      if (result.error) {
        logger.error("GraphQL error in updateProductChannelListing", {
          message: result.error.message,
          productId,
          graphQLErrors: result.error.graphQLErrors?.map((e: { message: string }) => e.message).join(", ") || "None",
          networkError: result.error.networkError ? String(result.error.networkError) : "None"
        });
        throw new Error(`Failed to update product channel listing: ${result.error.message}`);
      }

      if (result.data?.productChannelListingUpdate?.errors && result.data.productChannelListingUpdate.errors.length > 0) {
        const errors = result.data.productChannelListingUpdate.errors;
        logger.error("Product channel listing update returned API errors", {
          productId,
          errors: errors.map((e: any) => `${e.field || 'general'}: ${e.message} (${e.code || 'unknown'})`).join(", ")
        });
        throw new Error(`Failed to update product channel listing: ${errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')}`);
      }

      if (!result.data?.productChannelListingUpdate?.product) {
        logger.warn("Product channel listing update returned no product data", {
          productId,
          hasData: !!result.data,
          hasUpdate: !!result.data?.productChannelListingUpdate
        });
      } else {
        logger.info("Product channel listing updated successfully", {
          productId,
          channelCount: input.updateChannels?.length || 0
        });
      }

      return result.data?.productChannelListingUpdate?.product;
    } catch (error) {
      logger.error("Error in updateProductChannelListing", {
        productId,
        error: error instanceof Error ? error.message : "Unknown error",
        input: JSON.stringify(input)
      });
      throw error;
    }
  }
} 