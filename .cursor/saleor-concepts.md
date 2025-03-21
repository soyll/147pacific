# Saleor Core Concepts

## Channels
- Multi-channel sales platform that affects all modules
- Separates product availability and pricing by sales channel
- Controls catalog visibility, pricing, and stock allocation
- Key for multi-marketplace, multi-region setups

## Products
- Product catalog with variants, attributes, and media
- Product Types define shared attributes and organization
- Variants represent specific product configurations (size, color)
- Media attachments for product imagery
- Categories for hierarchical organization

## Checkout
- Multi-step process with shipping, billing and payment integration
- Lifecycle: AddItems → ShippingAddress → ShippingMethod → Billing → Payment
- Supports multiple shipping methods and payment providers
- Handles tax calculations and discount applications
- Manages inventory reservation

## Orders
- Order workflow with status management
- Status progression: Unconfirmed → Unfulfilled → Fulfilled → Completed
- Price freeze period to maintain consistent pricing post-purchase
- Supports partial fulfillment and complex shipping scenarios
- Order to Checkout relationship for order history

## Transactions
- Payment processing with app integrations
- Handles various payment methods and gateways
- Supports refunds and payment authorizations
- Manages stored payment methods for returning customers
- Reconciles payment statuses with order statuses

## Discounts
- Promotions for automatic discounts based on rules
- Vouchers for code-based discounts
- Support for percentage and fixed amount reductions
- Gift cards as a payment method
- Rules engine for complex discount scenarios

## Stock
- Stock reservation during checkout
- Stock allocation upon order creation
- Inventory tracking across warehouses
- Stock availability queries

## Users
- Customer accounts with address books
- Staff accounts with permission management
- Authentication with JWT tokens
- User groups and permission sets

## Metadata
- Extensible metadata fields for all major models
- Private and public metadata options
- Used for customization without schema changes 