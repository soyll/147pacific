import type { SaleorConfig } from "../config/schema";
import { logger } from "../../lib/logger";
import type { ProductOperations, Product } from "./repository";
import type { ProductTypeService } from "../product-type/product-type-service";
import type { CategoryService } from "../category/category-service";
import type { AttributeService } from "../attribute/attribute-service";
import type { ChannelService } from "../channel/channel-service";

export interface ProductInput {
  name: string;
  description?: string;
  productType: string;
  category?: string;
  attributes?: Array<{
    attribute: string;
    values: string[];
  }>;
  channelListings?: Array<{
    channelSlug: string;
    isPublished?: boolean;
    visibleInListings?: boolean;
    isAvailableForPurchase?: boolean;
    addVariants?: boolean;
  }>;
  variants?: Array<{
    sku: string;
    name?: string;
    attributes?: Array<{
      attribute: string;
      values: string[];
    }>;
    channelListings?: Array<{
      channelSlug: string;
      price: string;
      costPrice?: string;
    }>;
  }>;
}

export class ProductService {
  constructor(
    private repository: ProductOperations,
    private productTypeService: ProductTypeService,
    private categoryService: CategoryService,
    private attributeService: AttributeService,
    private channelService: ChannelService
  ) {}

  /**
   * Formats a plain text description into the required JSONString format for Saleor GraphQL API
   * @param description Plain text description
   * @returns Formatted JSONString or undefined if no description provided
   */
  private formatDescription(description?: string): string | undefined {
    if (!description) return undefined;
    
    return JSON.stringify({
      blocks: [
        {
          data: { text: description },
          type: "paragraph"
        }
      ]
    });
  }

  private async getProductTypeId(productTypeName: string): Promise<string> {
    try {
      const productType = await this.productTypeService.bootstrapProductType({
        name: productTypeName,
        attributes: [],
      });
      return productType.id;
    } catch (error) {
      logger.error("Failed to get product type", {
        name: productTypeName,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new Error(`Product type "${productTypeName}" not found or could not be created`);
    }
  }

  private async getCategoryId(categoryName?: string): Promise<string | null> {
    if (!categoryName) return null;
    
    try {
      const category = await this.categoryService.getOrCreateCategory(categoryName);
      return category?.id || null;
    } catch (error) {
      logger.error("Failed to get category", {
        name: categoryName,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  private async prepareAttributes(
    attributeInputs?: Array<{ attribute: string; values: string[] }>
  ) {
    if (!attributeInputs || attributeInputs.length === 0) return [];

    const preparedAttributes = [];
    
    // First get all attribute IDs by querying for all names at once
    const attributeNames = attributeInputs.map(attr => attr.attribute);
    
    try {
      const attributes = await this.attributeService.getAttributesByNames({
        names: attributeNames,
        type: "PRODUCT_TYPE",
      });
      
      if (!attributes || attributes.length === 0) {
        logger.warn("No attributes found", { attributeNames });
        return [];
      }
      
      // Map attributes to their values
      for (const attrInput of attributeInputs) {
        const attributeInfo = attributes.find((attr: { name: string; id: string }) => 
          attr.name === attrInput.attribute
        );
        
        if (!attributeInfo) {
          logger.warn(`Attribute ${attrInput.attribute} not found in results`, { attributeNames });
          continue;
        }
        
        preparedAttributes.push({
          id: attributeInfo.id,
          values: attrInput.values,
        });
      }
    } catch (error) {
      logger.error("Failed to get attributes by names", {
        names: attributeNames,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }

    return preparedAttributes;
  }

  private async prepareChannelListings(
    productId: string,
    channelListings?: Array<{
      channelSlug: string;
      isPublished?: boolean;
      visibleInListings?: boolean;
      isAvailableForPurchase?: boolean;
      addVariants?: boolean;
    }>
  ) {
    if (!channelListings || channelListings.length === 0) {
      logger.warn(`No channel listings provided for product ${productId}, skipping channel association`);
      return;
    }

    logger.info(`Preparing channel listings for product ${productId}`, {
      providedChannels: channelListings.map(c => c.channelSlug)
    });

    const updateChannels = [];
    
    for (const listing of channelListings) {
      try {
        logger.info(`Retrieving channel by slug: ${listing.channelSlug}`);
        const channel = await this.channelService.getChannelBySlug(listing.channelSlug);
        
        if (!channel) {
          logger.warn(`Channel ${listing.channelSlug} not found, skipping`);
          continue;
        }

        logger.info(`Found channel for ${listing.channelSlug}`, { channelId: channel.id });
        
        const isPublished = listing.isPublished ?? true;
        const now = new Date().toISOString();
        
        updateChannels.push({
          channelId: channel.id,
          isPublished: isPublished,
          visibleInListings: listing.visibleInListings ?? true,
          isAvailableForPurchase: listing.isAvailableForPurchase ?? true,
          // Always include publishedAt and availableForPurchaseAt with proper date values
          publishedAt: now,
          availableForPurchaseAt: now
        });
      } catch (error) {
        logger.error("Failed to get channel", {
          slug: listing.channelSlug,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    if (updateChannels.length === 0) {
      logger.warn("No valid channel listings found, skipping update");
      return;
    }

    const channelListingInput = {
      updateChannels: updateChannels
    };

    try {
      logger.info("Sending product channel listing update", { 
        productId,
        channels: updateChannels.map(c => ({ 
          channelId: c.channelId,
          isPublished: c.isPublished,
          publishedAt: c.publishedAt,
          availableForPurchaseAt: c.availableForPurchaseAt
        }))
      });

      const result = await this.repository.updateProductChannelListing(productId, channelListingInput);
      
      if (result) {
        logger.info(`Successfully associated product ${productId} with ${updateChannels.length} channels`);
      } else {
        logger.warn(`Channel association may have failed for product ${productId} - no result returned`);
      }
    } catch (error) {
      logger.error("Failed to update product channel listings", {
        productId,
        error: error instanceof Error ? error.message : "Unknown error",
        input: JSON.stringify(channelListingInput)
      });
    }
  }

  private async prepareVariants(
    productId: string,
    variants?: Array<{
      sku: string;
      name?: string;
      attributes?: Array<{ attribute: string; values: string[] }>;
      channelListings?: Array<{
        channelSlug: string;
        price: string;
        costPrice?: string;
      }>;
    }>,
    isUpdate = false
  ) {
    if (!variants || variants.length === 0) return;

    // If we're updating an existing product, check if variants already exist
    // For now, simply log and return to avoid trying to create duplicates
    if (isUpdate) {
      logger.info(`Skipping variant creation for existing product ${productId} to avoid duplicate SKUs`);
      
      // Here we could implement variant updates if needed in the future
      // For example, fetch existing variants by SKU and update their attributes or other fields
      
      return;
    }

    const preparedVariants = [];

    for (const variant of variants) {
      // Process variant attributes
      const variantAttributes = await this.prepareAttributes(variant.attributes);
      
      const variantInput: any = {
        sku: variant.sku,
        name: variant.name || variant.sku,
        attributes: variantAttributes,
      };

      // Prepare channel listings for the variant if provided
      if (variant.channelListings && variant.channelListings.length > 0) {
        const channelListings = [];
        
        for (const listing of variant.channelListings) {
          try {
            const channel = await this.channelService.getChannelBySlug(listing.channelSlug);
            if (!channel) {
              logger.warn(`Channel ${listing.channelSlug} not found for variant ${variant.sku}, skipping`);
              continue;
            }

            channelListings.push({
              channelId: channel.id,
              price: listing.price,
              costPrice: listing.costPrice,
            });
          } catch (error) {
            logger.error("Failed to get channel for variant", {
              slug: listing.channelSlug,
              variantSku: variant.sku,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }
        
        // Add channel listings to variant input if any were successfully processed
        if (channelListings.length > 0) {
          variantInput.channelListings = channelListings;
        }
      }

      preparedVariants.push(variantInput);
    }

    if (preparedVariants.length === 0) {
      logger.warn("No valid variants to create, skipping");
      return;
    }

    try {
      await this.repository.createProductVariants(productId, preparedVariants);
      logger.debug("Created product variants", { 
        productId,
        count: preparedVariants.length 
      });
    } catch (error) {
      logger.error("Failed to create product variants", {
        productId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async upsertProduct(input: ProductInput): Promise<Product> {
    logger.debug("Upserting product", { name: input.name });

    try {
      // First check if product already exists
      const existingProduct = await this.repository.getProductByName(input.name);

      if (existingProduct) {
        logger.info("Product already exists, updating", {
          id: existingProduct.id,
          name: existingProduct.name,
        });

        // Get category ID (optional)
        const categoryId = input.category
          ? await this.getCategoryId(input.category)
          : null;

        // Prepare product attributes
        const attributes = await this.prepareAttributes(input.attributes);

        // Update product details - note: productType field is excluded since it can't be changed
        const productInput = {
          name: input.name,
          description: this.formatDescription(input.description),
          category: categoryId ? categoryId : undefined,
          attributes: attributes,
        };

        // Update the product
        const updatedProduct = await this.repository.updateProduct(existingProduct.id, productInput);
        
        // Update channel listings
        await this.prepareChannelListings(existingProduct.id, input.channelListings);

        // Update/create variants if provided
        if (input.variants && input.variants.length > 0) {
          await this.prepareVariants(existingProduct.id, input.variants, true);
        }

        logger.info("Successfully updated product", {
          id: existingProduct.id,
          name: updatedProduct.name
        });

        return updatedProduct;
      }

      logger.debug("Creating new product", { name: input.name });

      // Get product type ID
      const productTypeId = await this.getProductTypeId(input.productType);

      // Get category ID (optional)
      const categoryId = input.category
        ? await this.getCategoryId(input.category)
        : null;

      // Prepare product attributes
      const attributes = await this.prepareAttributes(input.attributes);

      // Create product
      const productInput = {
        name: input.name,
        description: this.formatDescription(input.description),
        productType: productTypeId,
        category: categoryId ? categoryId : undefined,
        attributes: attributes,
      };

      // Create the product
      const createdProduct = await this.repository.createProduct(productInput);

      // Set up channel listings
      await this.prepareChannelListings(createdProduct.id, input.channelListings);

      // Create variants
      await this.prepareVariants(createdProduct.id, input.variants, false);

      return createdProduct;
    } catch (error) {
      logger.error("Failed to upsert product", {
        name: input.name,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async bootstrapProducts(products: ProductInput[]): Promise<Product[]> {
    logger.info("Bootstrapping products", { count: products.length });

    const results = [];

    for (const product of products) {
      try {
        const result = await this.upsertProduct(product);
        results.push(result);
      } catch (error) {
        logger.error("Failed to bootstrap product", {
          name: product.name,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    logger.info("Finished bootstrapping products", {
      success: results.length,
      total: products.length,
    });

    return results;
  }
} 