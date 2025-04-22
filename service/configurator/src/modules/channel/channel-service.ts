import { object } from "../../lib/utils/object";
import type { SaleorConfig } from "../config/schema";
import type { ChannelOperations } from "./repository";
import { logger } from "../../lib/logger";

type ChannelInput = NonNullable<SaleorConfig["channels"]>[number];

export class ChannelService {
  constructor(private repository: ChannelOperations) {}

  private async getExistingChannel(name: string) {
    logger.debug("Looking up existing channel", { name });
    const channels = await this.repository.getChannels();
    const existingChannel = channels?.find((channel) => channel.name === name);

    if (existingChannel) {
      logger.debug("Found existing channel", {
        id: existingChannel.id,
        name: existingChannel.name,
      });
    } else {
      logger.debug("Channel not found", { name });
    }

    return existingChannel;
  }

  async getChannelBySlug(slug: string) {
    logger.info("Looking up channel by slug", { slug });
    try {
      const channel = await this.repository.getChannelBySlug(slug);
      
      if (channel) {
        logger.info("Found channel by slug", {
          id: channel.id,
          name: channel.name,
          slug: channel.slug
        });
      } else {
        logger.warn("Channel not found by slug", { slug });
      }
      
      return channel;
    } catch (error) {
      logger.error("Error finding channel by slug", {
        slug,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  async getOrCreate(input: ChannelInput): Promise<Channel> {
    const { slug } = input;
    logger.info("Getting or creating channel", { slug });

    const existingChannel = await this.repository.getChannelBySlug(slug);

    if (existingChannel) {
      logger.info("Found existing channel", { 
        id: existingChannel.id, 
        name: existingChannel.name,
        slug: existingChannel.slug,
        isActive: existingChannel.isActive
      });
      
      // If the channel exists but is not active, activate it
      if (!existingChannel.isActive) {
        logger.info("Channel exists but is inactive. Activating channel", { 
          id: existingChannel.id, 
          slug: existingChannel.slug 
        });
        
        try {
          await this.repository.activateChannel(existingChannel.id);
          logger.info("Successfully activated existing channel", { 
            id: existingChannel.id, 
            slug: existingChannel.slug 
          });
        } catch (error) {
          logger.error("Failed to activate existing channel", { 
            id: existingChannel.id, 
            slug: existingChannel.slug,
            error: error instanceof Error ? error.message : "Unknown error"
          });
        }
      }
      
      return this.updateChannel(existingChannel.id, input);
    }

    logger.info("Channel not found, creating new one", { slug });

    try {
      // Create the channel with isActive flag
      const channel = await this.repository.createChannel({
        name: input.name,
        slug: input.slug,
        currencyCode: input.currencyCode,
        defaultCountry: input.defaultCountry,
        isActive: input.isActive ?? true
      });

      // Ensure the channel is activated even if isActive was set
      try {
        logger.info("Activating newly created channel", { id: channel.id, slug: channel.slug });
        await this.repository.activateChannel(channel.id);
        logger.info("Successfully activated new channel", { id: channel.id, slug: channel.slug });
      } catch (error) {
        logger.error("Failed to activate new channel", { 
          id: channel.id, 
          slug: channel.slug,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }

      logger.info("Channel created successfully", {
        id: channel.id,
        name: channel.name,
        slug: channel.slug,
        isActive: true
      });

      return channel;
    } catch (error) {
      logger.error("Failed to create channel", {
        slug,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  private async updateChannel(id: string, input: ChannelInput) {
    logger.info("Preparing channel update", { id, name: input.name, slug: input.slug });
    const settings = input.settings ?? {};

    const updateInput = object.filterUndefinedValues({
      name: input.name,
      slug: input.slug,
      defaultCountry: input.defaultCountry,
      isActive: input.isActive,
      orderSettings:
        Object.keys(settings).length > 0
          ? object.filterUndefinedValues({
              automaticallyConfirmAllNewOrders:
                settings.automaticallyConfirmAllNewOrders,
              automaticallyFulfillNonShippableGiftCard:
                settings.automaticallyFulfillNonShippableGiftCard,
              expireOrdersAfter: settings.expireOrdersAfter?.toString(),
              deleteExpiredOrdersAfter:
                settings.deleteExpiredOrdersAfter?.toString(),
              markAsPaidStrategy: settings.markAsPaidStrategy,
              allowUnpaidOrders: settings.allowUnpaidOrders,
              includeDraftOrderInVoucherUsage:
                settings.includeDraftOrderInVoucherUsage,
            })
          : undefined,
      checkoutSettings:
        Object.keys(settings).length > 0
          ? object.filterUndefinedValues({
              useLegacyErrorFlow: settings.useLegacyErrorFlow,
              automaticallyCompleteFullyPaidCheckouts:
                settings.automaticallyCompleteFullyPaidCheckouts,
            })
          : undefined,
      paymentSettings: settings.defaultTransactionFlowStrategy
        ? {
            defaultTransactionFlowStrategy:
              settings.defaultTransactionFlowStrategy,
          }
        : undefined,
      stockSettings: settings.allocationStrategy
        ? { allocationStrategy: settings.allocationStrategy }
        : undefined,
    });

    logger.info("Updating channel", {
      id,
      name: input.name,
      slug: input.slug,
      isActive: input.isActive,
      hasOrderSettings: !!updateInput.orderSettings,
      hasCheckoutSettings: !!updateInput.checkoutSettings,
      hasPaymentSettings: !!updateInput.paymentSettings,
      hasStockSettings: !!updateInput.stockSettings,
    });

    try {
      const updatedChannel = await this.repository.updateChannel(
        id,
        updateInput
      );
      logger.info("Successfully updated channel", {
        id,
        name: updatedChannel?.name,
        slug: updatedChannel?.slug,
        isActive: updatedChannel?.isActive
      });
      return updatedChannel;
    } catch (error) {
      logger.error("Failed to update channel", {
        error: error instanceof Error ? error.message : "Unknown error",
        id,
        name: input.name,
        slug: input.slug,
        isActive: input.isActive
      });
      throw error;
    }
  }

  async bootstrapChannels(inputs: ChannelInput[]) {
    logger.info("Bootstrapping channels", { 
      count: inputs.length,
      channelSlugs: inputs.map(input => input.slug)
    });
    
    try {
      const channels = await Promise.all(
        inputs.map((input) => this.getOrCreate(input))
      );
      
      logger.info("Successfully bootstrapped all channels", {
        count: channels.length,
        channelDetails: channels.map(channel => ({
          id: channel.id,
          name: channel.name,
          slug: channel.slug,
          isActive: channel.isActive
        }))
      });
      
      return channels;
    } catch (error) {
      logger.error("Failed to bootstrap channels", {
        error: error instanceof Error ? error.message : "Unknown error",
        count: inputs.length,
        channelSlugs: inputs.map(input => input.slug)
      });
      throw error;
    }
  }
}
