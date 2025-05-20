#!/usr/bin/env bash
# setup-permissions.sh – Create Saleor app with required permissions and inject
# its token into the Kubernetes manifest.
#
# The script works on macOS, Linux and Windows (WSL / Git-Bash).
# Requirements: bash 4+, curl, sed, jq (for robust JSON parsing).
#
# Usage:
#   ./setup-permissions.sh [options]
#
# Environment variables (all have sensible defaults):
#   SALEOR_API_URL         GraphQL endpoint               (default http://localhost:8000/graphql/)
#   SALEOR_ADMIN_EMAIL     Admin e-mail                   (default admin@example.com)
#   SALEOR_ADMIN_PASSWORD  Admin password                 (default admin)
#   SALEOR_APP_NAME        Name of the app to create      (default ConfiguratorComplete)
#   YAML_PATH              k8s YAML to patch with token   (default ./k8s/configurator.yaml)
#   PERMISSIONS            Space-separated Saleor permissions (default MANAGE_USERS MANAGE_STAFF IMPERSONATE_USER MANAGE_APPS MANAGE_OBSERVABILITY MANAGE_CHECKOUTS HANDLE_CHECKOUTS HANDLE_TAXES MANAGE_TAXES MANAGE_CHANNELS MANAGE_DISCOUNTS MANAGE_GIFT_CARD MANAGE_MENUS MANAGE_ORDERS MANAGE_ORDERS_IMPORT MANAGE_PAGES MANAGE_PAGE_TYPES_AND_ATTRIBUTES HANDLE_PAYMENTS MANAGE_PLUGINS MANAGE_PRODUCTS MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES MANAGE_SHIPPING MANAGE_SETTINGS MANAGE_TRANSLATIONS)
#
# Exit codes:
#   0  success
#   1  generic error (network, bad API response, etc.)
#   2  JSON parse error (jq missing & grep fallback failed)

# ---------------------------------------------------------------------------
# Dependency checks (must be first, before any logging or output)
# ---------------------------------------------------------------------------
for dep in bash curl sed jq; do
  if ! command -v $dep >/dev/null 2>&1; then
    echo "❌ Required dependency '$dep' not found. Please install it." >&2
    exit 1
  fi
done

# ---------------------------------------------------------------------------
# Help/Usage
# ---------------------------------------------------------------------------
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
  echo "Usage: $0 [options]"
  echo "  Environment variables:"
  echo "    SALEOR_API_URL, SALEOR_ADMIN_EMAIL, SALEOR_ADMIN_PASSWORD, SALEOR_APP_NAME, YAML_PATH, PERMISSIONS"
  echo "  Example:"
  echo "    SALEOR_API_URL=https://your-saleor/graphql/ SALEOR_ADMIN_EMAIL=admin@yourdomain.com SALEOR_ADMIN_PASSWORD=yourpassword ./setup-permissions.sh"
  exit 0
fi

# ---------------------------------------------------------------------------
# Color codes for UX
# ---------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ---------------------------------------------------------------------------
# OS/Shell validation: Require Bash (Git Bash, WSL, Linux/macOS)
# ---------------------------------------------------------------------------
if [ -z "$BASH_VERSION" ]; then
  echo -e "${RED}❌ This script must be run in Bash (Git Bash, WSL, or Linux/macOS terminal).${NC}"
  echo "   PowerShell and CMD are not supported."
  echo "   On Windows, open Git Bash (installed with Git for Windows) and run:"
  echo "     ./setup-permissions.sh"
  exit 1
fi

# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------
LOG_FILE="setup-permissions.log"
# Remove previous log file to keep only the current run's logs
if [ -f "$LOG_FILE" ]; then
  rm -f "$LOG_FILE"
fi
exec 3>&1 1>>"$LOG_FILE" 2>&1

log_detail() {
  echo "[DETAIL] $*" >> "$LOG_FILE"
}

log_status() {
  echo -e "$*" | tee /dev/fd/3
}

log_success() {
  echo -e "${GREEN}$*${NC}" | tee /dev/fd/3
}

log_error() {
  echo -e "${RED}$*${NC}" | tee /dev/fd/3
}

log_warn() {
  echo -e "${YELLOW}$*${NC}" | tee /dev/fd/3
}

# ---------------------------------------------------------------------------
# 1. Configuration
# ---------------------------------------------------------------------------
log_status "${BLUE}========== Saleor Configurator Permissions Setup ==========${NC}"
log_status "ℹ️  Required environment variables: SALEOR_API_URL, SALEOR_ADMIN_EMAIL, SALEOR_ADMIN_PASSWORD, SALEOR_APP_NAME, YAML_PATH, PERMISSIONS"
log_status "ℹ️  In Kubernetes, these are injected for you."

API_URL="${SALEOR_API_URL:-http://localhost:8000/graphql/}"
YAML_PATH="${YAML_PATH:-./k8s/configurator.yaml}"
ADMIN_EMAIL="${SALEOR_ADMIN_EMAIL:-admin@example.com}"
ADMIN_PASSWORD="${SALEOR_ADMIN_PASSWORD:-admin}"
APP_NAME="${SALEOR_APP_NAME:-ConfiguratorComplete}"
STATUS_FILE="./permission_setup_status"
PERMISSIONS="${PERMISSIONS:-MANAGE_USERS MANAGE_STAFF IMPERSONATE_USER MANAGE_APPS MANAGE_OBSERVABILITY MANAGE_CHECKOUTS HANDLE_CHECKOUTS HANDLE_TAXES MANAGE_TAXES MANAGE_CHANNELS MANAGE_DISCOUNTS MANAGE_GIFT_CARD MANAGE_MENUS MANAGE_ORDERS MANAGE_ORDERS_IMPORT MANAGE_PAGES MANAGE_PAGE_TYPES_AND_ATTRIBUTES HANDLE_PAYMENTS MANAGE_PLUGINS MANAGE_PRODUCTS MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES MANAGE_SHIPPING MANAGE_SETTINGS MANAGE_TRANSLATIONS}"

log_detail "---- Environment ----"
log_detail "SALEOR_API_URL: ${SALEOR_API_URL:-unset}"
log_detail "YAML_PATH: ${YAML_PATH:-unset}"
log_detail "SALEOR_ADMIN_EMAIL: ${SALEOR_ADMIN_EMAIL:-unset}"
log_detail "SALEOR_ADMIN_PASSWORD: ${SALEOR_ADMIN_PASSWORD:+set}"
log_detail "SALEOR_APP_NAME: ${SALEOR_APP_NAME:-unset}"
log_detail "PERMISSIONS: ${PERMISSIONS:-unset}"
log_detail "---------------------"
log_detail "---- Used Values ----"
log_detail "API_URL: $API_URL"
log_detail "YAML_PATH: $YAML_PATH"
log_detail "ADMIN_EMAIL: $ADMIN_EMAIL"
log_detail "ADMIN_PASSWORD: ${ADMIN_PASSWORD:+set}"
log_detail "APP_NAME: $APP_NAME"
log_detail "PERMISSIONS: $PERMISSIONS"
log_detail "---------------------"

# Validate required variables
if [ -z "$API_URL" ]; then
  log_error "❌ API_URL is not set. Please set SALEOR_API_URL or check your configuration."; exit 1
fi
if [ -z "$YAML_PATH" ]; then
  log_error "❌ YAML_PATH is not set. Please set YAML_PATH or check your configuration."; exit 1
fi
if [ -z "$ADMIN_EMAIL" ]; then
  log_error "❌ ADMIN_EMAIL is not set. Please set SALEOR_ADMIN_EMAIL or check your configuration."; exit 1
fi
if [ -z "$ADMIN_PASSWORD" ]; then
  log_error "❌ ADMIN_PASSWORD is not set. Please set SALEOR_ADMIN_PASSWORD or check your configuration."; exit 1
fi
if [ -z "$APP_NAME" ]; then
  log_error "❌ APP_NAME is not set. Please set SALEOR_APP_NAME or check your configuration."; exit 1
fi
if [ -z "$PERMISSIONS" ]; then
  log_error "❌ PERMISSIONS is not set. Please set PERMISSIONS or check your configuration."; exit 1
fi

# ---------------------------------------------------------------------------
# 2. Helper functions
# ---------------------------------------------------------------------------
json_get() {
  local json="$1" filter="$2" fallback="$3" value=""
  if command -v jq >/dev/null 2>&1; then
    value=$(echo "$json" | jq -r "$filter" 2>/dev/null) || true
    [[ "$value" == "null" ]] && value=""
  else
    value=$(printf '%s' "$json" | grep -o "$fallback" | head -1 | cut -d'"' -f4) || true
  fi
  if [[ -z "$value" ]]; then
    log_detail "JSON parse error: unable to extract value with jq/grep"
    return 2
  fi
  printf '%s' "$value"
}

print_api_errors() {
  local response="$1" errors
  if command -v jq >/dev/null 2>&1; then
    errors=$(echo "$response" | jq -r '.errors[]?.message // empty')
  else
    errors=$(echo "$response" | grep -o '"message"[[:space:]]*:[[:space:]]*"[^\"]*"' | cut -d'"' -f4)
  fi
  if [[ -n "$errors" ]]; then
    log_error "❌ API error(s):"
    log_error "$errors"
    log_detail "API error(s): $errors"
    exit 1
  fi
}

sed_inplace() {
  if sed --version >/dev/null 2>&1; then
    sed -i "$@"
  else
    sed -i '' "$@"
  fi
}

# ---------------------------------------------------------------------------
# 3. Main Steps
# ---------------------------------------------------------------------------
log_status "${BLUE}========== Step 1: Obtain Admin Token ==========${NC}"
TOKEN_MUTATION=$(cat <<EOF
mutation {
  tokenCreate(email: "$ADMIN_EMAIL", password: "$ADMIN_PASSWORD") {
    token
    errors { message }
  }
}
EOF
)
log_detail "Constructed TOKEN_MUTATION: $TOKEN_MUTATION"
if [[ -z "$TOKEN_MUTATION" ]]; then
  log_error "❌ TOKEN_MUTATION is empty after here-doc. Exiting."; exit 1
fi
log_detail "Posting to: $API_URL"
PAYLOAD_TOKEN_CREATE=$(jq -c -n --arg q "$TOKEN_MUTATION" '{query: $q}')
log_detail "CURL PAYLOAD (tokenCreate): $PAYLOAD_TOKEN_CREATE"
TOKEN_RESPONSE=$(curl -s -H "Content-Type: application/json" -d "$PAYLOAD_TOKEN_CREATE" "$API_URL")
log_detail "TOKEN_RESPONSE: $TOKEN_RESPONSE"
if [[ -z "$TOKEN_RESPONSE" ]]; then
  log_error "❌ TOKEN_RESPONSE is empty. Exiting."; exit 1
fi
print_api_errors "$TOKEN_RESPONSE"
ADMIN_TOKEN=$(json_get "$TOKEN_RESPONSE" '.data.tokenCreate.token' '"token"[[:space:]]*:[[:space:]]*"[^\"]*"')
log_detail "Parsed admin token: $ADMIN_TOKEN"
if [[ -z "$ADMIN_TOKEN" ]]; then
  log_error "❌ Admin token not received – check credentials or API."; exit 1
fi
log_success "✅ Admin token acquired"

log_status "${BLUE}========== Step 2: Create App with Permissions ==========${NC}"
PERM_ARRAY=$(printf '%s\n' "$PERMISSIONS" | sed '/^$/d' | paste -sd, - | sed 's/^/[/;s/$/]/')
log_detail "Permissions array: $PERM_ARRAY"
APP_MUTATION=$(cat <<EOF
mutation {
  appCreate(input: {name: "$APP_NAME", permissions: $PERM_ARRAY}) {
    app { id }
    errors { field message }
  }
}
EOF
)
log_detail "GraphQL mutation for appCreate: $APP_MUTATION"
PAYLOAD_APP_CREATE=$(jq -c -n --arg q "$APP_MUTATION" '{query: $q}')
log_detail "CURL PAYLOAD (appCreate): $PAYLOAD_APP_CREATE"
APP_RESPONSE=$(curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d "$PAYLOAD_APP_CREATE" "$API_URL")
log_detail "GraphQL response for appCreate: $APP_RESPONSE"
print_api_errors "$APP_RESPONSE"
APP_ID=$(json_get "$APP_RESPONSE" '.data.appCreate.app.id' '"id"[[:space:]]*:[[:space:]]*"[^\"]*"')
log_detail "Parsed app id: $APP_ID"
if [[ -z "$APP_ID" ]]; then
  log_error "❌ App creation failed. Response: $APP_RESPONSE"; exit 1
fi
log_success "✅ App created (id: $APP_ID)"

log_status "${BLUE}========== Step 3: Generate App Token ==========${NC}"
TOKEN_MUT=$(cat <<EOF
mutation {
  appTokenCreate(input: {app: "$APP_ID", name: "$APP_NAME Token"}) {
    authToken
    errors { message }
  }
}
EOF
)
log_detail "GraphQL mutation for appTokenCreate: $TOKEN_MUT"
PAYLOAD_APP_TOKEN_CREATE=$(jq -c -n --arg q "$TOKEN_MUT" '{query: $q}')
log_detail "CURL PAYLOAD (appTokenCreate): $PAYLOAD_APP_TOKEN_CREATE"
APP_TOKEN_RESPONSE=$(curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d "$PAYLOAD_APP_TOKEN_CREATE" "$API_URL")
log_detail "GraphQL response for appTokenCreate: $APP_TOKEN_RESPONSE"
print_api_errors "$APP_TOKEN_RESPONSE"
AUTH_TOKEN=$(json_get "$APP_TOKEN_RESPONSE" '.data.appTokenCreate.authToken' '"authToken"[[:space:]]*:[[:space:]]*"[^\"]*"')
log_detail "Parsed app auth token: $AUTH_TOKEN"
if [[ -z "$AUTH_TOKEN" ]]; then
  log_error "❌ App token creation failed. Response: $APP_TOKEN_RESPONSE"; exit 1
fi
log_success "✅ App auth token obtained (${AUTH_TOKEN:0:8}…)"

log_status "${BLUE}========== Step 4: Patch YAML with Token ==========${NC}"
if [[ ! -f "$YAML_PATH" ]]; then
  log_error "❌ YAML file not found: $YAML_PATH"; exit 1
fi
sed_inplace "s/configurator-app-token: \"[^\"]*\"/configurator-app-token: \"$AUTH_TOKEN\"/" "$YAML_PATH"
log_detail "Patched $YAML_PATH with new token."
echo "$AUTH_TOKEN" > "$STATUS_FILE"
log_detail "Saved token to $STATUS_FILE."
log_success "🎉  Setup complete! Token saved to $YAML_PATH and $STATUS_FILE."
log_status "📝  Log file: $LOG_FILE"
log_success "✅  All steps completed successfully." 