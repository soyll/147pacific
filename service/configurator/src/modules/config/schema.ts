import { z } from "zod";

const attributeValueSchema = z.object({
  name: z.string(),
});

const attributeTypeSchema = z.enum(["PRODUCT_TYPE", "PAGE_TYPE"]);

// Base attribute fields that are common to all types
const baseAttributeSchema = z.object({
  name: z.string(),
});

// Schema for attributes with multiple values (dropdown, multiselect, swatch)
const multipleValuesAttributeSchema = baseAttributeSchema.extend({
  inputType: z.enum(["DROPDOWN", "MULTISELECT", "SWATCH"]),
  values: z.array(attributeValueSchema),
});

// Schema for reference type attributes
const referenceAttributeSchema = baseAttributeSchema.extend({
  inputType: z.literal("REFERENCE"),
  entityType: z.enum(["PAGE", "PRODUCT", "PRODUCT_VARIANT"]),
});

// Schema for simple value attributes
const simpleAttributeSchema = baseAttributeSchema.extend({
  inputType: z.enum([
    "PLAIN_TEXT",
    "NUMERIC",
    "DATE",
    "BOOLEAN",
    "RICH_TEXT",
    "DATE_TIME",
    "FILE",
  ]),
});

// Combined attribute schema using discriminted union based on inputType
const noTypeAttributeSchema = z.discriminatedUnion("inputType", [
  multipleValuesAttributeSchema,
  referenceAttributeSchema,
  simpleAttributeSchema,
]);

const attributeSchema = noTypeAttributeSchema.and(
  z.object({
    type: attributeTypeSchema,
  })
);

export type AttributeInput = z.infer<typeof attributeSchema>;
export type AttributeInputType = AttributeInput["inputType"];

const pageOrProductTypeSchema = z.object({
  name: z.string(),
  attributes: z.array(noTypeAttributeSchema),
});

export type PageTypeInput = z.infer<typeof pageOrProductTypeSchema>;

const countryCodeSchema = z.enum([
  "US",
  "GB",
  "DE",
  "FR",
  "ES",
  "IT",
  "PL",
  "NL",
  "BE",
  "CZ",
  "PT",
  "SE",
  "AT",
  "CH",
  "DK",
  "FI",
  "NO",
  "IE",
  "AU",
  "JP",
  "BR",
  "RU",
  "CN",
  "IN",
  "CA",
]);

export type CountryCode = z.infer<typeof countryCodeSchema>;

const channelSchema = z.object({
  name: z.string(),
  currencyCode: z.string(),
  defaultCountry: countryCodeSchema,
  slug: z.string(),
  isActive: z.boolean().optional().default(true),
  settings: z
    .object({
      allocationStrategy: z
        .enum(["PRIORITIZE_SORTING_ORDER", "PRIORITIZE_HIGH_STOCK"])
        .optional(),
      automaticallyConfirmAllNewOrders: z.boolean().optional(),
      automaticallyFulfillNonShippableGiftCard: z.boolean().optional(),
      expireOrdersAfter: z.number().optional(),
      deleteExpiredOrdersAfter: z.number().optional(),
      markAsPaidStrategy: z
        .enum(["TRANSACTION_FLOW", "PAYMENT_FLOW"])
        .optional(),
      allowUnpaidOrders: z.boolean().optional(),
      includeDraftOrderInVoucherUsage: z.boolean().optional(),
      useLegacyErrorFlow: z.boolean().optional(),
      automaticallyCompleteFullyPaidCheckouts: z.boolean().optional(),
      defaultTransactionFlowStrategy: z
        .enum(["AUTHORIZATION", "CHARGE"])
        .optional(),
    })
    .optional(),
});

export type ChannelInput = z.infer<typeof channelSchema>;

const weightUnitEnum = z.enum(["KG", "LB", "OZ", "G", "TONNE"]);

export const shopSchema = z.object({
  headerText: z.string().optional(),
  description: z.string().optional(),
  trackInventoryByDefault: z.boolean().optional(),
  defaultWeightUnit: weightUnitEnum.optional(),
  automaticFulfillmentDigitalProducts: z.boolean().optional(),
  fulfillmentAutoApprove: z.boolean().optional(),
  fulfillmentAllowUnpaid: z.boolean().optional(),
  defaultDigitalMaxDownloads: z.number().optional(),
  defaultDigitalUrlValidDays: z.number().optional(),
  defaultMailSenderName: z.string().optional(),
  defaultMailSenderAddress: z.string().optional(),
  customerSetPasswordUrl: z.string().optional(),
  reserveStockDurationAnonymousUser: z.number().optional(),
  reserveStockDurationAuthenticatedUser: z.number().optional(),
  limitQuantityPerCheckout: z.number().optional(),
  enableAccountConfirmationByEmail: z.boolean().optional(),
  allowLoginWithoutConfirmation: z.boolean().optional(),
  displayGrossPrices: z.boolean().optional(),
});

const baseCategorySchema = z.object({
  name: z.string(),
});

type Category = z.infer<typeof baseCategorySchema> & {
  subcategories?: Category[];
};

const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({
  subcategories: z.lazy(() => categorySchema.array()).optional(),
});

// Product attribute schema
const productAttributeSchema = z.object({
  attribute: z.string(),
  values: z.array(z.string()),
});

// Product variant channel listing schema
const variantChannelListingSchema = z.object({
  channelSlug: z.string(),
  price: z.string(),
  costPrice: z.string().optional(),
});

// Product variant schema
const productVariantSchema = z.object({
  sku: z.string(),
  name: z.string().optional(),
  attributes: z.array(productAttributeSchema).optional(),
  channelListings: z.array(variantChannelListingSchema).optional(),
});

// Product channel listing schema
const productChannelListingSchema = z.object({
  channelSlug: z.string(),
  isPublished: z.boolean().optional(),
  visibleInListings: z.boolean().optional(),
  isAvailableForPurchase: z.boolean().optional(),
  addVariants: z.boolean().optional(),
});

// Product schema
const productSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  productType: z.string(),
  category: z.string().optional(),
  attributes: z.array(productAttributeSchema).optional(),
  channelListings: z.array(productChannelListingSchema).optional(),
  variants: z.array(productVariantSchema).optional(),
});

// Color scheme schema
const colorSchemeSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  description: z.string(),
});

// Car brand schema
const carModelSchema = z.object({
  name: z.string(),
  years: z.array(z.string()),
  modifications: z.array(z.string()),
});

const carBrandSchema = z.object({
  name: z.string(),
  models: z.array(carModelSchema),
});

export const configSchema = z
  .object({
    productTypes: z.array(pageOrProductTypeSchema).optional(),
    channels: z.array(channelSchema).optional(),
    pageTypes: z.array(pageOrProductTypeSchema).optional(),
    shop: shopSchema.optional(),
    categories: z.array(categorySchema).optional(),
    products: z.array(productSchema).optional(),
    colorSchemes: z.array(colorSchemeSchema).optional(),
    carBrands: z.array(carBrandSchema).optional(),
  })
  .strict();

export type SaleorConfig = z.infer<typeof configSchema>;
export type PageTypeAttribute = z.infer<typeof pageOrProductTypeSchema>;
export type PageType = z.infer<typeof pageOrProductTypeSchema>;
export type ProductTypeAttribute = z.infer<typeof pageOrProductTypeSchema>;
export type ProductType = z.infer<typeof pageOrProductTypeSchema>;
export type ProductInput = z.infer<typeof productSchema>;
