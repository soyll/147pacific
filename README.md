![Saleor Platform](https://user-images.githubusercontent.com/249912/71523206-4e45f800-28c8-11ea-84ba-345a9bfc998a.png)

<div align="center">
  <h1>Saleor Quickstart</h1>
</div>

<div align="center">
  <p>Run all Saleor services on the same environment from one repository using commerce as code to build your own store with your own products and content models.</p>
</div>

<div align="center">
  <a href="https://saleor.io/blog/">📰 Saleor Blog</a>
  <span> • </span>
  <a href="https://twitter.com/getsaleor">🐦 Twitter</a>
  <span> • </span>
  <a href="https://discord.gg/YJMfQEJh">💬 Discord Community</a>
</div>

<div align="center">
  <p>Join our Discord community to get help and discuss the project!</p>
  <a href="https://discord.gg/YJMfQEJh">
    <img src="https://img.shields.io/discord/1117183362606391438?color=%237289DA&label=discord&logo=discord&logoColor=white" alt="Discord">
  </a>
</div>

## About

### What is Saleor Quickstart?

This repository provides the easiest way to start local development with all the major Saleor services using Tilt:
- [Core GraphQL API](https://github.com/saleor/saleor)
- [Dashboard](https://github.com/saleor/saleor-dashboard)
- [Storefront](https://github.com/saleor/storefront)
- Mailpit (Test email interface)
- Jaeger (APM)
- Payment Service
- The necessary databases, cache, etc.

*Keep in mind this repository is for local development only and is not meant to be deployed in any production environment!*

## Initial Setup

### Option 1: Using Installation Script (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/saleor/quickstart.git
cd quickstart
```

2. Run the installation script:
```bash
# Make the script executable
chmod +x ./install.sh

# Run the installation script
./install.sh
```

The script will automatically check and install all requirements, including:
- Docker Desktop
- Tilt
- Kubernetes setup
- Required Docker images

### Option 2: Manual Installation

First, ensure you have the following requirements:

1. [Docker Desktop](https://docs.docker.com/install/)
   - Windows/MacOS: Minimum 5 GB of memory required
   - Windows/MacOS: Enable file sharing for the project directory
   - Linux: No special configuration needed
   - Required images:
     ```bash
     docker pull ghcr.io/saleor/saleor:latest
     ```

2. [Tilt](https://docs.tilt.dev/install.html)
   - macOS: `brew install tilt`
   - Windows: `scoop install tilt`
   - Linux: `curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash`

3. Kubernetes
   - Enabled in Docker Desktop
   - No additional installation needed

Then follow these steps:

1. Enable Kubernetes in Docker Desktop:
    - Open Docker Desktop
    - Go to Settings -> Kubernetes
    - Check "Enable Kubernetes"
    - Click "Apply & Restart"
    - Windows/MacOS: Make sure you have dedicated at least 5 GB of memory (Settings -> Resources -> Advanced)

2. Clone the repository:
```bash
git clone https://github.com/saleor/quickstart.git
cd quickstart
```

3. Start the development environment:
```bash
tilt up
```

4. Open Tilt UI in your browser:
```bash
tilt up --web
```

5. Default Saleor Dashboard Admin Access:
   - Email: `admin@example.com`
   - Password: `admin`

## Where is everything running?

- Saleor Core (API) - http://localhost:8000
- Saleor Dashboard - http://localhost:9000
- Saleor Storefront - http://localhost:30080
- Jaeger UI (APM) - http://localhost:16686
- Mailpit (Test email interface) - http://localhost:8025
- Payment Service - http://localhost:8001
- Tilt UI - http://localhost:10350

## Development Features

### Live Updates
The environment supports live code updates for:
- Frontend code changes
- GraphQL schema changes
- Payment service modifications

### Resource Organization
Tilt UI organizes resources into sections:
1. **Namespace**: Kubernetes namespace setup
2. **Backend**: API, Database, Redis, etc.
3. **Schema**: GraphQL schema generation
4. **Frontend**: Storefront application
5. **Services**: Payment service
6. **K8s**: Kubernetes configurations

## Troubleshooting

### How to solve common issues?

1. **Check service status**
```bash
tilt status
```

2. **View service logs**
```bash
tilt logs <service-name>
```

3. **Restart a service**
```bash
tilt trigger <service-name>
```

4. **Reset everything**
```bash
tilt down && tilt up
```

### Issues with API or Schema Generation

If the schema generation fails:
1. Check API logs: `tilt logs api`
2. Ensure API is running: `curl http://localhost:8000/graphql/`
3. Manually trigger schema generation: `tilt trigger generate-schema`

### Database Issues

For database problems:
1. Check DB logs: `tilt logs db`
2. Restart migrations: `tilt trigger apply-migrations`
3. Reset sample data: `tilt trigger populate-db`

## Feedback

If you have any questions or feedback, do not hesitate to contact us via:
- [GitHub Discussions](https://github.com/saleor/saleor/discussions)
- [Discord Community](https://discord.gg/YJMfQEJh) - Join our community for quick help and discussions!

## License

Disclaimer: Everything you see here is open and free to use as long as you comply with the [license](LICENSE). There are no hidden charges. We promise to do our best to fix bugs and improve the code.

#### Crafted with ❤️ by [Saleor Commerce](https://saleor.io/)

## Project Structure
```
.
├── backend/           # Backend services
├── frontend/          # Storefront application
├── service/          # Additional services (payment, etc.)
├── k8s/              # Kubernetes configurations
└── Tiltfile         # Tilt configuration
```
