// Saleor Schema-Aware Guidance
// This file provides instructions based on the actual GraphQL schema

// Key Product Types from Saleor Schema
const productTypes = {
  // Core product type with all available fields based on schema
  productType: `
query ProductWithCompleteDetails($id: ID!, $channel: String!) {
  product(id: $id, channel: $channel) {
    id
    name
    slug
    description
    seoTitle
    seoDescription
    rating
    isAvailable
    category {
      id
      name
      slug
    }
    collections {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
    media {
      id
      url
      alt
      type
    }
    thumbnail {
      url
      alt
    }
    pricing {
      priceRange {
        start {
          gross {
            amount
            currency
          }
          net {
            amount
            currency
          }
        }
        stop {
          gross {
            amount
            currency
          }
        }
      }
      discount {
        gross {
          amount
          currency
        }
      }
      onSale
    }
    isAvailableForPurchase
    availableForPurchase
    defaultVariant {
      id
      name
      sku
    }
    attributes {
      attribute {
        id
        name
        slug
        type
        inputType
      }
      values {
        id
        name
        slug
        reference
        boolean
        date
        dateTime
        value
        file {
          url
          contentType
        }
      }
    }
    variants {
      id
      name
      sku
      quantityAvailable
      trackInventory
      channelListings {
        channel {
          slug
          currencyCode
        }
        price {
          amount
          currency
        }
        costPrice {
          amount
          currency
        }
      }
      attributes {
        attribute {
          id
          name
          slug
          inputType
        }
        values {
          id
          name
          slug
          value
        }
      }
      media {
        id
        url
        alt
      }
    }
    weight {
      unit
      value
    }
    productType {
      id
      name
      slug
      hasVariants
      isShippingRequired
      taxClass {
        id
        name
      }
      productAttributes {
        id
        name
        slug
        inputType
      }
      variantAttributes {
        id
        name
        slug
        inputType
      }
    }
  }
}`,

  // Schema-aware product list with pagination, filtering and sorting
  productListQuery: `
query ProductList(
  $channel: String!,
  $first: Int!,
  $after: String,
  $filter: ProductFilterInput,
  $sortBy: ProductOrder
) {
  products(
    channel: $channel,
    first: $first,
    after: $after,
    filter: $filter,
    sortBy: $sortBy
  ) {
    edges {
      node {
        id
        name
        slug
        thumbnail {
          url
          alt
        }
        category {
          id
          name
          slug
        }
        pricing {
          priceRange {
            start {
              gross {
                amount
                currency
              }
            }
          }
          onSale
        }
        isAvailable
        attributes {
          attribute {
            id
            name
            slug
          }
          values {
            id
            name
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}`
};

// Transaction System Based on Schema
const transactionSchema = {
  // Transaction object structure based on schema
  transactionFields: `
fragment TransactionFields on Transaction {
  id
  issuedAt
  externalUrl
  authorizedAmount {
    amount
    currency
  }
  chargedAmount {
    amount
    currency
  }
  refundedAmount {
    amount
    currency
  }
  canceledAmount {
    amount
    currency
  }
  metadata {
    key
    value
  }
  type
  status
  reference
  pspReference
  actions
  events {
    id
    amount {
      amount
      currency
    }
    type
    createdAt
    status
    reference
    externalUrl
  }
  data
}`,

  // Comprehensive transaction initialization with all schema fields
  transactionInitialize: `
mutation TransactionInitialize($id: ID!, $amount: PositiveDecimal!, $paymentGateway: PaymentGatewayToInitialize!) {
  transactionInitialize(id: $id, amount: $amount, paymentGateway: $paymentGateway) {
    transaction {
      id
      issuedAt
      actions
      status
      type
      reference
      authorizedAmount {
        amount
        currency
      }
      chargedAmount {
        amount
        currency
      }
      refundedAmount {
        amount
        currency
      }
      canceledAmount {
        amount
        currency
      }
      data
    }
    transactionEvent {
      id
      amount {
        amount
        currency
      }
      type
      createdAt
      status
      reference
      externalUrl
    }
    errors {
      field
      message
      code
    }
  }
}`,

  // Complete transaction processing based on schema
  transactionProcess: `
mutation TransactionProcess($id: ID!, $data: JSON, $amount: PositiveDecimal) {
  transactionProcess(id: $id, data: $data, amount: $amount) {
    transaction {
      id
      status
      actions
      modifiedAt
      authorizedAmount {
        amount
        currency
      }
      chargedAmount {
        amount
        currency
      }
      refundedAmount {
        amount
        currency
      }
      canceledAmount {
        amount
        currency
      }
      events {
        id
        amount {
          amount
          currency
        }
        type
        createdAt
        status
        reference
        message
      }
    }
    transactionEvent {
      id
      amount {
        amount
        currency
      }
      type
      createdAt
      status
      reference
      externalUrl
    }
    errors {
      field
      message
      code
    }
  }
}`
};

// Attribute System Based on Actual Schema
const attributeSchema = {
  // Complete attribute structure based on schema
  attributeFields: `
fragment AttributeFields on Attribute {
  id
  name
  slug
  inputType
  entityType
  type
  unit
  choices(first: 100) {
    edges {
      node {
        id
        name
        slug
        value
        file {
          url
          contentType
        }
        reference
        richText
        boolean
        date
        dateTime
      }
    }
  }
  valueRequired
  visibleInStorefront
  filterableInStorefront
  filterableInDashboard
  availableInGrid
  storefrontSearchPosition
  withChoices
}`,

  // Attribute input types from schema
  attributeInputTypes: [
    "DROPDOWN",         // Single-choice selector
    "MULTISELECT",      // Multiple-choice selector
    "FILE",             // File upload
    "REFERENCE",        // Reference to another object
    "NUMERIC",          // Numeric value
    "RICH_TEXT",        // Rich text editor
    "PLAIN_TEXT",       // Plain text field
    "BOOLEAN",          // Boolean value (true/false)
    "DATE",             // Date selector
    "DATE_TIME",        // Date and time selector
    "SWATCH"            // Color swatch
  ],
  
  // Creating an attribute with all schema fields
  attributeCreate: `
mutation AttributeCreate($input: AttributeCreateInput!) {
  attributeCreate(input: $input) {
    attribute {
      id
      name
      slug
      inputType
      entityType
      type
      valueRequired
      visibleInStorefront
      filterableInStorefront
      filterableInDashboard
      availableInGrid
      withChoices
    }
    errors {
      field
      message
      code
    }
  }
}`
};

// Checkout System Based on Schema
const checkoutSchema = {
  // Complete checkout creation with all required fields
  checkoutCreate: `
mutation CheckoutCreate($input: CheckoutCreateInput!) {
  checkoutCreate(input: $input) {
    checkout {
      id
      token
      email
      channel {
        slug
      }
      billingAddress {
        firstName
        lastName
        companyName
        streetAddress1
        streetAddress2
        city
        cityArea
        postalCode
        country {
          code
          country
        }
        countryArea
        phone
      }
      shippingAddress {
        firstName
        lastName
        companyName
        streetAddress1
        streetAddress2
        city
        cityArea
        postalCode
        country {
          code
          country
        }
        countryArea
        phone
      }
      shippingMethod {
        id
        name
        price {
          amount
          currency
        }
      }
      availableShippingMethods {
        id
        name
        price {
          amount
          currency
        }
      }
      availablePaymentGateways {
        id
        name
        config {
          field
          value
        }
      }
      lines {
        id
        quantity
        totalPrice {
          gross {
            amount
            currency
          }
        }
        variant {
          id
          name
          product {
            id
            name
            thumbnail {
              url
            }
          }
        }
      }
      discount {
        amount
        currency
      }
      discountName
      translatedDiscountName
      voucherCode
      subtotalPrice {
        gross {
          amount
          currency
        }
      }
      shippingPrice {
        gross {
          amount
          currency
        }
      }
      totalPrice {
        gross {
          amount
          currency
        }
        tax {
          amount
          currency
        }
      }
    }
    errors {
      field
      message
      code
    }
  }
}`,

  // All checkout mutations based on schema
  checkoutMutations: {
    addLines: `
mutation CheckoutLinesAdd($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
  checkoutLinesAdd(checkoutId: $checkoutId, lines: $lines) {
    checkout {
      id
      lines {
        id
        quantity
        variant {
          id
          name
        }
        totalPrice {
          gross {
            amount
            currency
          }
        }
      }
      totalPrice {
        gross {
          amount
          currency
        }
      }
    }
    errors {
      field
      message
      code
    }
  }
}`,

    updateLines: `
mutation CheckoutLinesUpdate($checkoutId: ID!, $lines: [CheckoutLineUpdateInput!]!) {
  checkoutLinesUpdate(checkoutId: $checkoutId, lines: $lines) {
    checkout {
      id
      lines {
        id
        quantity
        variant {
          id
          name
        }
      }
      totalPrice {
        gross {
          amount
          currency
        }
      }
    }
    errors {
      field
      message
      code
    }
  }
}`,

    deliveryMethod: `
mutation CheckoutDeliveryMethodUpdate($checkoutId: ID!, $deliveryMethodId: ID) {
  checkoutDeliveryMethodUpdate(checkoutId: $checkoutId, deliveryMethodId: $deliveryMethodId) {
    checkout {
      id
      deliveryMethod {
        __typename
        ... on ShippingMethod {
          id
          name
          price {
            amount
            currency
          }
        }
      }
      shippingPrice {
        gross {
          amount
          currency
        }
      }
      totalPrice {
        gross {
          amount
          currency
        }
      }
    }
    errors {
      field
      message
      code
    }
  }
}`
  }
};

// Schema-aware App Integration
const appSchema = {
  // App installation mutation based on schema
  appInstall: `
mutation AppInstall($input: AppInstallInput!) {
  appInstall(input: $input) {
    appInstallation {
      id
      status
      appName
      manifestUrl
    }
    errors {
      field
      message
      code
    }
  }
}`,

  // Comprehensive webhook registration based on schema
  webhookCreate: `
mutation WebhookCreate($input: WebhookCreateInput!) {
  webhookCreate(input: $input) {
    webhook {
      id
      name
      isActive
      app {
        id
        name
      }
      asyncEvents
      syncEvents
      targetUrl
      subscriptionQuery
      secretKey
    }
    errors {
      field
      message
      code
    }
  }
}`,

  // Payment gateway configuration based on schema
  paymentGatewayInitialize: `
mutation PaymentGatewayInitialize($gatewayId: ID!, $id: ID!, $paymentGateways: [PaymentGatewayToInitialize!]!) {
  paymentGatewayInitialize(gatewayId: $gatewayId, id: $id, paymentGateways: $paymentGateways) {
    gatewayConfigs {
      id
      data
      errors {
        field
        message
        code
      }
    }
    errors {
      field
      message
      code
    }
  }
}`
};

// Implementation Patterns Based on Schema
const implementationPatterns = {
  // Dynamic variant selector based on schema structure
  variantSelector: `
// React component to select variants based on attribute combinations
const VariantSelector = ({ product, onVariantChange }) => {
  // Track selected attribute values
  const [selectedAttributes, setSelectedAttributes] = useState({});
  
  // Get variant attributes from product type
  const variantAttributes = product?.productType?.variantAttributes || [];
  
  // Find matching variant based on selected attributes
  const findMatchingVariant = useCallback(() => {
    if (!product?.variants || Object.keys(selectedAttributes).length === 0) {
      return product?.variants?.[0] || null;
    }
    
    return product.variants.find(variant => 
      Object.entries(selectedAttributes).every(([attributeId, valueId]) => {
        const attributeValue = variant.attributes.find(
          attr => attr.attribute.id === attributeId
        );
        return attributeValue && attributeValue.values.some(v => v.id === valueId);
      })
    );
  }, [product, selectedAttributes]);
  
  // Update selected variant when attributes change
  useEffect(() => {
    const matchingVariant = findMatchingVariant();
    if (matchingVariant) {
      onVariantChange(matchingVariant);
    }
  }, [selectedAttributes, findMatchingVariant, onVariantChange]);
  
  // Handle attribute selection change
  const handleAttributeChange = (attributeId, valueId) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeId]: valueId
    }));
  };
  
  return (
    <div className="variant-selector">
      {variantAttributes.map(attribute => (
        <div key={attribute.id} className="attribute-selector">
          <label className="attribute-label">{attribute.name}</label>
          <div className="attribute-values">
            {attribute.choices?.edges.map(({node: value}) => {
              const isSelected = selectedAttributes[attribute.id] === value.id;
              
              return (
                <button
                  key={value.id}
                  className={\`attribute-value \${isSelected ? 'selected' : ''}\`}
                  onClick={() => handleAttributeChange(attribute.id, value.id)}
                >
                  {value.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}`,

  // Product card component based on schema fields
  productCard: `
// ProductCard component with all required fields based on schema
const ProductCard = ({ product, channel }) => {
  const pricing = product?.pricing;
  const price = pricing?.priceRange?.start?.gross;
  const isOnSale = pricing?.onSale;
  const discount = pricing?.discount?.gross;
  
  return (
    <Link href={\`/products/\${product.slug}\`} className="product-card">
      <div className="product-thumbnail">
        {product.thumbnail && (
          <Image 
            src={product.thumbnail.url} 
            alt={product.thumbnail.alt || product.name}
            width={300}
            height={300}
            layout="responsive"
          />
        )}
        {isOnSale && <span className="sale-badge">Sale</span>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        {product.category && (
          <p className="product-category">{product.category.name}</p>
        )}
        
        <div className="product-price">
          {isOnSale && discount && (
            <span className="original-price">
              {formatPrice(price)}
            </span>
          )}
          
          <span className={\`current-price \${isOnSale ? 'sale-price' : ''}\`}>
            {formatPrice(isOnSale && discount 
              ? { amount: price.amount - discount.amount, currency: price.currency }
              : price
            )}
          </span>
        </div>
        
        {!product.isAvailable && (
          <span className="out-of-stock">Out of stock</span>
        )}
      </div>
    </Link>
  );
}`
};

// Channel configuration based on schema
const channelConfiguration = {
  channelCreate: `
mutation ChannelCreate($input: ChannelCreateInput!) {
  channelCreate(input: $input) {
    channel {
      id
      name
      slug
      currencyCode
      defaultCountry {
        code
        country
      }
      isActive
      hasOrders
    }
    errors {
      field
      message
      code
    }
  }
}`,

  // Context provider for multi-channel support
  channelContext: `
// Channel context provider based on the schema structure
export const ChannelContext = createContext();

export const ChannelProvider = ({ children, initialChannel }) => {
  const [activeChannel, setActiveChannel] = useState(initialChannel);
  
  const { data } = useQuery(GET_CHANNELS);
  const availableChannels = data?.channels?.edges.map(edge => edge.node) || [];
  
  const changeChannel = useCallback((channelSlug) => {
    const channel = availableChannels.find(ch => ch.slug === channelSlug);
    if (channel) {
      setActiveChannel(channel);
      localStorage.setItem('activeChannel', JSON.stringify(channel));
    }
  }, [availableChannels]);
  
  // Memoize context value
  const contextValue = useMemo(() => ({
    activeChannel,
    availableChannels,
    changeChannel
  }), [activeChannel, availableChannels, changeChannel]);
  
  return (
    <ChannelContext.Provider value={contextValue}>
      {children}
    </ChannelContext.Provider>
  );
};

// Custom hook for accessing channel context
export const useChannel = () => {
  const context = useContext(ChannelContext);
  if (!context) {
    throw new Error('useChannel must be used within a ChannelProvider');
  }
  return context;
};`
};

module.exports = {
  productTypes,
  transactionSchema,
  attributeSchema,
  checkoutSchema,
  appSchema,
  implementationPatterns,
  channelConfiguration
}; 