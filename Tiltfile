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
local_resource(
    'create-network',
    cmd='docker network create saleor-network 2>/dev/null || true',
    labels=['backend']
)

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
    if [ ! -f frontend/storefront/schema.graphql ]; then
        cd backend/saleor-platform && \
        echo "Schema file doesn't exist. Waiting for API to be ready..." && \
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
    else
        echo "Schema file already exists. Skipping generation."
    fi
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
        'NEXT_PUBLIC_STOREFRONT_URL': 'http://localhost:30080',
        'HOSTNAME': '0.0.0.0'
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

# Load application manifests - include configurator
k8s_yaml([
    'frontend/storefront/k8s/storefront.yaml',
    'service/dummy-payment-app/k8s/payment.yaml',
    'service/configurator/k8s/configurator.yaml'
], allow_duplicates=True)  # Allow later overrides with updated token

# Configure frontend service
k8s_resource(
    'saleor-frontend',
    resource_deps=['generate-schema'],
    labels=['frontend']
)

# Configure payment service
k8s_resource(
    'dummy-payment-app',
    resource_deps=['populate-db'],
    labels=['services']
)

########################################
# 6) Configurator Service Setup
########################################
# Copy schema to configurator directory before building
local_resource(
    'copy-schema-to-configurator',
    cmd='''
    # Create the directory if it doesn't exist
    mkdir -p service/configurator/schema
    
    # Copy the already generated schema
    if [ -f frontend/storefront/schema.graphql ]; then
        echo "Copying existing schema to configurator directory..."
        cp frontend/storefront/schema.graphql service/configurator/schema/schema.graphql
        echo "Schema copied successfully."
    else
        echo "Schema file not found. Configurator might fail."
    fi
    ''',
    resource_deps=['generate-schema'],
    labels=['services']
)

# Build configurator service image
docker_build(
    'saleor-configurator',
    context='./service/configurator',
    dockerfile='./service/configurator/Dockerfile',
    live_update=[
        sync('./service/configurator', '/app'),
        run('pnpm install', trigger=['./service/configurator/package.json'])
    ],
    build_args={
        'SALEOR_API_URL': 'http://api:8000/graphql/'
    }
)

# Setup configurator permissions
local_resource(
    'setup-configurator-permissions',
    cmd='''
    # Retry the whole process up to 3 times
    for attempt in {1..3}; do
        echo "========================================================="
        echo "Permission setup attempt $attempt of 3"
        echo "========================================================="
        
        # Check if API is ready
        for i in $(seq 1 10); do
            echo "API check $i: Checking if API is ready..."
            if curl -s http://localhost:8000/graphql/ > /dev/null; then
                echo "API is ready. Proceeding with permission setup..."
                break
            else
                echo "API not ready yet. Waiting 5 seconds..."
                sleep 5
            fi
            
            # If we've tried 10 times and API isn't ready, wait longer but don't fail
            if [ $i -eq 10 ]; then
                echo "API not fully ready yet. Waiting 30 seconds before next attempt..."
                sleep 30
            fi
        done
        
        # Now try to set up permissions - use bash to ensure the script runs in its intended environment
        echo "Running permission setup script..."
        (cd service/configurator && bash ./setup-permissions.sh)
        
        # Check if setup was successful - make sure to check in the right location
        if [ -f service/configurator/permission_setup_status ] && [ "$(cat service/configurator/permission_setup_status)" != "failed" ]; then
            echo "✅ Permission setup completed successfully on attempt $attempt!"
            TOKEN=$(cat service/configurator/permission_setup_status)
            echo "Token will be applied: ${TOKEN:0:5}..."
            exit 0
        else
            echo "❌ Permission setup failed on attempt $attempt."
            
            if [ $attempt -lt 3 ]; then
                echo "Waiting 20 seconds before next attempt..."
                sleep 20
            else
                echo "All 3 attempts failed. Check the API and verify credentials."
                echo "Creating backup token for development..."
                mkdir -p service/configurator
                echo "DEVELOPMENT_DUMMY_TOKEN" > service/configurator/permission_setup_status
                echo "WARNING: Using a dummy token that will not work. Fix permission setup."
                exit 0  # Don't fail the Tilt process, but warn the user
            fi
        fi
    done
    ''',
    resource_deps=['api', 'populate-db'],
    labels=['services']
)

# Apply configurator deployment explicitly after permissions are set up
local_resource(
    'apply-configurator-yaml',
    cmd='''
    echo "Applying updated configurator.yaml with proper token..."
    kubectl apply -f service/configurator/k8s/configurator.yaml -n saleor
    
    # Wait for the resource to be available
    echo "Waiting for configurator deployment to be ready..."
    for i in $(seq 1 10); do
        if kubectl get deployment saleor-configurator -n saleor >/dev/null 2>&1; then
            echo "✅ Configurator deployment found in Kubernetes"
            break
        else
            echo "Waiting for configurator deployment... ($i/10)"
            sleep 2
        fi
        
        if [ $i -eq 10 ]; then
            echo "⚠️ Timed out waiting for configurator deployment"
        fi
    done
    ''',
    resource_deps=['setup-configurator-permissions'],
    labels=['services']
)

# Configure configurator service - must come after k8s_yaml loads it
k8s_resource(
    'saleor-configurator',
    resource_deps=['api', 'populate-db', 'copy-schema-to-configurator', 'generate-schema', 'setup-configurator-permissions', 'apply-configurator-yaml'],
    labels=['services']
)

# Copy schema to configurator pod
local_resource(
    'copy-schema-to-pod',
    cmd='''
    echo "Waiting for configurator pod to be ready..."
    sleep 5
    POD=$(kubectl -n saleor get pod -l app=saleor-configurator -o jsonpath="{.items[0].metadata.name}" 2>/dev/null) || true
    if [ -z "$POD" ]; then
        echo "Configurator pod not found. Will retry later."
        exit 0
    fi
    
    echo "Found configurator pod: $POD"
    if [ -f frontend/storefront/schema.graphql ]; then
        echo "Copying schema to pod..."
        kubectl -n saleor cp frontend/storefront/schema.graphql ${POD}:/app/schema/schema.graphql
        kubectl -n saleor exec ${POD} -- ls -la /app/schema/
        echo "Schema copied to pod."
    else
        echo "Schema file not found. Configurator might fail."
    fi
    ''',
    resource_deps=['saleor-configurator'],
    labels=['services']
)

# Apply configuration on startup
local_resource(
    'initial-configuration',
    cmd='''
    echo "Waiting for API to be fully ready..."
    cd backend/saleor-platform && \
    for i in $(seq 1 30); do
        echo "Attempt $i: Checking API status..." && \
        curl -s http://localhost:8000/graphql/ > /dev/null && \
        echo "API is ready. Proceeding with configuration..." && \
        break || \
        echo "API not ready yet. Waiting 5 seconds..." && \
        sleep 5
        if [ $i -eq 30 ]; then
            echo "Timed out waiting for API. Configuration might fail."
        fi
    done

    echo "Waiting for schema to be copied to the pod..."
    sleep 10
    
    echo "Applying initial configuration from config.yml..."
    POD=$(kubectl -n saleor get pod -l app=saleor-configurator -o jsonpath="{.items[0].metadata.name}")
    kubectl -n saleor exec -it ${POD} -- sh -c 'echo "Checking for schema..." && ls -la /app/schema/ && pnpm bootstrap' || echo "Initial configuration failed, check logs"
    ''',
    resource_deps=['api', 'populate-db', 'copy-schema-to-pod'],
    labels=['services']
)

# Local resource to apply configuration on demand
local_resource(
    'apply-configuration',
    cmd='''
    echo "Applying configuration from config.yml..."
    POD=$(kubectl -n saleor get pod -l app=saleor-configurator -o jsonpath="{.items[0].metadata.name}")
    
    # First ensure we have the latest schema
    if [ -f frontend/storefront/schema.graphql ]; then
        echo "Copying latest schema to pod..."
        kubectl -n saleor cp frontend/storefront/schema.graphql ${POD}:/app/schema/schema.graphql
    fi
    
    # Now run bootstrap
    kubectl -n saleor exec -it ${POD} -- sh -c 'echo "Using schema at:" && ls -la /app/schema/ && pnpm bootstrap'
    echo "Configuration applied successfully!"
    ''',
    resource_deps=['saleor-configurator'],
    auto_init=False,  # Don't run automatically on startup
    labels=['services']
)