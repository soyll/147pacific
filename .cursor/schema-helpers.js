/**
 * Saleor GraphQL Schema Helpers
 * This file provides schema-specific helpers for Cursor AI
 */

// Common GraphQL fragments based on the schema
const fragments = {
  // Product basic fragment for listing pages
  productBasic: `
fragment ProductBasicFragment on Product {
  id
  name
  slug
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
      }
    }
  }
  category {
    id
    name
  }
}`,

  // Product variant fragment
  productVariant: `
fragment ProductVariantFragment on ProductVariant {
  id
  name
  sku
  pricing {
    price {
      gross {
        amount
        currency
      }
    }
    discount {
      gross {
        amount
        currency
      }
    }
  }
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
  media {
    url
    alt
  }
  quantityAvailable
}`,

  // Checkout fragment
  checkout: `
fragment CheckoutFragment on Checkout {
  id
  token
  email
  lines {
    id
    quantity
    variant {
      id
      name
      product {
        id
        name
        thumbnail {
          url
          alt
        }
      }
      pricing {
        price {
          gross {
            amount
            currency
          }
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
  totalPrice {
    gross {
      amount
      currency
    }
  }
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
  shippingAddress {
    firstName
    lastName
    streetAddress1
    streetAddress2
    city
    postalCode
    country {
      code
      country
    }
    phone
  }
  billingAddress {
    firstName
    lastName
    streetAddress1
    streetAddress2
    city
    postalCode
    country {
      code
      country
    }
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
}`
};

// Schema-specific query templates
const queryTemplates = {
  // Get product by ID with variants
  getProduct: `
query GetProduct($id: ID!, $channel: String!) {
  product(id: $id, channel: $channel) {
    ...ProductBasicFragment
    description
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
    media {
      url
      alt
    }
    variants {
      ...ProductVariantFragment
    }
    seoTitle
    seoDescription
  }
}

${fragments.productBasic}
${fragments.productVariant}`,

  // Get products by category with pagination
  getProductsByCategory: `
query GetProductsByCategory($categoryId: ID!, $channel: String!, $first: Int!, $after: String) {
  category(id: $categoryId) {
    id
    name
    description
    products(first: $first, after: $after, channel: $channel) {
      edges {
        node {
          ...ProductBasicFragment
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
}

${fragments.productBasic}`,

  // Search products
  searchProducts: `
query SearchProducts($search: String!, $channel: String!, $first: Int!, $after: String) {
  products(first: $first, after: $after, channel: $channel, filter: { search: $search }) {
    edges {
      node {
        ...ProductBasicFragment
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}

${fragments.productBasic}`
};

// Schema-specific mutation templates
const mutationTemplates = {
  // Create checkout
  createCheckout: `
mutation CreateCheckout($input: CheckoutCreateInput!) {
  checkoutCreate(input: $input) {
    checkout {
      ...CheckoutFragment
    }
    errors {
      field
      message
      code
    }
  }
}

${fragments.checkout}`,

  // Add product to checkout
  addCheckoutLines: `
mutation AddCheckoutLines($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
  checkoutLinesAdd(checkoutId: $checkoutId, lines: $lines) {
    checkout {
      ...CheckoutFragment
    }
    errors {
      field
      message
      code
    }
  }
}

${fragments.checkout}`,

  // Update checkout shipping address
  updateShippingAddress: `
mutation UpdateShippingAddress($checkoutId: ID!, $shippingAddress: AddressInput!) {
  checkoutShippingAddressUpdate(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
    checkout {
      ...CheckoutFragment
    }
    errors {
      field
      message
      code
    }
  }
}

${fragments.checkout}`,

  // Create product type with attributes
  createProductType: `
mutation CreateProductType(
  $name: String!,
  $slug: String,
  $hasVariants: Boolean!,
  $productAttributes: [ID!],
  $variantAttributes: [ID!]
) {
  productTypeCreate(input: {
    name: $name,
    slug: $slug,
    hasVariants: $hasVariants,
    productAttributes: $productAttributes,
    variantAttributes: $variantAttributes
  }) {
    productType {
      id
      name
      slug
      hasVariants
      productAttributes {
        id
        name
        slug
      }
      variantAttributes {
        id
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
}`
};

// Schema-specific component templates based on types
const componentTemplates = {
  // Product list component using the schema structure
  productList: `
interface ProductListProps {
  products: {
    edges: Array<{
      node: ProductBasicFragment;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    totalCount: number;
  };
  loading: boolean;
  onLoadMore: () => void;
  layoutType?: "grid" | "list";
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  onLoadMore,
  layoutType = "grid"
}) => {
  if (!products && loading) {
    return <ProductsLoadingSkeleton />;
  }
  
  if (!products?.edges.length) {
    return <EmptyProductsState />;
  }
  
  return (
    <div>
      <div className={\`grid \${layoutType === "grid" ? "grid-cols-3 gap-4" : "grid-cols-1 gap-2"}\`}>
        {products.edges.map(({ node }) => (
          <ProductCard key={node.id} product={node} layout={layoutType} />
        ))}
      </div>
      
      {products.pageInfo.hasNextPage && (
        <button 
          onClick={onLoadMore}
          disabled={loading}
          className="load-more-button"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}`,

  // Checkout component using the schema structure
  checkout: `
interface CheckoutProps {
  checkout: CheckoutFragment | null;
  loading: boolean;
  error?: any;
  onUpdateLine: (lineId: string, quantity: number) => void;
  onRemoveLine: (lineId: string) => void;
  onUpdateShippingAddress: (address: AddressInput) => void;
  onSelectShippingMethod: (methodId: string) => void;
  onCompleteCheckout: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  checkout,
  loading,
  error,
  onUpdateLine,
  onRemoveLine,
  onUpdateShippingAddress,
  onSelectShippingMethod,
  onCompleteCheckout
}) => {
  const [activeStep, setActiveStep] = useState<CheckoutStep>(CheckoutStep.CART);
  
  // Determine which step to show based on checkout state
  useEffect(() => {
    if (!checkout) {
      setActiveStep(CheckoutStep.CART);
    } else if (!checkout.shippingAddress) {
      setActiveStep(CheckoutStep.SHIPPING_ADDRESS);
    } else if (!checkout.shippingMethod) {
      setActiveStep(CheckoutStep.SHIPPING_METHOD);
    } else if (!checkout.billingAddress) {
      setActiveStep(CheckoutStep.BILLING);
    } else {
      setActiveStep(CheckoutStep.PAYMENT);
    }
  }, [checkout]);
  
  if (loading) {
    return <CheckoutSkeleton />;
  }
  
  if (error) {
    return <CheckoutError error={error} />;
  }
  
  if (!checkout || !checkout.lines.length) {
    return <EmptyCartState />;
  }
  
  return (
    <div className="checkout-container">
      <CheckoutStepNavigation 
        activeStep={activeStep} 
        onChange={setActiveStep}
        checkout={checkout}
      />
      
      <div className="checkout-content">
        {activeStep === CheckoutStep.CART && (
          <CartItems 
            lines={checkout.lines} 
            onUpdateLine={onUpdateLine}
            onRemoveLine={onRemoveLine}
          />
        )}
        
        {activeStep === CheckoutStep.SHIPPING_ADDRESS && (
          <ShippingAddressForm
            initialAddress={checkout.shippingAddress}
            onSubmit={onUpdateShippingAddress}
          />
        )}
        
        {activeStep === CheckoutStep.SHIPPING_METHOD && (
          <ShippingMethodSelector
            availableMethods={checkout.availableShippingMethods}
            selectedMethodId={checkout.shippingMethod?.id}
            onSelect={onSelectShippingMethod}
          />
        )}
        
        {}
      </div>
      
      <CheckoutSummary checkout={checkout} />
    </div>
  );
}`
};

// Schema-based interface templates
const interfaceTemplates = {
  // Product interface based on schema
  product: `
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail?: {
    url: string;
    alt?: string;
  };
  media: Array<{
    url: string;
    alt?: string;
  }>;
  pricing?: {
    priceRange?: {
      start?: {
        gross: {
          amount: number;
          currency: string;
        };
      };
    };
  };
  category?: {
    id: string;
    name: string;
  };
  attributes: Array<{
    attribute: {
      id: string;
      name: string;
      slug: string;
    };
    values: Array<{
      id: string;
      name: string;
    }>;
  }>;
  variants: ProductVariant[];
}`,

  // ProductVariant interface based on schema
  productVariant: `
interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  pricing?: {
    price?: {
      gross: {
        amount: number;
        currency: string;
      };
    };
    discount?: {
      gross: {
        amount: number;
        currency: string;
      };
    };
  };
  attributes: Array<{
    attribute: {
      id: string;
      name: string;
      slug: string;
    };
    values: Array<{
      id: string;
      name: string;
    }>;
  }>;
  media: Array<{
    url: string;
    alt?: string;
  }>;
  quantityAvailable: number;
}`
};

// Export all helpers
module.exports = {
  fragments,
  queryTemplates,
  mutationTemplates,
  componentTemplates,
  interfaceTemplates
}; 