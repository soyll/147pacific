import { logger } from "../lib/logger";
import type { ServiceContainer } from "./service-container";

/**
 * @description Parsing the configuration and triggering the commands.
 */
export class SaleorConfigurator {
  constructor(private readonly services: ServiceContainer) {}

  async bootstrap() {
    logger.info("Starting bootstrap process");
    try {
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
            config.productTypes.map((productType: any) =>
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
            config.pageTypes.map((pageType: any) =>
              this.services.pageType.bootstrapPageType(pageType).catch((error: Error) => {
                logger.error(`Failed to bootstrap page type "${pageType.name}"`, { 
                  error: error.message,
                  stack: error.stack,
                  pageType 
                });
                throw error;
              })
            )
          )
        );
      }

      if (config.attributes) {
        logger.debug(`Bootstrapping ${config.attributes.length} attributes`);
        bootstrapTasks.push(
          Promise.all(
            config.attributes.map((attribute: any) => {
              if (!attribute.type) {
                const error = new Error(
                  "When bootstrapping attributes, the type (PRODUCT_TYPE or PAGE_TYPE) is required"
                );
                logger.error("Attribute type missing", { attribute });
                throw error;
              }

              return this.services.attribute.bootstrapAttributes({
                attributeInputs: [attribute],
              }).catch((error: Error) => {
                logger.error(`Failed to bootstrap attribute "${attribute.name}"`, { 
                  error: error.message,
                  stack: error.stack,
                  attribute 
                });
                throw error;
              });
            })
          )
        );
      }

      try {
        await Promise.all(bootstrapTasks);
        logger.info("Bootstrap process completed successfully");
      } catch (error: unknown) {
        const err = error as Error;
        logger.error("Bootstrap process failed", { 
          error: err.message || String(error),
          stack: err.stack || 'No stack trace',
          name: err.name || 'Unknown error'
        });
        throw error;
      }
    } catch (error: unknown) {
      const err = error as Error;
      logger.error("Failed to load configuration or bootstrap", { 
        error: err.message || String(error),
        stack: err.stack || 'No stack trace',
        name: err.name || 'Unknown error'
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
      logger.error("Failed to retrieve configuration", { error });
      throw error;
    }
  }
}
