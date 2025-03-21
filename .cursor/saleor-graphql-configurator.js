// Saleor GraphQL and Configurator Guidance
// This file provides focused instructions for Cursor AI on Saleor's GraphQL and Configurator patterns

// GraphQL Schema Awareness - Key patterns for working with Saleor's GraphQL API
const saleorGraphQLPatterns = {
  // Always include channel in product-related queries
  productQuery: `
query ProductDetails($id: ID!, $channel: String!) {
  product(id: $id, channel: $channel) {
    id
    name
    slug
    description
    thumbnail { url, alt }
    pricing {
      priceRange {
        start { gross { amount, currency } }
      }
      discount { gross { amount, currency } }
      onSale
    }
    category { id, name, slug }
    attributes {
      attribute { id, name, slug }
      values { id, name }
    }
    variants {
      id
      name
      sku
      quantityAvailable
      pricing { price { gross { amount, currency } } }
      attributes {
        attribute { id, name, slug }
        values { id, name }
      }
    }
  }
}`,

  // Product list with pagination and filtering
  productsQuery: `
query Products($channel: String!, $first: Int!, $after: String, $filter: ProductFilterInput) {
  products(channel: $channel, first: $first, after: $after, filter: $filter) {
    edges {
      node {
        id
        name
        slug
        thumbnail { url, alt }
        pricing {
          priceRange {
            start { gross { amount, currency } }
          }
        }
        category { name }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}`,

  // Checkout flow - standard sequence of operations
  checkoutFlow: {
    create: `
mutation CheckoutCreate($input: CheckoutCreateInput!) {
  checkoutCreate(input: $input) {
    checkout { id, token, totalPrice { gross { amount, currency } } }
    errors { field, message, code }
  }
}`,

    addLines: `
mutation CheckoutLinesAdd($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
  checkoutLinesAdd(checkoutId: $checkoutId, lines: $lines) {
    checkout { id, totalPrice { gross { amount, currency } } }
    errors { field, message, code }
  }
}`,

    shippingAddress: `
mutation CheckoutShippingAddressUpdate($checkoutId: ID!, $shippingAddress: AddressInput!) {
  checkoutShippingAddressUpdate(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
    checkout { id, shippingMethods { id, name, price { amount, currency } } }
    errors { field, message, code }
  }
}`,

    shippingMethod: `
mutation CheckoutShippingMethodUpdate($checkoutId: ID!, $shippingMethodId: ID!) {
  checkoutShippingMethodUpdate(checkoutId: $checkoutId, shippingMethodId: $shippingMethodId) {
    checkout { id, totalPrice { gross { amount, currency } } }
    errors { field, message, code }
  }
}`,

    paymentCreate: `
mutation CheckoutPaymentCreate($checkoutId: ID!, $input: PaymentInput!) {
  checkoutPaymentCreate(checkoutId: $checkoutId, input: $input) {
    payment { id, gateway, token }
    errors { field, message, code }
  }
}`,

    complete: `
mutation CheckoutComplete($checkoutId: ID!) {
  checkoutComplete(checkoutId: $checkoutId) {
    order { id, status, number, total { gross { amount, currency } } }
    errors { field, message, code }
  }
}`,
  },

  // Transactions - modern payment flow
  transactionFlow: {
    initialize: `
mutation TransactionInitialize($id: ID!, $amount: PositiveDecimal!, $paymentGateway: PaymentGatewayToInitialize!) {
  transactionInitialize(id: $id, amount: $amount, paymentGateway: $paymentGateway) {
    transaction {
      id
      actions
      status
      createdAt
      authorizedAmount { amount, currency }
      chargedAmount { amount, currency }
      data
    }
    errors { field, message, code }
  }
}`,

    process: `
mutation TransactionProcess($id: ID!, $data: JSON) {
  transactionProcess(id: $id, data: $data) {
    transaction {
      id
      status
      events {
        id
        type
        status
        reference
      }
    }
    errors { field, message, code }
  }
}`,
  },

  // Query fragments pattern - reuse common field sets
  fragments: `
// Product variant fragment
fragment ProductVariantFields on ProductVariant {
  id
  name
  sku
  quantityAvailable
  pricing {
    price { gross { amount, currency } }
    onSale
    discount { gross { amount } }
  }
  attributes {
    attribute { id, name, slug }
    values { id, name }
  }
}

// Error fragment
fragment ErrorFragment on CheckoutError {
  field
  message
  code
}`,

  // Best practices for GraphQL in Saleor
  bestPractices: [
    "Always include error handling for all mutations",
    "Use fragments for common field sets across queries",
    "Always include channel in product-related queries",
    "Use pagination with first/after parameters for lists",
    "Include proper error handling and loading states",
    "Cache queries that don't change frequently",
    "Use TypeScript types generated from the GraphQL schema"
  ]
};

// Configurator Patterns - Working with the Saleor Configurator
const configuratorPatterns = {
  // Product Type Definition
  productTypeDefinition: `
# Basic product type without variants
productTypes:
  - name: "Digital Book"
    hasVariants: false
    isShippingRequired: false
    isDigital: true
    weight: 0
    productAttributes:
      - name: "Author"
        inputType: "DROPDOWN"
        values:
          - name: "J.K. Rowling"
          - name: "George R.R. Martin"
      - name: "Pages"
        inputType: "NUMERIC"
      - name: "Publisher"
        inputType: "PLAIN_TEXT"
      - name: "Description"
        inputType: "RICH_TEXT"

# Product type with variants
productTypes:
  - name: "T-Shirt"
    hasVariants: true
    isShippingRequired: true
    weight: 0.5
    productAttributes:
      - name: "Material"
        inputType: "DROPDOWN"
        values:
          - name: "Cotton"
          - name: "Polyester"
      - name: "Care Instructions"
        inputType: "RICH_TEXT"
    variantAttributes:
      - name: "Size"
        inputType: "DROPDOWN"
        values:
          - name: "S"
          - name: "M"
          - name: "L"
          - name: "XL"
      - name: "Color"
        inputType: "SWATCH"
        values:
          - name: "White"
          - name: "Black"
          - name: "Red"
          - name: "Blue"`,

  // Attribute Types and Their Input Types
  attributeTypes: [
    { name: "DROPDOWN", description: "Single select dropdown" },
    { name: "MULTISELECT", description: "Multiple choice selector" },
    { name: "BOOLEAN", description: "True/false values" },
    { name: "NUMERIC", description: "Numbers only" },
    { name: "RICH_TEXT", description: "Formatted text editor" },
    { name: "PLAIN_TEXT", description: "Simple text field" },
    { name: "DATE", description: "Date picker" },
    { name: "DATE_TIME", description: "Date and time picker" },
    { name: "SWATCH", description: "Color or texture samples" },
    { name: "REFERENCE", description: "References to other objects" },
    { name: "FILE", description: "File uploads" }
  ],

  // Channel Configuration
  channelConfiguration: `
channels:
  - name: "US Store"
    slug: "us-store"
    currencyCode: "USD"
    defaultCountry: "US"
    defaultLocale: "en-US"
    stockSettings:
      trackInventory: true
      reserveStock: true
      allocationStrategy: "PRIORITIZE_SORTING_ORDER"
    orderSettings:
      automaticallyConfirmAllNewOrders: true
      automaticallyFulfillNonShippableGiftCard: true
      expireOrdersAfter: 30
      allowUnpaidOrders: true
      
  - name: "EU Store"
    slug: "eu-store"
    currencyCode: "EUR"
    defaultCountry: "DE"
    supportedCountries:
      - "DE"
      - "FR"
      - "IT"
      - "ES"
    defaultLocale: "en-GB"
    stockSettings:
      trackInventory: true
      reserveStock: true
    orderSettings:
      automaticallyConfirmAllNewOrders: false
      expireOrdersAfter: 14`,
  
  // Content Modeling with Page Types
  pageTypes: `
pageTypes:
  - name: "Blog Post"
    attributes:
      - name: "Title"
        inputType: "PLAIN_TEXT"
      - name: "Author"
        inputType: "DROPDOWN"
        values:
          - name: "Admin"
          - name: "Editor"
          - name: "Guest Contributor"
      - name: "PublishDate"
        inputType: "DATE"
      - name: "Content"
        inputType: "RICH_TEXT"
      - name: "Category"
        inputType: "MULTISELECT"
        values:
          - name: "News"
          - name: "Tutorial"
          - name: "Product Update"
      - name: "FeaturedImage"
        inputType: "FILE"`,
  
  // Shop Configuration
  shopConfiguration: `
shop:
  name: "My Saleor Store"
  description: "Modern e-commerce platform"
  customerAllowedToSetExternalReference: true
  defaultMailSenderName: "Saleor Team"
  defaultMailSenderAddress: "noreply@example.com"
  limitQuantityPerCheckout: 50
  displayGrossPrices: true
  chargeTaxesOnShipping: true
  includeTaxesInPrices: true
  allowOrder: true
  reserveStockDurationAnonymousUser: 60
  reserveStockDurationAuthenticatedUser: 120`,
  
  // Best practices for Configurator usage
  bestPractices: [
    "Plan your attribute structure before creating product types",
    "Only use variant attributes for options that create distinct product variants",
    "Use product attributes for features that don't create new variants",
    "Consider performance impact of creating too many variants",
    "Test your data model with sample products before mass import",
    "Use channels for different storefronts, regions, or business models",
    "Create attribute groups for better organization when you have many attributes",
    "Set appropriate stock allocation strategy based on your business needs"
  ],

  // Common Implementation Patterns
  implementationPatterns: {
    // Product variant generation
    variantGeneration: `
// Function to generate variants from attribute combinations
function generateProductVariants(attributeSets) {
  // Use cartesian product to generate all combinations
  const cartesianProduct = (arr) => {
    return arr.reduce(
      (acc, set) => {
        return acc.flatMap(combo => {
          return set.map(item => [...combo, item]);
        });
      },
      [[]]
    );
  };

  // Format each attributes set as {attributeId, value}
  const formattedSets = attributeSets.map(attr => 
    attr.values.map(val => ({ 
      attributeId: attr.id, 
      value: val 
    }))
  );

  // Generate all combinations
  return cartesianProduct(formattedSets);
}`,

    // Dynamic form generation for attribute types
    attributeFormRendering: `
// React component to render proper form field based on attribute type
const AttributeField = ({ attribute, value, onChange }) => {
  const renderField = () => {
    switch (attribute.inputType) {
      case 'DROPDOWN':
        return (
          <select 
            value={value} 
            onChange={(e) => onChange(attribute.id, e.target.value)}
          >
            <option value="">Select {attribute.name}</option>
            {attribute.values.map(val => (
              <option key={val.id} value={val.id}>
                {val.name}
              </option>
            ))}
          </select>
        );
      
      case 'MULTISELECT':
        return (
          <fieldset>
            <legend>{attribute.name}</legend>
            {attribute.values.map(val => (
              <label key={val.id}>
                <input 
                  type="checkbox"
                  checked={value?.includes(val.id)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...(value || []), val.id]
                      : (value || []).filter(id => id !== val.id);
                    onChange(attribute.id, newValue);
                  }}
                />
                {val.name}
              </label>
            ))}
          </fieldset>
        );
      
      case 'BOOLEAN':
        return (
          <label>
            <input 
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(attribute.id, e.target.checked)}
            />
            {attribute.name}
          </label>
        );
      
      case 'NUMERIC':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(attribute.id, e.target.value)}
            placeholder={attribute.name}
          />
        );
      
      // Add cases for other attribute types...
      
      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(attribute.id, e.target.value)}
            placeholder={attribute.name}
          />
        );
    }
  };

  return (
    <div className="attribute-field">
      <label>{attribute.name}</label>
      {renderField()}
    </div>
  );
}`
  }
};

// Data model extension patterns
const dataModelExtensionPatterns = {
  // Extending the schema with custom attributes
  addingNewAttributes: `
# Adding a new attribute to an existing product type
mutations:
  - type: "attribute"
    operation: "attributeCreate"
    data:
      name: "Sustainability Rating"
      inputType: "DROPDOWN"
      values:
        - name: "Bronze"
        - name: "Silver"
        - name: "Gold"
      
  - type: "productType"
    operation: "productTypeUpdate"
    where:
      name: "T-Shirt"
    data:
      addAttributes: ["Sustainability Rating"]`,
  
  // Creating a complete product with attributes and variants
  completeProductDefinition: `
# Define a complete product with variants
mutations:
  - type: "product"
    operation: "productCreate"
    data:
      name: "Lightweight Cotton T-Shirt"
      description: "Premium cotton t-shirt, perfect for everyday wear."
      productType: "T-Shirt"
      category: "Apparel"
      attributes:
        - attribute: "Material"
          values: ["Cotton"]
        - attribute: "Care Instructions"
          values: ["Machine wash cold, tumble dry low"]
        - attribute: "Sustainability Rating"
          values: ["Silver"]
      
  - type: "productVariant"
    operation: "productVariantBulkCreate"
    where: 
      product: "Lightweight Cotton T-Shirt"
    data:
      variants:
        - sku: "TS-WHT-S"
          attributes:
            - attribute: "Color"
              values: ["White"]
            - attribute: "Size" 
              values: ["S"]
          channelListings:
            - channel: "US Store"
              price: "19.99"
              costPrice: "5.50"
            - channel: "EU Store"
              price: "18.99"
              costPrice: "5.00"
        
        - sku: "TS-BLK-M"
          attributes:
            - attribute: "Color"
              values: ["Black"]
            - attribute: "Size"
              values: ["M"]
          channelListings:
            - channel: "US Store"
              price: "19.99"
              costPrice: "5.50"
            - channel: "EU Store"
              price: "18.99"
              costPrice: "5.00"`
};

module.exports = {
  saleorGraphQLPatterns,
  configuratorPatterns,
  dataModelExtensionPatterns
}; 