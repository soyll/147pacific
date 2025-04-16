/**
 * Saleor Configurator YAML Patterns
 * 
 * This file provides guidance for working with YAML configuration in the Saleor Configurator
 * Based on the actual implementation and config.yml examples
 */

const configuratorYamlPatterns = {
  /**
   * Complete Config.yml Structure
   * 
   * The full structure of a config.yml file with all possible sections
   */
  completeConfigYml: `
# Shop settings
shop:
  customerAllowedToSetExternalReference: false
  defaultMailSenderName: "Saleor Store"
  defaultMailSenderAddress: "store@example.com"
  displayGrossPrices: true
  enableAccountConfirmationByEmail: true
  limitQuantityPerCheckout: 50
  trackInventoryByDefault: true
  reserveStockDurationAnonymousUser: 60
  reserveStockDurationAuthenticatedUser: 120
  defaultDigitalMaxDownloads: 5
  defaultDigitalUrlValidDays: 30
  defaultWeightUnit: KG
  allowLoginWithoutConfirmation: false

# Channels
channels:
  - name: Default Channel
    currencyCode: USD
    defaultCountry: US
    slug: default-channel
    settings:
      allocationStrategy: PRIORITIZE_SORTING_ORDER
      automaticallyConfirmAllNewOrders: true
      automaticallyFulfillNonShippableGiftCard: true
      expireOrdersAfter: 30
      deleteExpiredOrdersAfter: 60
      markAsPaidStrategy: TRANSACTION_FLOW
      allowUnpaidOrders: false
      includeDraftOrderInVoucherUsage: true
      useLegacyErrorFlow: false
      automaticallyCompleteFullyPaidCheckouts: true
      defaultTransactionFlowStrategy: AUTHORIZATION

# Product Types
productTypes:
  - name: T-Shirt
    hasVariants: true
    isShippingRequired: true
    weight: 0.5
    attributes:
      - name: Size
        inputType: DROPDOWN
        values:
          - name: Small
          - name: Medium
          - name: Large
          - name: XL
      - name: Color
        inputType: DROPDOWN
        values:
          - name: Red
          - name: Blue
          - name: Green
          - name: Black
          - name: White
      - name: Material
        inputType: PLAIN_TEXT
      - name: Brand
        inputType: PLAIN_TEXT

  - name: Digital Product
    isDigital: true
    hasVariants: false
    attributes:
      - name: Format
        inputType: DROPDOWN
        values:
          - name: PDF
          - name: MP3
          - name: MP4
          - name: EPUB
      - name: License
        inputType: DROPDOWN
        values:
          - name: Personal Use
          - name: Commercial Use

# Page Types
pageTypes:
  - name: Blog Post
    attributes:
      - name: Author
        inputType: PLAIN_TEXT
      - name: PublishDate
        inputType: DATE
      - name: Tags
        inputType: MULTISELECT
        values:
          - name: News
          - name: Tutorial
          - name: Feature
  
  - name: Landing Page
    attributes:
      - name: HeroImage
        inputType: REFERENCE
        entityType: PRODUCT
      - name: SEODescription
        inputType: RICH_TEXT

# Standalone Attributes
attributes:
  - name: Global Brand
    type: PRODUCT_TYPE
    inputType: DROPDOWN
    values:
      - name: Premium
      - name: Standard
      - name: Economy
  
  - name: Review Rating
    type: PRODUCT_TYPE
    inputType: DROPDOWN
    values:
      - name: 1 Star
      - name: 2 Stars
      - name: 3 Stars
      - name: 4 Stars
      - name: 5 Stars
`,

  /**
   * Shop Settings Section
   * 
   * All available shop settings and their descriptions
   */
  shopSettings: {
    example: `
shop:
  customerAllowedToSetExternalReference: false
  defaultMailSenderName: "Saleor Store"
  defaultMailSenderAddress: "store@example.com"
  displayGrossPrices: true
  enableAccountConfirmationByEmail: true
  limitQuantityPerCheckout: 50
  trackInventoryByDefault: true
  reserveStockDurationAnonymousUser: 60
  reserveStockDurationAuthenticatedUser: 120
  defaultDigitalMaxDownloads: 5
  defaultDigitalUrlValidDays: 30
  defaultWeightUnit: KG
  allowLoginWithoutConfirmation: false
`,
    
    fields: [
      { name: "customerAllowedToSetExternalReference", type: "boolean", description: "Allow customers to set external reference IDs" },
      { name: "defaultMailSenderName", type: "string", description: "Default sender name for emails" },
      { name: "defaultMailSenderAddress", type: "string", description: "Default sender email address" },
      { name: "displayGrossPrices", type: "boolean", description: "Whether to display gross prices (including tax)" },
      { name: "enableAccountConfirmationByEmail", type: "boolean", description: "Require email confirmation for account creation" },
      { name: "limitQuantityPerCheckout", type: "integer", description: "Maximum quantity of a single product in checkout" },
      { name: "trackInventoryByDefault", type: "boolean", description: "Track inventory for new products by default" },
      { name: "reserveStockDurationAnonymousUser", type: "integer", description: "Duration in minutes to reserve stock for anonymous users" },
      { name: "reserveStockDurationAuthenticatedUser", type: "integer", description: "Duration in minutes to reserve stock for authenticated users" },
      { name: "defaultDigitalMaxDownloads", type: "integer", description: "Maximum download count for digital products" },
      { name: "defaultDigitalUrlValidDays", type: "integer", description: "Number of days download links remain valid" },
      { name: "defaultWeightUnit", type: "enum", values: ["KG", "LB", "OZ", "G", "TONNE"], description: "Default weight unit" },
      { name: "allowLoginWithoutConfirmation", type: "boolean", description: "Allow login before email confirmation" },
    ]
  },

  /**
   * Channel Configuration
   * 
   * How to configure sales channels
   */
  channelConfiguration: {
    example: `
channels:
  - name: Default Channel
    currencyCode: USD
    defaultCountry: US
    slug: default-channel
    settings:
      allocationStrategy: PRIORITIZE_SORTING_ORDER
      automaticallyConfirmAllNewOrders: true
      automaticallyFulfillNonShippableGiftCard: true
      expireOrdersAfter: 30
      deleteExpiredOrdersAfter: 60
      markAsPaidStrategy: TRANSACTION_FLOW
      allowUnpaidOrders: false
      includeDraftOrderInVoucherUsage: true
      useLegacyErrorFlow: false
      automaticallyCompleteFullyPaidCheckouts: true
      defaultTransactionFlowStrategy: AUTHORIZATION
  
  - name: Mobile App
    currencyCode: EUR
    defaultCountry: DE
    slug: mobile-app
`,
    
    fields: [
      { name: "name", type: "string", required: true, description: "Display name of the channel" },
      { name: "currencyCode", type: "string", required: true, description: "Three-letter currency code (USD, EUR, etc.)" },
      { name: "defaultCountry", type: "string", required: true, description: "Two-letter country code (US, GB, etc.)" },
      { name: "slug", type: "string", required: true, description: "Unique identifier for the channel, URL-friendly" },
    ],
    
    settings: [
      { name: "allocationStrategy", type: "enum", values: ["PRIORITIZE_SORTING_ORDER", "PRIORITIZE_HIGH_STOCK"], description: "Stock allocation strategy" },
      { name: "automaticallyConfirmAllNewOrders", type: "boolean", description: "Automatically confirm new orders" },
      { name: "automaticallyFulfillNonShippableGiftCard", type: "boolean", description: "Auto-fulfill gift cards (they don't need shipping)" },
      { name: "expireOrdersAfter", type: "integer", description: "Days after which unfulfilled/unpaid orders expire" },
      { name: "deleteExpiredOrdersAfter", type: "integer", description: "Days after expiration to delete orders" },
      { name: "markAsPaidStrategy", type: "enum", values: ["TRANSACTION_FLOW", "PAYMENT_FLOW"], description: "Strategy for marking orders as paid" },
      { name: "allowUnpaidOrders", type: "boolean", description: "Allow orders to be created without payment" },
      { name: "includeDraftOrderInVoucherUsage", type: "boolean", description: "Count voucher use in draft orders" },
      { name: "useLegacyErrorFlow", type: "boolean", description: "Use legacy error handling" },
      { name: "automaticallyCompleteFullyPaidCheckouts", type: "boolean", description: "Auto-complete checkout when fully paid" },
      { name: "defaultTransactionFlowStrategy", type: "enum", values: ["AUTHORIZATION", "CHARGE"], description: "Default transaction handling strategy" },
    ]
  },

  /**
   * Product Type Configuration
   * 
   * How to define product types and their attributes
   */
  productTypeConfiguration: {
    example: `
productTypes:
  - name: T-Shirt
    hasVariants: true
    isShippingRequired: true
    weight: 0.5
    attributes:
      - name: Size
        inputType: DROPDOWN
        values:
          - name: Small
          - name: Medium
          - name: Large
          - name: XL
      - name: Color
        inputType: DROPDOWN
        values:
          - name: Red
          - name: Blue
          - name: Green
          - name: Black
          - name: White
      - name: Material
        inputType: PLAIN_TEXT
      - name: Brand
        inputType: PLAIN_TEXT
`,
    
    fields: [
      { name: "name", type: "string", required: true, description: "Product type name" },
      { name: "hasVariants", type: "boolean", description: "Whether products of this type have variants" },
      { name: "isShippingRequired", type: "boolean", description: "Whether products require shipping" },
      { name: "isDigital", type: "boolean", description: "Whether this is a digital product" },
      { name: "weight", type: "float", description: "Default weight in the store's weight unit" },
      { name: "taxClass", type: "string", description: "Tax class name" },
      { name: "kind", type: "enum", values: ["NORMAL", "GIFT_CARD"], description: "Product kind" },
    ],
    
    varsVsAttrs: `
# Understanding Variants vs Regular Attributes

In Saleor, a product type can have two kinds of attributes:
1. Regular attributes (product attributes): These apply to the entire product
2. Variant attributes: These create different variants of the product

For example:
- "Brand" is a regular attribute because it applies to the entire product
- "Size" is a variant attribute because it creates different variants

In config.yml, you simply define all attributes under "attributes", and
the Configurator will determine their type based on your product type settings.

If hasVariants: true, then attributes like Size and Color will typically 
become variant attributes, while informational attributes like Brand 
and Material will be regular product attributes.
`
  },

  /**
   * Attribute Configuration
   * 
   * How to configure attributes with different input types
   */
  attributeConfiguration: {
    allInputTypes: [
      "DROPDOWN",     // Single selection from dropdown
      "MULTISELECT",  // Multiple selection
      "SWATCH",       // Color/image swatch
      "REFERENCE",    // Reference to another entity
      "PLAIN_TEXT",   // Simple text
      "NUMERIC",      // Numbers
      "DATE",         // Date picker
      "BOOLEAN",      // True/false
      "RICH_TEXT",    // Formatted text editor
      "DATE_TIME",    // Date and time
      "FILE"          // File upload
    ],
    
    dropdownExample: `
attributes:
  - name: Size
    type: PRODUCT_TYPE  # This is required for standalone attributes
    inputType: DROPDOWN
    values:
      - name: Small
      - name: Medium
      - name: Large
      - name: XL
`,
    
    multiselectExample: `
attributes:
  - name: Tags
    type: PRODUCT_TYPE
    inputType: MULTISELECT
    values:
      - name: New
      - name: Sale
      - name: Featured
      - name: Limited Edition
`,
    
    swatchExample: `
attributes:
  - name: Color
    type: PRODUCT_TYPE
    inputType: SWATCH
    values:
      - name: Red
      - name: Green
      - name: Blue
      - name: Black
      - name: White
`,
    
    referenceExample: `
attributes:
  - name: Related Products
    type: PRODUCT_TYPE
    inputType: REFERENCE
    entityType: PRODUCT  # Required for reference attributes
`,
    
    simpleTypes: `
attributes:
  - name: Description
    type: PRODUCT_TYPE
    inputType: RICH_TEXT
    
  - name: ReleaseDate
    type: PRODUCT_TYPE
    inputType: DATE
    
  - name: Price
    type: PRODUCT_TYPE
    inputType: NUMERIC
    
  - name: IsOnSale
    type: PRODUCT_TYPE
    inputType: BOOLEAN
    
  - name: SKU
    type: PRODUCT_TYPE
    inputType: PLAIN_TEXT
`
  },

  /**
   * Page Type Configuration
   * 
   * How to configure page types and their attributes
   */
  pageTypeConfiguration: {
    example: `
pageTypes:
  - name: Blog Post
    attributes:
      - name: Author
        inputType: PLAIN_TEXT
      - name: PublishDate
        inputType: DATE
      - name: Tags
        inputType: MULTISELECT
        values:
          - name: News
          - name: Tutorial
          - name: Feature
      - name: Content
        inputType: RICH_TEXT
`,
    
    fields: [
      { name: "name", type: "string", required: true, description: "Page type name" },
    ]
  },

  /**
   * Common YAML Patterns
   */
  commonPatterns: {
    // Single product type with multiple attribute types
    complexProductType: `
productTypes:
  - name: Smartphone
    hasVariants: true
    isShippingRequired: true
    weight: 0.3
    attributes:
      # Dropdown attribute with predefined values
      - name: Storage
        inputType: DROPDOWN
        values:
          - name: 64GB
          - name: 128GB
          - name: 256GB
          - name: 512GB
      
      # Another dropdown for color selection
      - name: Color
        inputType: DROPDOWN
        values:
          - name: Black
          - name: White
          - name: Blue
          - name: Red
      
      # Plain text for model number
      - name: ModelNumber
        inputType: PLAIN_TEXT
      
      # Rich text for detailed specifications
      - name: Specifications
        inputType: RICH_TEXT
      
      # Boolean for waterproof feature
      - name: IsWaterproof
        inputType: BOOLEAN
      
      # Date for release date
      - name: ReleaseDate
        inputType: DATE
      
      # Reference to related accessories
      - name: CompatibleAccessories
        inputType: REFERENCE
        entityType: PRODUCT
`,

    // Digital product example
    digitalProduct: `
productTypes:
  - name: E-Book
    isDigital: true
    hasVariants: false
    attributes:
      - name: Format
        inputType: DROPDOWN
        values:
          - name: PDF
          - name: EPUB
          - name: MOBI
      
      - name: PageCount
        inputType: NUMERIC
      
      - name: Author
        inputType: PLAIN_TEXT
      
      - name: PublicationDate
        inputType: DATE
      
      - name: Synopsis
        inputType: RICH_TEXT
      
      - name: DRMProtected
        inputType: BOOLEAN
`,

    // Multi-channel configuration
    multiChannel: `
channels:
  - name: Web Store
    currencyCode: USD
    defaultCountry: US
    slug: web-store
    settings:
      automaticallyConfirmAllNewOrders: true
      defaultTransactionFlowStrategy: AUTHORIZATION
  
  - name: Mobile App
    currencyCode: USD
    defaultCountry: US
    slug: mobile-app
    settings:
      automaticallyConfirmAllNewOrders: false
      defaultTransactionFlowStrategy: CHARGE
  
  - name: European Store
    currencyCode: EUR
    defaultCountry: DE
    slug: eu-store
    settings:
      automaticallyConfirmAllNewOrders: true
      expireOrdersAfter: 14
`,

    // Configuring a gift card product type
    giftCardType: `
productTypes:
  - name: Gift Card
    isDigital: true
    hasVariants: true
    kind: GIFT_CARD
    attributes:
      - name: Denomination
        inputType: DROPDOWN
        values:
          - name: $10
          - name: $25
          - name: $50
          - name: $100
      
      - name: Design
        inputType: DROPDOWN
        values:
          - name: Birthday
          - name: Holiday
          - name: Congratulations
          - name: Thank You
`
  },

  /**
   * YAML Validation
   * 
   * How the Configurator validates YAML with Zod
   */
  validationRules: `
// The configurator uses Zod for schema validation

// 1. Required fields
- All product types, page types, channels, and attributes must have a name
- Reference attributes must specify an entityType

// 2. Enum value validation
- Weight units must be one of: KG, LB, OZ, G, TONNE
- Country codes must be valid two-letter codes (US, GB, DE, etc.)
- Input types must be one of the supported types (DROPDOWN, PLAIN_TEXT, etc.)
- Entity types for references must be one of: PAGE, PRODUCT, PRODUCT_VARIANT

// 3. Type validation
- Boolean values must be true or false
- Numeric values must be valid numbers
- Dates must be in valid format

// 4. Relationship validation
- Attributes referenced in product types must exist
- Values must be provided for DROPDOWN, MULTISELECT, and SWATCH input types
`,

  /**
   * Best Practices for YAML Configuration
   */
  bestPractices: [
    "Group related attributes together within product types",
    "Use descriptive names for attributes and values",
    "Define global attributes at the top level when shared across multiple product types",
    "Keep input types appropriate for the data (use DROPDOWN for fixed choices, PLAIN_TEXT for free text)",
    "Use consistent naming conventions across your configuration",
    "Start with shop and channel configuration before defining product types",
    "Define product types before creating products in the Admin UI",
    "Validate your YAML before running the configurator",
    "Use comments to document your configuration choices",
    "Create backup copies of your config.yml before making major changes",
    "Structure complex configurations by domain (all products, then all pages, etc.)",
    "Ensure all dropdowns, multiselects, and swatches have appropriate values defined",
    "Consider future needs when defining attributes (it's easier to add values than change types)",
    "Use VERSION attribute in your config to track configuration versions"
  ],

  /**
   * Command-line Usage
   * 
   * How to use the configurator CLI with your YAML
   */
  commandLineUsage: `
# Basic bootstrap command
pnpm bootstrap

# This reads the configuration from config.yml by default and applies it to the Saleor instance

# You can also retrieve the current configuration from Saleor
pnpm retrieve

# This will create a config.yml file with the current configuration from the Saleor API

# Environment variables needed:
# - SALEOR_API_URL: URL of your Saleor GraphQL API
# - APP_TOKEN: App token with necessary permissions
`,

  /**
   * Common Troubleshooting
   */
  troubleshooting: [
    {
      problem: "AttributeError: Failed to create attribute",
      causes: [
        "Missing required fields",
        "Invalid input type",
        "Duplicate attribute name"
      ],
      solutions: [
        "Check if the attribute already exists in Saleor",
        "Verify all required fields are provided",
        "Ensure input type is one of the supported types",
        "Try retrieving current configuration to see existing attributes"
      ]
    },
    {
      problem: "ProductTypeError: Failed to create product type",
      causes: [
        "Duplicate product type name",
        "Invalid attribute reference"
      ],
      solutions: [
        "Check if the product type already exists",
        "Verify all attributes are correctly defined",
        "Try defining attributes standalone first, then reference them"
      ]
    },
    {
      problem: "ChannelError: Failed to create channel",
      causes: [
        "Duplicate slug",
        "Invalid currency code",
        "Invalid country code"
      ],
      solutions: [
        "Check existing channels and ensure slug is unique",
        "Verify currency code is valid (USD, EUR, etc.)",
        "Ensure country code is valid (US, GB, etc.)"
      ]
    },
    {
      problem: "YAML parsing error",
      causes: [
        "Incorrect indentation",
        "Missing quotes around special characters",
        "Using tabs instead of spaces"
      ],
      solutions: [
        "Check YAML indentation (must be consistent)",
        "Use quotes around strings with special characters",
        "Ensure you're using spaces, not tabs",
        "Validate YAML with an online validator"
      ]
    }
  ],

  /**
   * Migration Guide
   * 
   * How to migrate from manual configuration to using the configurator
   */
  migrationGuide: `
# Migrating from Manual Configuration to Configurator

## Step 1: Retrieve current configuration
pnpm retrieve

## Step 2: Review and adjust the generated config.yml
- Add missing product types or attributes
- Organize the configuration logically
- Add comments for clarity

## Step 3: Test on a staging environment
- Apply the configuration to a staging environment
- Verify all entities are created correctly
- Make adjustments as needed

## Step 4: Apply to production
- Once verified, apply to production
- Monitor for any errors during application

## Step 5: Maintain as code
- Store config.yml in version control
- Review changes with pull requests
- Document your configuration
`
};

// Export the patterns
module.exports = configuratorYamlPatterns; 