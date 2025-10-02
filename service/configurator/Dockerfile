FROM node:20-alpine

WORKDIR /app

# Copy package.json and lock file
COPY package.json ./

# Create schema directory
RUN mkdir -p /app/schema

# Create a dummy fetch-schema script to avoid errors
RUN mkdir -p /app/src/lib/graphql && \
    echo 'console.log("Using provided schema instead of fetching");' > /app/src/lib/graphql/fetch-schema.ts

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV USE_LOCAL_SCHEMA=true
ENV SCHEMA_PATH=/app/schema/schema.graphql
ENV LOG_LEVEL=info

# Command to run the application - skip schema fetch completely
CMD ["sh", "-c", "echo \"Using schema provided by volume mount\" && npm run bootstrap && tail -f /dev/null"] 