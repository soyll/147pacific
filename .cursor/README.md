# Cursor AI Configuration

This directory contains configuration files and documentation for Cursor AI to enhance development in this Saleor Quickstart project.

## Available Files

### 1. Project Instructions
- `settings.json` - Project-specific instructions for Cursor AI
- `.cursorrules` - Root-level instructions for Cursor AI (in project root)

### 2. Prompt Templates
- `prompts.json` - Reusable AI prompt templates for common tasks

### 3. Saleor Documentation
- `saleor-concepts.md` - Core concepts in Saleor e-commerce platform
- `saleor-patterns.md` - Implementation patterns and code examples
- `saleor-configurator.md` - Configurator system for product and content modeling
- `quickstart-workflow.md` - Development workflow documentation
- `architecture.md` - System and code architecture documentation

### 4. AI Coding Guides
- `ai-comment-patterns.md` - Comment patterns to improve AI understanding
- `schema-helpers.js` - GraphQL schema-specific helpers and templates

## How to Use These Resources

### 1. AI Prompts and Templates

Use templates for common tasks:

```
@cursor template:component purpose="product card"
@cursor template:graphqlQuery entity="Product" fields="id, name, price, description, images"
@cursor template:test component="ProductCard"
@cursor template:page route="/products/[id]"
```

### 2. Code Snippets

Access common code snippets:

```
@cursor snippet:errorBoundary
@cursor snippet:loadingState
@cursor snippet:attributeFieldRenderer
```

### 3. Schema-Based Templates

Use GraphQL schema-aware templates:

```
@cursor schema:fragments.productBasic
@cursor schema:queryTemplates.getProductsByCategory
@cursor schema:mutationTemplates.createCheckout
@cursor schema:componentTemplates.productList
@cursor schema:interfaceTemplates.product
```

### 4. Adding AI-Friendly Comments

Add special comments to your code to help Cursor AI understand it better:

```tsx
// @cursor-component ProductCard
// @cursor-description Displays product information with image, name, and price
// ...component implementation
```

```graphql
# @cursor-query GetProductDetails
# @cursor-description Fetches detailed product information
# ...query implementation
```

### 5. AI Commands

Use these commands to get AI assistance:

- `@cursor generate component ProductDetail`
- `@cursor generate test for ComponentName`
- `@cursor explain this`
- `@cursor review this`
- `@cursor optimize this`
- `@cursor saleor-concept:channels` - Information about Saleor channels
- `@cursor saleor-pattern:checkout` - Implementation patterns for checkout
- `@cursor architecture:frontend` - Frontend architecture information
- `@cursor configurator:product-types` - Help with product type configuration
- `@cursor configurator:attributes` - Help with attribute configuration
- `@cursor configurator:variants` - Help with product variant generation

## Improving AI Understanding

To make Cursor AI more effective with your code:

1. **Add Clear Comments**: Use the patterns in `ai-comment-patterns.md`
2. **Maintain Type Definitions**: Well-typed code gets better AI suggestions
3. **Follow Patterns**: Consistent code organization helps AI recognize patterns
4. **Reference Documentation**: Point to relevant sections in the documentation files
5. **Add Business Context**: Include business rules and domain knowledge in comments
6. **Use Schema-Aware Templates**: Leverage the GraphQL schema for accurate code generation

## Contributing

When adding new files or features to this project:

1. Update the AI documentation to reflect new concepts and patterns
2. Add appropriate AI-friendly comments to your code
3. Consider creating new templates for common patterns you introduce
4. Update schema helpers if the GraphQL schema changes

## Setting Up Your Editor

1. Install the Cursor IDE
2. Open this project in Cursor
3. The AI features will automatically use these configuration files

## Root-Level `.cursorrules` File

This project uses a root-level `.cursorrules` file that provides comprehensive instructions for Cursor AI, including:

- Core technologies used in this project
- Best practices for Saleor GraphQL development
- Recommended folder structure
- Saleor-specific patterns
- GraphQL schema awareness
- Component patterns based on the schema

The `.cursorrules` file works in conjunction with the files in the `.cursor` directory to provide a complete AI-assistance experience. 