# Base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable Corepack and install the specified pnpm version directly
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN corepack prepare pnpm@$(cat package.json | jq -r '.engines.pnpm') --activate
RUN pnpm install --frozen-lockfile --prefer-offline

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Re-enable Corepack in the builder stage and install pnpm
RUN corepack enable
RUN corepack prepare pnpm@$(cat package.json | jq -r '.engines.pnpm') --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy schema locally for GraphQL code generation
COPY schema.graphql ./

# Set environment variables for Next.js
ENV NEXT_OUTPUT=standalone
ARG NEXT_PUBLIC_SALEOR_API_URL
ENV NEXT_PUBLIC_SALEOR_API_URL=${NEXT_PUBLIC_SALEOR_API_URL}
ARG NEXT_PUBLIC_STOREFRONT_URL
ENV NEXT_PUBLIC_STOREFRONT_URL=${NEXT_PUBLIC_STOREFRONT_URL}

# Build the application
RUN pnpm run generate
RUN pnpm build

# Production image, copy all the files and run Next.js
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_PUBLIC_SALEOR_API_URL=${NEXT_PUBLIC_SALEOR_API_URL}
ENV NEXT_PUBLIC_STOREFRONT_URL=${NEXT_PUBLIC_STOREFRONT_URL}

# Add non-root user and set permissions
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app

# Create .next directory and set permissions before switching user
RUN mkdir .next && chown nextjs:nodejs .next

USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

CMD ["node", "server.js"]