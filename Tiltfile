# Allow Tilt to use the Docker Desktop Kubernetes context
allow_k8s_contexts(['docker-desktop'])

# Load Kubernetes YAML files
k8s_yaml([
    'config.yaml',                                         # Environment variables
    'backend/saleor-platform/k8s/saleor.yaml',             # Backend service (Saleor API)
    'frontend/storefront/k8s/storefront.yaml',             # Frontend service (Storefront)
    'service/dummy-payment-app/k8s/payment.yaml'           # Payment app service
])

# Use docker_compose for backend services
docker_compose(['backend/saleor-platform/docker-compose.yml'])

# Generate schema.graphql file if not already present
local_resource(
    'generate-schema',
    cmd='curl -o frontend/storefront/schema.graphql http://localhost:8000/graphql',
    deps=['frontend/storefront/schema.graphql']
)

# Pass environment variables as build arguments for saleor-frontend
docker_build(
    'saleor-frontend',
    './frontend/storefront',
    live_update=[
        sync('frontend/storefront/schema.graphql', '/app/schema.graphql')
    ],
    build_args={
        "NEXT_PUBLIC_SALEOR_API_URL": "http://localhost:8000",
        "NEXT_PUBLIC_STOREFRONT_URL": "http://localhost:3000"
    }
)

# # Use docker_compose for non-Kubernetes tasks and pass environment variables
# docker_compose(['backend/saleor-platform/docker-compose.yml', 'frontend/storefront/docker-compose.yml'])

# Use docker_build for other images
docker_build('dummy-payment-app', './service/dummy-payment-app', dockerfile='./service/dummy-payment-app/Dockerfile.dev')

# Define Kubernetes resources with port forwarding
k8s_resource('saleor-backend', port_forwards=8000)
k8s_resource('saleor-frontend', port_forwards=3000)
k8s_resource('dummy-payment-app', port_forwards=8001)

# Optional local resources for additional tasks
local_resource(
    'backend-migrate',
    cmd='kubectl exec deployment/saleor-backend -- python manage.py migrate',
    deps=['backend']
)
local_resource(
    'frontend-build',
    cmd='kubectl exec deployment/saleor-frontend -- npm run build',
    deps=['frontend']
)