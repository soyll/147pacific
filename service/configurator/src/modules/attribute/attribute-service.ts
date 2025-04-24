import type { AttributeInput } from "../config/schema";
import { logger } from "../../lib/logger";
import type {
  AttributeCreateInput,
  AttributeOperations,
  Attribute,
} from "./repository";

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
        `Entity type is required for reference attribute ${input.name}`
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
      values: input.values.map((value: { name: string }) => ({
        name: value.name,
      })),
    };
  }

  return base;
};

export class AttributeService {
  constructor(private repository: AttributeOperations) {}

  async bootstrapAttributes({
    attributeInputs,
  }: {
    attributeInputs: AttributeInput[];
  }) {
    logger.debug("Bootstrapping attributes", {
      count: attributeInputs.length,
    });

    const attributeNames = attributeInputs.map(attr => attr.name);
    const attributeType = attributeInputs[0]?.type;
    
    const existingAttributes = await this.repository.getAttributesByNames({
      names: attributeNames,
      type: attributeType,
    }) || [];
    
    logger.debug("Found existing attributes", {
      count: existingAttributes.length,
    });
    
    const existingAttributeNames = new Set(existingAttributes.map(attr => attr.name));
    
    const attributesToCreate = attributeInputs.filter(
      attr => !existingAttributeNames.has(attr.name)
    );
    
    logger.debug("Creating new attributes", {
      count: attributesToCreate.length,
    });

    const results = [];
    // Create attributes one by one to better handle errors
    for (const attribute of attributesToCreate) {
      try {
        const attributeInput = createAttributeInput(attribute);
        logger.debug("Creating attribute", { name: attributeInput.name });
        const newAttribute = await this.repository.createAttribute(attributeInput);
        results.push(newAttribute);
      } catch (error) {
        logger.error("Failed to create attribute", {
          name: attribute.name,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        // Continue with other attributes instead of stopping the entire process
      }
    }

    return [...existingAttributes, ...results];
  }

  async getAttributeByName(name: string) {
    try {
      const attribute = await this.repository.getAttributeByName(name);
      return attribute;
    } catch (error) {
      logger.error("Failed to get attribute by name", {
        name,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  async getAttributesByNames(input: { names: string[], type?: string }) {
    try {
      const attributes = await this.repository.getAttributesByNames({
        names: input.names,
        type: input.type || null
      });
      return attributes;
    } catch (error) {
      logger.error("Failed to get attributes by names", {
        names: input.names,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return [];
    }
  }
}
