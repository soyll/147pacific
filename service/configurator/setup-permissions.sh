#!/bin/bash
set -e

echo "Setting up Saleor Configurator permissions..."

# Get the script directory for relative paths
SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR"

# Path to store status of this script run
STATUS_FILE="./permission_setup_status"

# Clean up any previous status
rm -f $STATUS_FILE

# Function to extract values from JSON using grep + cut
# This is more reliable than sed for complex JSON
extract_json_value() {
    local json="$1"
    local field="$2"
    echo "$json" | grep -o "\"$field\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | cut -d'"' -f4
}

# Function to check if a value was extracted successfully
check_extraction() {
    local value="$1"
    local field_name="$2"
    
    if [ -z "$value" ]; then
        echo "❌ Failed to extract $field_name from response"
        echo "failed" > $STATUS_FILE
        exit 1
    else
        echo "✅ Successfully extracted $field_name"
    fi
}

echo "Getting admin token..."
RESPONSE=$(curl -s -H "Content-Type: application/json" \
    -X POST \
    -d '{"query": "mutation { tokenCreate(email: \"admin@example.com\", password: \"admin\") { token errors { field message } } }"}' \
    http://localhost:8000/graphql/)

# Print response for debugging
echo "Response from token creation:"
echo "$RESPONSE" | grep -o '"token"[[:space:]]*:[[:space:]]*"[^"]*"' || echo "No token found in response"

# Extract admin token using more reliable extraction
ADMIN_TOKEN=$(echo "$RESPONSE" | grep -o '"token"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
check_extraction "$ADMIN_TOKEN" "admin token"

echo "Creating app with necessary permissions..."
APP_RESPONSE=$(curl -s -X POST http://localhost:8000/graphql/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"query":"mutation { appCreate(input: {name: \"ConfiguratorComplete\", permissions: [MANAGE_SETTINGS, MANAGE_PRODUCTS, MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES, MANAGE_PAGE_TYPES_AND_ATTRIBUTES, MANAGE_CHANNELS]}) { app { id } errors { field message code } } }"}')

echo "App Creation Response: $APP_RESPONSE"

# Extract app ID using improved pattern that handles spaces in JSON
APP_ID=$(echo "$APP_RESPONSE" | grep -o '"id"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$APP_ID" ]; then
  echo "Failed to create app."
  echo "API Response: $APP_RESPONSE"
  # Create status file to indicate failure
  echo "failed" > $STATUS_FILE
  exit 1
fi

echo "Successfully created app with ID: $APP_ID"

echo "Creating app token..."
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:8000/graphql/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"query\":\"mutation { appTokenCreate(input: {app: \\\"$APP_ID\\\", name: \\\"ConfiguratorComplete Token\\\"}) { authToken errors { field message code } } }\"}")

echo "Token Creation Response: $TOKEN_RESPONSE"

# Extract auth token using improved pattern that handles spaces in JSON
AUTH_TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"authToken"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)

if [ -z "$AUTH_TOKEN" ]; then
  echo "Failed to create app token."
  echo "API Response: $TOKEN_RESPONSE"
  # Create status file to indicate failure
  echo "failed" > $STATUS_FILE
  exit 1
fi

echo "Successfully obtained app token: ${AUTH_TOKEN:0:10}..."

echo "Updating configurator.yaml with new token..."
sed -i.bak "s/configurator-app-token: \"[^\"]*\"/configurator-app-token: \"$AUTH_TOKEN\"/" "./k8s/configurator.yaml"

# Create status file to indicate success
echo "$AUTH_TOKEN" > $STATUS_FILE

echo "Setup complete! Configurator now has all necessary permissions."
echo "App Token: ${AUTH_TOKEN:0:5}... (saved to k8s/configurator.yaml)" 