import type { Client } from "@urql/core";
import { graphql, type VariablesOf, type ResultOf } from "gql.tada";
import { logger } from "../../lib/logger";

const createChannelMutation = graphql(`
  mutation CreateChannel($input: ChannelCreateInput!) {
    channelCreate(input: $input) {
      channel {
        id
        name
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
}

export class ChannelRepository implements ChannelOperations {
  constructor(private client: Client) {}

  async createChannel(input: ChannelCreateInput) {
    const result = await this.client.mutation(createChannelMutation, {
      input,
    });

    if (!result.data?.channelCreate?.channel) {
      throw new Error("Failed to create channel", result.error);
    }

    const channel = result.data.channelCreate.channel;

    logger.info("Channel created", { channel });

    return channel;
  }

  async getChannels() {
    const result = await this.client.query(getChannelsQuery, {});
    return result.data?.channels;
  }

  async getChannelBySlug(slug: string) {
    try {
      logger.info(`Executing getChannelBySlug query for slug: ${slug}`);
      const result = await this.client.query(getChannelBySlugQuery, { slug });
      const channels = result.data?.channels;
      
      if (!channels || channels.length === 0) {
        logger.warn(`No channels found matching slug: ${slug}`);
        return null;
      }
      
      // Find exact match by slug
      const exactMatch = channels.find(channel => channel.slug === slug);
      if (exactMatch) {
        logger.info(`Found exact match for channel slug: ${slug}`, {
          id: exactMatch.id,
          name: exactMatch.name,
          slug: exactMatch.slug
        });
        return exactMatch;
      }
      
      // Return the first result if no exact match (search is approximate)
      logger.info(`No exact match for slug: ${slug}, using approximate match`, {
        id: channels[0].id,
        name: channels[0].name,
        slug: channels[0].slug
      });
      return channels[0];
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
