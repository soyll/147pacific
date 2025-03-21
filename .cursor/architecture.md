# Saleor Quickstart Architecture

This document describes the architecture of the Saleor Quickstart project.

## System Architecture

```
┌────────────────┐         ┌────────────────┐         ┌────────────────┐
│                │         │                │         │                │
│   Storefront   │◄───────►│   Saleor API   │◄───────►│   Database     │
│   (Next.js)    │         │   (GraphQL)    │         │   (PostgreSQL) │
│                │         │                │         │                │
└────────────────┘         └────────────────┘         └────────────────┘
        ▲                          ▲                          ▲
        │                          │                          │
        │                          │                          │
        ▼                          ▼                          ▼
┌────────────────┐         ┌────────────────┐         ┌────────────────┐
│                │         │                │         │                │
│  Admin Panel   │         │ Payment Apps   │         │  Media Storage │
│  (Dashboard)   │         │ (External)     │         │  (S3/Local)    │
│                │         │                │         │                │
└────────────────┘         └────────────────┘         └────────────────┘
```

## Frontend Architecture

The storefront is built with Next.js, following a well-structured architecture:

### Layer Structure

1. **Presentation Layer**
   - React components
   - Pages
   - Layouts

2. **Business Logic Layer**
   - Custom hooks
   - Context providers
   - Utilities

3. **Data Access Layer**
   - GraphQL queries/mutations
   - Apollo Client
   - API integrations

### Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── Navigation
│   │   ├── Search
│   │   └── UserMenu
│   ├── Main Content
│   └── Footer
│
├── Pages
│   ├── Home
│   ├── Category
│   ├── Product
│   ├── Cart
│   ├── Checkout
│   │   ├── ShippingAddress
│   │   ├── ShippingMethod
│   │   ├── Payment
│   │   └── Confirmation
│   ├── Account
│   └── 404/Error
│
└── Global Context
    ├── Auth
    ├── Cart
    ├── UI State
    └── Preferences
```

## Data Flow

1. **Component Rendering**:
   - Pages request data via GraphQL queries
   - Apollo Client handles caching and data fetching
   - Components render based on received data

2. **User Interactions**:
   - Events trigger state changes or GraphQL mutations
   - Apollo Client updates cache based on mutation results
   - React re-renders components with updated data

3. **Authentication Flow**:
   - JWT-based token authentication
   - Protected routes redirect to login
   - Auth context maintains user state

## Development Architecture

```
┌────────────────────────────────────────────────────────┐
│                     Development Setup                   │
├────────────────┬────────────────┬────────────────┐     │
│                │                │                │     │
│  Tilt          │  Docker        │  Kubernetes    │     │
│  (Dev Env)     │  (Containers)  │  (Orchestration)     │
│                │                │                │     │
└────────────────┴────────────────┴────────────────┘     │
                                                          │
┌────────────────────────────────────────────────────────┐
│                     CI/CD Pipeline                      │
├────────────────┬────────────────┬────────────────┐     │
│                │                │                │     │
│  Tests         │  Builds        │  Deployments   │     │
│  (Jest)        │  (Docker)      │  (K8s)         │     │
│                │                │                │     │
└────────────────┴────────────────┴────────────────┘     │
                                                          │
└────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context, Apollo Cache
- **Data Fetching**: Apollo Client, GraphQL
- **Testing**: Jest, React Testing Library
- **Build Tools**: Webpack, Babel (via Next.js)

### Backend (Saleor)
- **API**: GraphQL
- **Database**: PostgreSQL
- **Caching**: Redis
- **Authentication**: JWT
- **Media Storage**: S3-compatible
- **Search**: Elasticsearch (optional)

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Development**: Tilt
- **CI/CD**: GitHub Actions

## Code Organization

### Frontend Directory Structure

```
frontend/storefront/
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js app router pages
│   ├── components/        # React components
│   │   ├── checkout/      # Checkout components
│   │   ├── products/      # Product components
│   │   └── ui/            # Shared UI components
│   ├── graphql/           # GraphQL operations
│   │   ├── fragments/     # Reusable fragments
│   │   ├── mutations/     # Mutations
│   │   └── queries/       # Queries
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── providers/         # Context providers
│   ├── styles/            # Global styles
│   └── types/             # TypeScript type definitions
├── .env                   # Environment variables
└── package.json           # Dependencies
```

## Performance Considerations

- Server-side rendering for SEO-critical pages
- Efficient data fetching with GraphQL
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Aggressive caching strategies 