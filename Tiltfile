########################################
# 1) Docker Compose (no Kubernetes)
########################################
docker_compose([
    'backend/saleor-platform/docker-compose.yml',
    'frontend/storefront/docker-compose.yml',
])

########################################
# 2) Local Resource: Apply Migrations
########################################
local_resource(
    name='apply-migrations',
    cmd='cd backend/saleor-platform && docker-compose run --rm api python3 manage.py migrate',
    deps=['backend/saleor-platform']
)

########################################
# 3) Local Resource: Populate DB + Create Admin
########################################
local_resource(
    name='populate-db',
    cmd='cd backend/saleor-platform && docker-compose run --rm api python3 manage.py populatedb --createsuperuser',
    deps=['backend/saleor-platform'],
    # Ensure migrations run first
    resource_deps=['apply-migrations'],
)

########################################
# 4) Docker Build: Saleor Frontend
########################################
# If you need Tilt to build a local image for your storefront
# rather than using an upstream image, keep this. Otherwise remove.
docker_build(
    'saleor-frontend',
    './frontend/storefront',
    live_update=[
        sync('frontend/storefront/schema.graphql', '/app/schema.graphql'),
    ],
    build_args={
        "NEXT_PUBLIC_SALEOR_API_URL": "http://localhost:8000",
        "NEXT_PUBLIC_STOREFRONT_URL": "http://localhost:3000",
    }
)

########################################
# 5) Docker Build: Dummy Payment App
########################################
# Build your local dummy-payment-app image
docker_build(
    'dummy-payment-app',
    './service/dummy-payment-app',
    dockerfile='./service/dummy-payment-app/Dockerfile.dev',
)

########################################
# 6) Local Resource: Generate Schema
########################################
# This fetches the updated schema from the running API (port 8000)
# AFTER the database has been populated (to ensure migrations, etc.)
local_resource(
    name='generate-schema',
    cmd='curl -o frontend/storefront/schema.graphql http://localhost:8000/graphql/',
    deps=['frontend/storefront/schema.graphql'],
    # Waits for DB population to finish first
    resource_deps=['populate-db']
)