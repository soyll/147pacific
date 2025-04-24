import type { Client } from "@urql/core";
import { graphql, type VariablesOf, type ResultOf } from "gql.tada";
import { logger } from "../../lib/logger";

const createChannelMutation = graphql(`
  mutation CreateChannel($input: ChannelCreateInput!) {
    channelCreate(input: $input) {
      channel {
        id
        name
        slug
        isActive
      }
      errors {
        field
        message
        code
      }
    }
  }
`);

export type ChannelCreateInput = VariablesOf<
  typeof createChannelMutation
>["input"];

const getChannelsQuery = graphql(`
  query GetChannels {
    channels {
      id
      name
      slug
      isActive
      currencyCode
      defaultCountry {
        code
      }
    }
  }
`);

export type Channel = NonNullable<
  ResultOf<typeof getChannelsQuery>["channels"]
>[number];

const getChannelBySlugQuery = graphql(`
  query GetChannelBySlug($slug: String!) {
    channels(filter: { search: $slug }) {
      id
      name
      slug
      currencyCode
      defaultCountry {
        code
      }
    }
  }
`);

const updateChannelMutation = graphql(`
  mutation UpdateChannel($id: ID!, $input: ChannelUpdateInput!) {
    channelUpdate(id: $id, input: $input) {
      channel {
        id
        name
        slug
        isActive
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
`);

type ChannelUpdateInput = VariablesOf<typeof updateChannelMutation>["input"];

export interface ChannelOperations {
  createChannel(input: ChannelCreateInput): Promise<Channel>;
  getChannels(): Promise<Channel[] | null | undefined>;
  getChannelBySlug(slug: string): Promise<Channel | null | undefined>;
  updateChannel(
    id: string,
    input: ChannelUpdateInput
  ): Promise<Channel | null | undefined>;
  activateChannel(id: string): Promise<Channel | null | undefined>;
}

export class ChannelRepository implements ChannelOperations {
  constructor(private client: Client) {}

  async createChannel(input: ChannelCreateInput) {
    try {
      logger.info("Creating channel", { 
        name: input.name, 
        slug: input.slug,
        isActive: input.isActive ?? true
      });
      
      const result = await this.client.mutation(createChannelMutation, {
        input,
      });

      if (result.error) {
        logger.error("GraphQL error creating channel", { 
          error: result.error,
          name: input.name,
          slug: input.slug
        });
        throw new Error(`Failed to create channel: ${result.error.message}`);
      }

      if (!result.data?.channelCreate?.channel) {
        const errors = result.data?.channelCreate?.errors;
        if (errors && errors.length > 0) {
          logger.error("API error creating channel", { 
            errors,
            name: input.name,
            slug: input.slug
          });
          throw new Error(`Failed to create channel: ${errors.map(e => e.message).join(", ")}`);
        }
        
        throw new Error("Failed to create channel: No channel returned and no error provided");
      }

      const channel = result.data.channelCreate.channel;

      logger.info("Channel created successfully", { 
        id: channel.id,
        name: channel.name,
        slug: input.slug
      });

      return channel;
    } catch (error) {
      logger.error("Exception creating channel", {
        name: input.name,
        slug: input.slug,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  async activateChannel(id: string) {
    logger.info("Activating channel", { id });
    
    try {
      const result = await this.client.mutation(`
        mutation ChannelActivate($id: ID!) {
          channelActivate(id: $id) {
            channel {
              id
              name
              slug
              isActive
            }
            errors {
              field
              message
              code
            }
          }
        }
      `, { id });

      if (result.error) {
        logger.error("Failed to activate channel", { 
          id, 
          error: result.error
        });
        throw new Error(`Failed to activate channel: ${result.error.message}`);
      }

      if (result.data?.channelActivate?.errors?.length) {
        logger.error("Failed to activate channel", {
          id,
          errors: result.data.channelActivate.errors
        });
        throw new Error(`Failed to activate channel: ${result.data.channelActivate.errors.map(e => e.message).join(", ")}`);
      }

      logger.info("Channel activated successfully", { 
        channel: result.data?.channelActivate?.channel 
      });
      
      return result.data?.channelActivate?.channel;
    } catch (error) {
      logger.error("Exception activating channel", {
        id,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  async getChannels() {
    const result = await this.client.query(getChannelsQuery, {});
    return result.data?.channels;
  }

  async getChannelBySlug(slug: string) {
    try {
      logger.info(`Looking for channel with slug: ${slug}`);
      
      const result = await this.client.query(getChannelsQuery, {});
      const channels = result.data?.channels;
      
      if (!channels || channels.length === 0) {
        logger.warn(`No channels found in the system`);
        return null;
      }
      
      logger.info(`Found ${channels.length} channels, searching for slug: ${slug}`);
      
      const exactMatch = channels.find(channel => channel.slug === slug);
      
      if (exactMatch) {
        logger.info(`Found channel with slug: ${slug}`, {
          id: exactMatch.id,
          name: exactMatch.name,
          slug: exactMatch.slug,
          isActive: exactMatch.isActive
        });
        return exactMatch;
      }
      
      logger.warn(`No channel found with slug: ${slug}`);
      return null;
    } catch (error) {
      logger.error("Failed to get channel by slug", {
        slug,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  async updateChannel(id: string, input: ChannelUpdateInput) {
    const result = await this.client.mutation(updateChannelMutation, {
      id,
      input,
    });

    if (result.error) {
      throw new Error(`Failed to update channel: ${result.error.message}`);
    }

    if (result.data?.channelUpdate?.errors.length) {
      throw new Error(
        `Failed to update channel: ${result.data.channelUpdate.errors
          .map((e) => e.message)
          .join(", ")}`
      );
    }

    return result.data?.channelUpdate?.channel;
  }
}
