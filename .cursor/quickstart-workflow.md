# Quickstart Workflow for Saleor

This document outlines the workflow for developing with the Saleor Quickstart project.

## Project Structure

```
quickstart/
├── backend/                # Saleor backend services
│   └── saleor-platform/    # Core Saleor services
├── frontend/               # Storefront application
│   └── storefront/         # Next.js e-commerce frontend
├── k8s/                    # Kubernetes configuration
├── Tiltfile                # Development environment configuration
└── config.yaml             # Project configuration
```

## Development Workflow

### 1. Initial Setup

The `install.sh` script handles:
- Setting up development dependencies
- Configuring Docker containers
- Initializing the database
- Creating initial admin user
- Loading sample data

### 2. Development Cycle

1. **Start the Development Environment**:
   ```bash
   tilt up
   ```
   This launches:
   - Saleor Core API
   - Storefront
   - Database
   - Required services

2. **Modify Frontend Code**:
   - Implement UI components in `frontend/storefront/src/`
   - Define GraphQL operations in component files
   - Update styles with Tailwind in component files

3. **Test Changes**:
   - Access storefront: http://localhost:3000
   - Access admin panel: http://localhost:9000
   - Run tests: `cd frontend/storefront && pnpm test`

4. **Deploy Changes**:
   - Commit and push changes
   - CI/CD pipeline handles deployment

## Key Development Tasks

### Create New Page

1. Add route in `frontend/storefront/src/app/`
2. Create page component
3. Define required GraphQL queries
4. Add navigation links

### Add New Product Feature

1. Define GraphQL fragments and queries
2. Create UI components
3. Add to relevant pages
4. Update navigation if needed

### Implement Checkout Changes

1. Modify checkout steps in `src/checkout/`
2. Update GraphQL mutations
3. Test with sample products

### Add Authentication Feature

1. Extend auth hooks in `src/auth/`
2. Update UI components requiring authentication
3. Add protected routes

## Common Commands

```bash
# Start development environment
tilt up

# View backend logs
tilt logs backend

# View frontend logs
tilt logs frontend

# Stop all services
tilt down

# Run frontend tests
cd frontend/storefront && pnpm test

# Generate GraphQL types
cd frontend/storefront && pnpm generate
```

## Debug Guidelines

- Frontend errors: Check browser console and component props
- GraphQL errors: Use the Apollo tab in browser DevTools
- Backend errors: Check Docker logs for Saleor API service
- Database issues: Connect to PostgreSQL and verify tables/data 