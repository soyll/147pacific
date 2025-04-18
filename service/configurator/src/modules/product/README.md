# Product Module

This module handles the creation and management of products in Saleor based on the configuration defined in the `config.yml` file.

## Architecture

The product module follows the repository pattern used throughout the application:

- `repository.ts` - Contains GraphQL operations for product-related mutations and queries
- `product-service.ts` - Business logic for creating and updating products
- `index.ts` - Exports the service and repository classes and provides a factory function

## Dependencies

The product module depends on several other modules:

- **ProductType** - Products must be associated with product types
- **Attribute** - Product attributes must be referenced
- **Category** - Products may belong to categories
- **Channel** - Products must be published in channels

## Configuration

Products are defined in the `config.yml` file under the `products` section. Each product definition includes:

```yaml
products:
  - name: "Product Name"
    description: "Product description"
    productType: "Type Name"
    category: "Category Name"
    attributes:
      - attribute: "Attribute Name"
        values: ["Value1", "Value2"]
    channelListings:
      - channelSlug: "channel-slug"
        isPublished: true
        visibleInListings: true
    variants:
      - sku: "PRODUCT-SKU"
        name: "Variant Name"
        channelListings:
          - channelSlug: "channel-slug"
            price: "10.00"
            costPrice: "5.00"
```

## Bootstrap Process

Products are created at the end of the bootstrap process, after all dependencies (product types, attributes, channels, etc.) have been initialized. This ensures that all required references are available when creating products.

The bootstrap process for products:

1. Loads product definitions from the config file
2. For each product:
   - Resolves product type ID
   - Resolves category ID (if specified)
   - Resolves attribute IDs and values
   - Creates or updates the product
   - Sets up channel listings
   - Creates variants with their channel listings

## Usage

The product service is initialized in the `service-container.ts` file and is automatically used by the `SaleorConfigurator` during the bootstrap process. 