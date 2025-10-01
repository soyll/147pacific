import { logger } from "../lib/logger";
import type { ServiceContainer } from "./service-container";
import { authenticate } from "../lib/graphql/client";

/**
 * @description Parsing the configuration and triggering the commands.
 */
export class SaleorConfigurator {
  constructor(private readonly services: ServiceContainer) {}

  async bootstrap() {
    logger.debug("Starting bootstrap process");
    
    // Authenticate first
    logger.debug("Authenticating with Saleor API");
    try {
      await authenticate();
      logger.debug("Authentication successful");
    } catch (error) {
      logger.error("Authentication failed", { error });
      throw error;
    }
    
    const config = await this.services.configStorage.load();
    logger.debug("Configuration loaded", { config });

    const bootstrapTasks = [];

    if (config.shop) {
      logger.debug("Bootstrapping shop settings");
      bootstrapTasks.push(this.services.shop.updateSettings(config.shop));
    }

    if (config.productTypes) {
      logger.debug(`Bootstrapping ${config.productTypes.length} product types`);
      bootstrapTasks.push(
        Promise.all(
          config.productTypes.map((productType) =>
            this.services.productType.bootstrapProductType({
              name: productType.name,
              attributes: productType.attributes,
            })
          )
        )
      );
    }

    if (config.channels) {
      logger.debug(`Bootstrapping ${config.channels.length} channels`);
      bootstrapTasks.push(
        this.services.channel.bootstrapChannels(config.channels)
      );
    }

    if (config.pageTypes) {
      logger.debug(`Bootstrapping ${config.pageTypes.length} page types`);
      bootstrapTasks.push(
        Promise.all(
          config.pageTypes.map((pageType) =>
            this.services.pageType.bootstrapPageType(pageType)
          )
        )
      );
    }

    if (config.categories) {
      logger.debug(`Bootstrapping ${config.categories.length} categories`);
      bootstrapTasks.push(
        this.services.category.bootstrapCategories(config.categories)
      );
    }

    try {
      // First execute all prerequisite tasks
      await Promise.all(bootstrapTasks);
      logger.info("Core bootstrap tasks completed successfully");

      // Then process products if they exist (products depend on previous components)
      if (config.products && config.products.length > 0) {
        logger.debug(`Bootstrapping ${config.products.length} products`);
        await this.services.product.bootstrapProducts(config.products);
        logger.info("Product bootstrap completed successfully");
      }

      logger.info("Complete bootstrap process completed successfully");
    } catch (error) {
      logger.error("Bootstrap process failed", { 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  async retrieve() {
    logger.info("Starting configuration retrieval");
    try {
      const config = await this.services.configuration.retrieve();
      logger.info("Configuration retrieved successfully");
      return config;
    } catch (error) {
      logger.error("Failed to retrieve configuration", { 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }
}
