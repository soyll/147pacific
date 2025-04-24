import type { Client } from "@urql/core";
import { graphql, type VariablesOf, type ResultOf } from "gql.tada";
import { logger } from "../../lib/logger";

const createAttributeMutation = graphql(`
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
`);

export type AttributeCreateInput = VariablesOf<
  typeof createAttributeMutation
>["input"];

type AttributeFragment = NonNullable<
  NonNullable<
    NonNullable<ResultOf<typeof createAttributeMutation>>["attributeCreate"]
  >["attribute"]
>;

export type Attribute = AttributeFragment;

const getAttributesByNamesQuery = graphql(`
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
`);

const getAttributeByNameQuery = graphql(`
  query GetAttributeByName($name: String!, $type: AttributeTypeEnum) {
    attributes(
      first: 1
      where: { name: { eq: $name }, type: { eq: $type } }
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
                id
              }
            }
          }
        }
      }
    }
  }
`);

export type GetAttributesByNamesInput = VariablesOf<
  typeof getAttributesByNamesQuery
>;

export interface AttributeOperations {
  createAttribute(attributeInput: AttributeCreateInput): Promise<Attribute>;
  getAttributesByNames(
    input: GetAttributesByNamesInput
  ): Promise<Attribute[] | null | undefined>;
  getAttributeByName(
    name: string,
    type?: string
  ): Promise<Attribute | null | undefined>;
}

export class AttributeRepository implements AttributeOperations {
  constructor(private client: Client) {}

  async createAttribute(
    attributeInput: AttributeCreateInput
  ): Promise<Attribute> {
    try {
      const result = await this.client.mutation(createAttributeMutation, {
        input: attributeInput,
      });

      if (result.error) {
        logger.error("GraphQL error creating attribute", {
          name: attributeInput.name,
          error: result.error.message,
          graphQLErrors: result.error.graphQLErrors?.map((e: any) => e.message).join(", ") || "None"
        });
        throw new Error(`Failed to create attribute: ${result.error.message}`);
      }

      if (result.data?.attributeCreate?.errors && result.data.attributeCreate.errors.length > 0) {
        const errors = result.data.attributeCreate.errors;
        logger.error("Errors returned when creating attribute", {
          name: attributeInput.name,
          errors: errors.map((e: any) => `${e.field || 'general'}: ${e.message}`).join(", ")
        });
        
        // Check if this is a duplicate attribute (common error)
        const isDuplicate = errors.some((e: any) => 
          e.message.includes("already exists") || 
          e.message.includes("duplicate")
        );
        
        if (isDuplicate) {
          // If it's a duplicate, try to fetch the existing attribute instead of failing
          logger.info("Attribute appears to be a duplicate, trying to fetch existing one", {
            name: attributeInput.name
          });
          
          const existingAttribute = await this.getAttributeByName(attributeInput.name, attributeInput.type);
          if (existingAttribute) {
            logger.info("Found existing attribute instead of creating new one", {
              name: existingAttribute.name,
              id: existingAttribute.id
            });
            return existingAttribute;
          }
        }
        
        throw new Error(`Failed to create attribute: ${errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')}`);
      }

      if (!result.data?.attributeCreate?.attribute) {
        logger.error("No attribute data returned", {
          name: attributeInput.name
        });
        throw new Error("Failed to create attribute: No data returned");
      }

      logger.info("Attribute created", {
        name: result.data.attributeCreate.attribute.name,
      });

      return result.data.attributeCreate.attribute as Attribute;
    } catch (error) {
      // If we get here, it's an unexpected error not handled above
      logger.error("Exception creating attribute", {
        name: attributeInput.name,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      
      // Rethrow the error so the caller knows something failed
      throw error;
    }
  }

  async getAttributesByNames(input: GetAttributesByNamesInput) {
    const result = await this.client.query(getAttributesByNamesQuery, {
      names: input.names,
      type: input.type,
    });

    return result.data?.attributes?.edges?.map(
      (edge) => edge.node as Attribute
    );
  }

  async getAttributeByName(name: string, type?: string) {
    try {
      const result = await this.client.query(getAttributeByNameQuery, {
        name,
        type: type || null,
      });

      return result.data?.attributes?.edges?.[0]?.node as Attribute | null | undefined;
    } catch (error) {
      logger.error("Failed to get attribute by name", {
        name,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }
}
