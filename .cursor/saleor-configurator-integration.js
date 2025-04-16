/**
 * Saleor Configurator Integration Patterns
 * 
 * This file provides guidance for integrating the Saleor Configurator
 * with other parts of the Saleor ecosystem
 */

const configuratorIntegrationPatterns = {
  /**
   * Configurator to Storefront Integration
   * 
   * How to consume the data models defined in the configurator from your storefront
   */
  storefrontIntegration: {
    describtion: "After using the configurator to set up your data models (product types, attributes, etc.), you'll need to query and display these in your storefront.",
    
    productTypeQuery: `
// Query to fetch products based on product type
const GET_PRODUCTS_BY_TYPE = gql\`
  query GetProductsByType($productType: String!, $channel: String!) {
    products(
      first: 10, 
      filter: {productType: $productType}, 
      channel: $channel
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
        }
      }
    }
  }
\`

// Usage in component
const ProductListByType = ({ productType, channel = 'default-channel' }) => {
  const { data, loading, error } = useQuery(GET_PRODUCTS_BY_TYPE, {
    variables: { productType, channel }
  });
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  const products = data?.products?.edges?.map(edge => edge.node) || [];
  
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
`,
    
    attributeFilteringQuery: `
// Query to filter products by specific attributes defined in configurator
const GET_FILTERED_PRODUCTS = gql\`
  query GetFilteredProducts(
    $attributes: [AttributeInput!],
    $channel: String!
  ) {
    products(
      first: 20,
      filter: { attributes: $attributes },
      channel: $channel
    ) {
      edges {
        node {
          id
          name
          slug
          thumbnail { url }
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
        }
      }
    }
  }
\`

// Example usage with Size and Color attributes defined in configurator
const FilteredProductList = () => {
  const { data, loading } = useQuery(GET_FILTERED_PRODUCTS, {
    variables: {
      attributes: [
        { slug: "size", values: ["large"] },
        { slug: "color", values: ["blue", "black"] }
      ],
      channel: "default-channel"
    }
  });
  
  // Render filtered products...
}
`,
    
    attributeDisplayComponent: `
// Component to display attributes based on their input type
import React from 'react';

const AttributeDisplay = ({ attribute, value }) => {
  // Handle different attribute input types defined in configurator
  switch (attribute.inputType) {
    case 'DROPDOWN':
    case 'PLAIN_TEXT':
      return (
        <div className="attribute">
          <span className="attribute-name">{attribute.name}:</span>
          <span className="attribute-value">{value.name}</span>
        </div>
      );
    
    case 'BOOLEAN':
      return (
        <div className="attribute">
          <span className="attribute-name">{attribute.name}:</span>
          <span className="attribute-value">{value.name === 'True' ? '✓' : '✗'}</span>
        </div>
      );
      
    case 'DATE':
      return (
        <div className="attribute">
          <span className="attribute-name">{attribute.name}:</span>
          <span className="attribute-value">
            {new Date(value.name).toLocaleDateString()}
          </span>
        </div>
      );
    
    case 'RICH_TEXT':
      return (
        <div className="attribute">
          <span className="attribute-name">{attribute.name}:</span>
          <div 
            className="attribute-rich-text"
            dangerouslySetInnerHTML={{ __html: value.richText }} 
          />
        </div>
      );
      
    // Handle other attribute types as needed
    
    default:
      return (
        <div className="attribute">
          <span className="attribute-name">{attribute.name}:</span>
          <span className="attribute-value">{value.name}</span>
        </div>
      );
  }
};

// Usage in product detail component
const ProductDetail = ({ product }) => {
  return (
    <div className="product-attributes">
      {product.attributes.map(({ attribute, values }) => (
        <AttributeDisplay 
          key={attribute.id}
          attribute={attribute}
          value={values[0]} 
        />
      ))}
    </div>
  );
};
`
  },

  /**
   * Configurator to Admin Dashboard Integration
   * 
   * How to leverage configurator with the Saleor Dashboard
   */
  dashboardIntegration: {
    description: "The configurator automatically creates product types and attributes, which are immediately available in the Saleor Dashboard.",
    
    workflow: `
# Typical Admin Workflow with Configurator

1. Use configurator to define product types, attributes, channels:
   \`\`\`
   pnpm bootstrap
   \`\`\`

2. Log into Saleor Dashboard (typically at http://localhost:9000)

3. Navigate to Products → Product Types 
   - You'll see all product types defined in your config.yml
   - You can now create products based on these types

4. When creating a product in the dashboard:
   - Select the product type from dropdown (e.g., "T-Shirt")
   - The attributes defined in configurator appear automatically
   - Fill in the values for each attribute
   - Create variants based on attributes like Size, Color

5. When you need to update your data model:
   - Edit config.yml to add/change product types or attributes
   - Run \`pnpm bootstrap\` again
   - Changes are reflected immediately in the dashboard
`,
    
    dashboardScreenshot: "https://user-images.githubusercontent.com/example/saleor-dashboard-product-types.png",
    
    benefits: [
      "Consistent product types and attributes across development and production",
      "Version control for your data model",
      "Faster setup of complex product catalogs",
      "Automated migrations between environments",
      "Standardized attribute naming and structure"
    ]
  },
  
  /**
   * Configurator with Kubernetes
   * 
   * How to run the configurator in a Kubernetes environment
   */
  kubernetesIntegration: {
    description: "The configurator can be deployed as a Kubernetes job or pod to automate setup in various environments.",
    
    k8sManifest: `
# Example kubernetes/configurator.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: saleor-configurator
  namespace: saleor
spec:
  template:
    spec:
      containers:
      - name: configurator
        image: ghcr.io/yourusername/saleor-configurator:latest
        env:
        - name: SALEOR_API_URL
          value: "http://saleor-api.saleor.svc.cluster.local:8000/graphql/"
        - name: APP_TOKEN
          valueFrom:
            secretKeyRef:
              name: saleor-secrets
              key: configurator-app-token
        volumeMounts:
        - name: config-volume
          mountPath: /app/config.yml
          subPath: config.yml
      volumes:
      - name: config-volume
        configMap:
          name: saleor-config
      restartPolicy: Never
  backoffLimit: 4
`,
    
    configMapExample: `
# Example configmap for config.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: saleor-config
  namespace: saleor
data:
  config.yml: |
    shop:
      defaultMailSenderName: "Saleor Store"
      defaultMailSenderAddress: "store@example.com"
      displayGrossPrices: true
    
    channels:
      - name: Default Channel
        currencyCode: USD
        defaultCountry: US
        slug: default-channel
    
    productTypes:
      - name: T-Shirt
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
`,
    
    tiltfileExample: `
# Example Tiltfile integration
load('ext://helm_remote', 'helm_remote')

# Deploy Saleor API and Dashboard
helm_remote('saleor', 'https://helm.saleor.io')

# Build and deploy configurator
docker_build('ghcr.io/yourusername/saleor-configurator:latest', '.')
k8s_yaml('kubernetes/configurator.yaml')
k8s_yaml('kubernetes/configmap.yaml')

# Run configurator after Saleor API is ready
k8s_resource('saleor-configurator', 
  resource_deps=['saleor-api'],
  trigger_mode=TRIGGER_MODE_MANUAL
)
`
  },
  
  /**
   * CI/CD Integration
   * 
   * How to incorporate the configurator in CI/CD pipelines
   */
  cicdIntegration: {
    description: "Automate configuration deployment across environments using CI/CD pipelines.",
    
    githubActionsExample: `
# .github/workflows/deploy-config.yml
name: Deploy Saleor Configuration

on:
  push:
    branches: [main]
    paths:
      - 'config.yml'
      - '.github/workflows/deploy-config.yml'

jobs:
  deploy-config:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm install
        
      - name: Deploy to staging
        if: github.ref == 'refs/heads/main'
        run: |
          export SALEOR_API_URL=${{ secrets.STAGING_SALEOR_API_URL }}
          export APP_TOKEN=${{ secrets.STAGING_APP_TOKEN }}
          npm run bootstrap
          
      - name: Deploy to production
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: |
          export SALEOR_API_URL=${{ secrets.PRODUCTION_SALEOR_API_URL }}
          export APP_TOKEN=${{ secrets.PRODUCTION_APP_TOKEN }}
          npm run bootstrap
`,
    
    deploymentStrategy: `
# Multi-Environment Deployment Strategy

## Development
1. Developers work with local config.yml
2. Changes are tested against local Saleor instance
3. Config changes are committed to version control

## Staging
1. On PR merge to main, configurator runs against staging
2. QA validates the updated data model
3. Product types and attributes can be tested with real products

## Production
1. After approval, config changes are applied to production
2. Configurator runs with production credentials
3. Changes are applied safely without affecting existing products

Benefits:
- Consistent configuration across environments
- Automated rollout of schema changes
- Version-controlled product catalog structure
- Reduced human error in complex configurations
`,
    
    bestPractices: [
      "Always test configuration changes in staging before production",
      "Use different API tokens with appropriate permissions for each environment",
      "Include configuration validation in your CI pipeline",
      "Keep sensitive values in CI/CD secrets, not in your config file",
      "Consider having environment-specific config files for dev/staging/prod",
      "Add notifications when configuration changes are deployed",
      "Include manual approval step before production deployment"
    ]
  },
  
  /**
   * Integrating with Custom Apps
   * 
   * How to leverage configurator data models in custom Saleor apps
   */
  customAppIntegration: {
    description: "Custom Saleor apps can leverage the data models defined by the configurator.",
    
    metaFieldsApp: `
// Example: Custom app that adds reporting meta fields to products
// based on attributes defined in configurator

import { useSaleorApp } from "@saleor/app-sdk/app-bridge";
import { useAppQuery } from "@saleor/app-sdk/hooks";

// Query to get product attributes defined in configurator
const GET_PRODUCT_ATTRIBUTES = gql\`
  query GetProductAttributes($id: ID!) {
    product(id: $id) {
      id
      name
      attributes {
        attribute {
          slug
          name
        }
        values {
          name
          slug
        }
      }
    }
  }
\`;

const ProductReportingMetaFields = () => {
  const { appBridgeState } = useSaleorApp();
  const productId = appBridgeState?.id;
  
  const { data, loading } = useAppQuery(GET_PRODUCT_ATTRIBUTES, {
    variables: { id: productId }
  });
  
  const generateMetaFields = () => {
    if (!data?.product) return [];
    
    // Find specific attributes defined in configurator
    const brand = data.product.attributes.find(
      attr => attr.attribute.slug === "brand"
    );
    
    const category = data.product.attributes.find(
      attr => attr.attribute.slug === "category"
    );
    
    // Generate meta fields based on attributes
    return [
      {
        key: "reporting:brand",
        value: brand?.values[0]?.name || "Unknown"
      },
      {
        key: "reporting:category",
        value: category?.values[0]?.name || "Uncategorized"
      }
    ];
  };
  
  // Add meta fields to product...
};
`,
    
    customCheckoutFlow: `
// Example: Custom checkout app that uses configurator-defined attributes
// to determine shipping requirements

const determineShippingRequirements = (cart) => {
  // Check if any product in cart has special shipping requirements
  // based on attributes defined in configurator
  
  let requiresRefrigeration = false;
  let isOversize = false;
  
  cart.lines.forEach(line => {
    const product = line.variant.product;
    
    // Check for refrigeration attribute (defined in configurator)
    const refrigeration = product.attributes.find(
      attr => attr.attribute.slug === "requires-refrigeration"
    );
    
    if (refrigeration?.values[0]?.name === "True") {
      requiresRefrigeration = true;
    }
    
    // Check for size attribute (defined in configurator)
    const size = product.attributes.find(
      attr => attr.attribute.slug === "size-category"
    );
    
    if (size?.values[0]?.name === "Oversize") {
      isOversize = true;
    }
  });
  
  return {
    requiresRefrigeration,
    isOversize,
    // Add more shipping rules based on configurator attributes
  };
};
`
  },
  
  /**
   * Multi-Environment Configuration
   * 
   * Managing different configurations across environments
   */
  multiEnvironmentConfig: {
    description: "Strategies for managing configurator configuration across different environments.",
    
    environmentSpecificConfigs: `
# Directory structure for environment-specific configs
configs/
  base.yml         # Common configuration shared across all environments
  development.yml  # Development-specific overrides
  staging.yml      # Staging-specific overrides
  production.yml   # Production-specific overrides

# Script to combine base config with environment-specific config
const yaml = require('js-yaml');
const fs = require('fs');
const merge = require('deepmerge');

const env = process.env.NODE_ENV || 'development';
console.log(\`Generating config for \${env} environment\`);

// Load base configuration
const baseConfig = yaml.load(fs.readFileSync('./configs/base.yml', 'utf8'));

// Load environment-specific configuration
const envConfig = yaml.load(fs.readFileSync(\`./configs/\${env}.yml\`, 'utf8'));

// Merge configurations with environment-specific taking precedence
const mergedConfig = merge(baseConfig, envConfig);

// Save the merged configuration
fs.writeFileSync('./config.yml', yaml.dump(mergedConfig));
console.log('Configuration generated successfully');
`,
    
    environmentVariableSubstitution: `
# config.yml with environment variable placeholders
shop:
  defaultMailSenderName: "{{ SHOP_NAME }}"
  defaultMailSenderAddress: "{{ SENDER_EMAIL }}"
  displayGrossPrices: {{ DISPLAY_GROSS_PRICES }}

channels:
  - name: {{ CHANNEL_NAME }}
    currencyCode: {{ CURRENCY_CODE }}
    defaultCountry: {{ DEFAULT_COUNTRY }}
    slug: {{ CHANNEL_SLUG }}

# Script to substitute environment variables
const yaml = require('js-yaml');
const fs = require('fs');

// Load template
let configTemplate = fs.readFileSync('./config.template.yml', 'utf8');

// Replace variables with environment values
configTemplate = configTemplate.replace(/{{ ([A-Z_]+) }}/g, (match, varName) => {
  return process.env[varName] || match;
});

// Save the processed configuration
fs.writeFileSync('./config.yml', configTemplate);
console.log('Configuration generated with environment variables');
`,
    
    bestPractices: [
      "Keep sensitive information in environment variables, not in config files",
      "Use a base configuration for shared elements across environments",
      "Override only what's different in environment-specific configs",
      "Consider using different channel slugs for different environments",
      "Have slightly different product types in dev vs. production for testing",
      "Use CI/CD to validate configuration changes before deployment",
      "Include environment identifier in shop name or email to avoid confusion"
    ]
  }
};

// Export the patterns
module.exports = configuratorIntegrationPatterns; 