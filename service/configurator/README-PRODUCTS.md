# Product Configuration in Saleor Configurator

This document explains how to use the product configuration feature in the Saleor Configurator to create and manage products.

## Overview

The product configuration feature allows you to define products in your `config.yml` file and have them automatically created in your Saleor instance. This feature follows the infrastructure-as-code approach, similar to tools like Terraform or Pulumi, providing idempotency - meaning running the configurator multiple times with the same configuration will result in the same state.

## Dependencies

Products depend on other elements in your Saleor configuration:

- **Product Types** - Each product must reference a product type that defines its attributes
- **Categories** - Products can be assigned to categories
- **Attributes** - Products can have attributes defined in their product type
- **Channels** - Products can be listed in different channels with different pricing

For this reason, the product configuration is processed after all other configuration components have been bootstrapped.

## Configuration Format

Products are defined in the `products` section of your `config.yml` file:

```yaml
products:
  - name: "Product Name"
    description: "Detailed product description"
    productType: "Referenced Product Type"
    category: "Referenced Category"
    attributes:
      - attribute: "Attribute Name"
        values: ["Value 1", "Value 2"]
    channelListings:
      - channelSlug: "channel-slug"
        isPublished: true
        visibleInListings: true
    variants:
      - sku: "PRODUCT-SKU-1"
        name: "Variant Name"
        attributes:
          - attribute: "Variant Attribute Name"
            values: ["Variant Value"]
        channelListings:
          - channelSlug: "channel-slug"
            price: "19.99"
            costPrice: "9.99"
```

## Configuration Fields

### Product Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `name` | String | Name of the product | Yes |
| `description` | String | Description of the product | No |
| `productType` | String | Name of the product type | Yes |
| `category` | String | Name of the category | No |
| `attributes` | Array | Product attributes | No |
| `channelListings` | Array | Channel visibility and availability | No |
| `variants` | Array | Product variants | No |

### Attribute Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `attribute` | String | Name of the attribute | Yes |
| `values` | Array of Strings | Values for the attribute | Yes |

### Channel Listing Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `channelSlug` | String | Slug of the channel | Yes |
| `isPublished` | Boolean | Whether the product is published | No (default: true) |
| `visibleInListings` | Boolean | Whether the product is visible in listings | No (default: true) |
| `isAvailableForPurchase` | Boolean | Whether the product is available for purchase | No (default: true) |

### Variant Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `sku` | String | Stock keeping unit | Yes |
| `name` | String | Name of the variant | No (defaults to SKU) |
| `attributes` | Array | Variant attributes | No |
| `channelListings` | Array | Price configuration per channel | No |

### Variant Channel Listing Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `channelSlug` | String | Slug of the channel | Yes |
| `price` | String | Price of the variant | Yes |
| `costPrice` | String | Cost price of the variant | No |

## Example

Here's a complete example of a product configuration:

```yaml
products:
  - name: "Organic Cotton T-Shirt"
    description: "A comfortable, 100% organic cotton t-shirt."
    productType: "T-Shirt"
    category: "Apparel"
    attributes:
      - attribute: "Material"
        values: ["Organic Cotton"]
      - attribute: "Brand"
        values: ["EcoFashion"]
    channelListings:
      - channelSlug: "us-store"
        isPublished: true
        visibleInListings: true
      - channelSlug: "eu-store"
        isPublished: true
        visibleInListings: true
    variants:
      - sku: "TS-BLK-S"
        name: "Black Small"
        attributes:
          - attribute: "Color"
            values: ["Black"]
          - attribute: "Size"
            values: ["S"]
        channelListings:
          - channelSlug: "us-store"
            price: "19.99"
            costPrice: "8.50"
          - channelSlug: "eu-store"
            price: "18.99"
            costPrice: "8.00"
      - sku: "TS-BLK-M"
        name: "Black Medium"
        attributes:
          - attribute: "Color"
            values: ["Black"]
          - attribute: "Size"
            values: ["M"]
        channelListings:
          - channelSlug: "us-store"
            price: "19.99"
            costPrice: "8.50"
          - channelSlug: "eu-store"
            price: "18.99"
            costPrice: "8.00"
```

## Notes

- All references (product types, categories, attributes, channels) must exist or be defined elsewhere in the configuration
- The configurator will handle creating missing product variants
- If a product already exists, it will be updated with the new configuration
- Idempotency ensures that running the configurator multiple times won't create duplicate products

## Execution Order

The configurator executes configurations in this order:

1. Shop settings
2. Product types
3. Channels
4. Page types
5. Categories
6. Products (dependent on all above components)

This ensures that all dependencies are created before products are processed. 