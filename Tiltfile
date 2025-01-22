########################################
# 0) Kubernetes Namespace Setup
########################################
# Create and initialize namespace
local_resource(
    'create-namespace',
    cmd='kubectl create namespace saleor --dry-run=client -o yaml | kubectl apply -f -',
    deps=['k8s/namespace.yaml'],
    labels=['namespace']
)

########################################
# 1) Backend Services Setup
########################################
# Initialize Docker Compose for backend services
docker_compose('./backend/saleor-platform/docker-compose.yml')

# Create shared network for service communication
local('docker network create saleor-network || true')

# Create resources for all backend services
dc_resource('api', labels=['backend'])
dc_resource('db', labels=['backend'])
dc_resource('redis', labels=['backend'])
dc_resource('worker', labels=['backend'])
dc_resource('dashboard', labels=['backend'])
dc_resource('jaeger', labels=['backend'])
dc_resource('mailpit', labels=['backend'])

# Apply database migrations
local_resource(
    name='apply-migrations',
    cmd='cd backend/saleor-platform && docker-compose run --rm api python3 manage.py migrate',
    deps=['backend/saleor-platform'],
    resource_deps=['create-namespace'],
    labels=['backend']
)

# Populate database with initial data
local_resource(
    name='populate-db',
    cmd='cd backend/saleor-platform && docker-compose run --rm api python3 manage.py populatedb --createsuperuser',
    deps=['backend/saleor-platform'],
    resource_deps=['apply-migrations'],
    labels=['backend']
)

########################################
# 2) Schema Generation
########################################
# Generate GraphQL schema after API is ready
local_resource(
    'generate-schema',
    cmd='''
    cd backend/saleor-platform && \
    echo "Waiting for API to be ready..." && \
    for i in $(seq 1 30); do
        echo "Attempt $i: Checking API status..." && \
        curl -v http://localhost:8000/graphql/ 2>&1 && \
        echo "API is ready. Generating schema..." && \
        docker-compose run --rm api python3 manage.py get_graphql_schema > ../../frontend/storefront/schema.graphql && \
        echo "Schema generated. Checking file:" && \
        ls -l ../../frontend/storefront/schema.graphql && \
        head -n 5 ../../frontend/storefront/schema.graphql && \
        exit 0 || \
        echo "API not ready yet. Waiting 5 seconds..." && \
        sleep 5
    done && \
    echo "Timed out waiting for API" && \
    exit 1
    ''',
    deps=['frontend/storefront/schema.graphql'],
    resource_deps=['api', 'populate-db'],
    labels=['schema']
)

########################################
# 3) Frontend Setup
########################################
# Build frontend image with live updates
docker_build(
    'saleor-frontend',
    context='./frontend/storefront',
    dockerfile='./frontend/storefront/Dockerfile',
    live_update=[
        sync('./frontend/storefront', '/app'),
        run('npm install', trigger=['./frontend/storefront/package.json'])
    ],
    build_args={
        'NEXT_PUBLIC_SALEOR_API_URL': 'http://host.docker.internal:8000/graphql/',
        'NEXT_PUBLIC_STOREFRONT_URL': 'http://localhost:3000'
    }
)

########################################
# 4) Payment Service Setup
########################################
# Build payment service image
docker_build(
    'dummy-payment-app',
    context='./service/dummy-payment-app',
    dockerfile='./service/dummy-payment-app/Dockerfile.dev',
    live_update=[
        sync('./service/dummy-payment-app', '/app'),
        run('pip install -r requirements.txt', trigger=['./service/dummy-payment-app/requirements.txt'])
    ]
)

########################################
# 5) Kubernetes Resources
########################################
# Load base Kubernetes configurations
k8s_yaml(['k8s/namespace.yaml', 'k8s/configmap.yaml'])

# Load application manifests
k8s_yaml([
    'frontend/storefront/k8s/storefront.yaml',
    'service/dummy-payment-app/k8s/payment.yaml'
])

# Configure frontend service
k8s_resource(
    'saleor-frontend',
    port_forwards=['3000:3000'],
    resource_deps=['generate-schema'],
    labels=['frontend']
)

# Configure payment service
k8s_resource(
    'dummy-payment-app',
    port_forwards=['8001:8001'],
    resource_deps=['populate-db'],
    labels=['services']
)