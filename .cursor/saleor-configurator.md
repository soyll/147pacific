# Saleor Configurator

The Configurator is a core system in Saleor that serves as the backbone for product and content modeling. It provides a flexible way to define, customize, and extend the data model.

## Core Concepts

### 1. Configuration Schema

The Configurator uses a schema-based approach to define data models:

- **Entities**: Core data types (Products, Categories, Pages, etc.)
- **Fields**: Properties of entities (name, description, price)
- **Validations**: Rules that ensure data integrity
- **Relationships**: Connections between entities

### 2. Dynamic Attributes

The attribute system allows for extensible data modeling:

- **Attribute Types**: Text, Rich Text, Boolean, Date, Numeric, Reference, etc.
- **Assignment**: Attributes can be assigned to Product Types, Pages, etc.
- **Metadata**: Additional data can be attached to any model
- **Variants**: Product variants with unique combinations of attributes

### 3. GraphQL Integration

The Configurator is deeply integrated with GraphQL:

- **Schema Generation**: The GraphQL schema is dynamically generated based on Configurator definitions
- **Custom Fields**: Entity extensions appear as fields in GraphQL types
- **Input Types**: Automatic creation of input types for mutations
- **Filtering**: Dynamic filter options based on attribute definitions

## Architecture

```
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│                   │      │                   │      │                   │
│  Admin Interface  │<────►│    Configurator   │<────►│  GraphQL Schema   │
│                   │      │                   │      │                   │
└───────────────────┘      └───────────────────┘      └───────────────────┘
                                    │                          │
                                    ▼                          ▼
                           ┌───────────────────┐      ┌───────────────────┐
                           │                   │      │                   │
                           │   Data Storage    │<────►│     API Layer     │
                           │                   │      │                   │
                           └───────────────────┘      └───────────────────┘
```

## Working with the Configurator

### 1. Defining Product Types

```graphql
mutation ProductTypeCreate {
  productTypeCreate(input: {
    name: "T-Shirt",
    slug: "t-shirt",
    hasVariants: true,
    isShippingRequired: true,
    taxClass: "standard",
    weight: 0.5
  }) {
    productType {
      id
      name
    }
    errors {
      field
      message
      code
    }
  }
}
```

### 2. Creating Attributes

```graphql
mutation AttributeCreate {
  attributeCreate(input: {
    name: "Size",
    slug: "size",
    type: PRODUCT_TYPE,
    inputType: DROPDOWN,
    values: [
      { name: "Small", slug: "s" },
      { name: "Medium", slug: "m" },
      { name: "Large", slug: "l" }
    ]
  }) {
    attribute {
      id
      name
      values {
        name
        slug
      }
    }
    errors {
      field
      message
      code
    }
  }
}
```

### 3. Assigning Attributes to Product Types

```graphql
mutation ProductTypeAttributeAssign {
  productTypeAttributeAssign(
    productTypeId: "UHJvZHVjdFR5cGU6MQ==",
    attributeIds: ["QXR0cmlidXRlOjE="]
  ) {
    productType {
      id
      attributes {
        id
        name
      }
    }
    errors {
      field
      message
      code
    }
  }
}
```

### 4. Querying Configured Products

```graphql
query GetProductWithAttributes {
  product(id: "UHJvZHVjdDox") {
    id
    name
    attributes {
      attribute {
        name
        slug
      }
      values {
        name
        slug
      }
    }
    variants {
      name
      attributes {
        attribute {
          name
        }
        values {
          name
        }
      }
    }
  }
}
```

## Implementation Patterns

### 1. Dynamic Form Generation

```tsx
// @cursor-pattern: Dynamic form generation based on Configurator schema
const ProductForm = ({ productType }) => {
  const formFields = useAttributeFields(productType);
  
  return (
    <form>
      {formFields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          // Field rendering based on attribute type
        />
      ))}
    </form>
  );
};
```

### 2. Attribute-Based Filtering

```tsx
// @cursor-pattern: Building filters based on available attributes
const ProductFilters = ({ attributes }) => {
  return (
    <div className="filters">
      {attributes.map((attribute) => {
        switch (attribute.inputType) {
          case 'DROPDOWN':
            return (
              <MultiSelectFilter
                key={attribute.id}
                name={attribute.name}
                values={attribute.values}
              />
            );
          case 'BOOLEAN':
            return (
              <ToggleFilter
                key={attribute.id}
                name={attribute.name}
              />
            );
          // Other filter types
        }
      })}
    </div>
  );
};
```

### 3. Dynamic Variant Generation

```tsx
// @cursor-pattern: Generating variant combinations based on attributes
const generateVariants = (attributes) => {
  // Get all attribute values
  const attributeValues = attributes.map(attr => 
    attr.values.map(value => ({ 
      attributeId: attr.id, 
      valueId: value.id 
    }))
  );
  
  // Generate combinations (cartesian product)
  const combinations = cartesianProduct(attributeValues);
  
  return combinations.map(combination => ({
    name: generateVariantName(combination, attributes),
    sku: generateSku(combination),
    attributes: combination
  }));
};
```

## Best Practices

### 1. Product Modeling

- Use Product Types to group similar products
- Create reusable attributes that can be shared across product types
- Leverage variant attributes for options like size, color
- Use product attributes for features that don't create variants

### 2. Content Modeling

- Use Page Types for different content structures
- Leverage rich text attributes for formatted content
- Use reference attributes to link related content
- Define clear attribute hierarchies

### 3. Performance Considerations

- Minimize the number of attributes queried at once
- Use pagination when querying products with many variants
- Leverage fragment caching for configured entity queries
- Preload common attribute configurations

## Common Configurator Operations

### Adding New Attribute to Existing Products

1. Create the attribute
2. Assign the attribute to product type(s)
3. Update existing products with values for the new attribute

### Creating Product Variants

1. Define variant attributes (size, color, etc.)
2. Generate all needed variant combinations
3. Set prices, SKUs, and stock information for each variant

### Customizing the Content Model

1. Create page types for different content structures
2. Define attributes for structured content
3. Implement custom UI components for editing/displaying content 