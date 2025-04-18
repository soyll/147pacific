import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductService } from './product-service';

describe('ProductService', () => {
  let productService: ProductService;
  let mockRepository: any;
  let mockProductTypeService: any;
  let mockCategoryService: any;
  let mockAttributeService: any;
  let mockChannelService: any;

  beforeEach(() => {
    mockRepository = {
      createProduct: vi.fn(),
      getProductByName: vi.fn(),
      updateProduct: vi.fn(),
      createProductVariants: vi.fn(),
      updateProductChannelListing: vi.fn(),
    };

    mockProductTypeService = {
      bootstrapProductType: vi.fn().mockResolvedValue({ id: 'product-type-1' }),
    };

    mockCategoryService = {
      getOrCreateCategory: vi.fn().mockResolvedValue({ id: 'category-1' }),
    };

    mockAttributeService = {
      getAttributesByNames: vi.fn().mockResolvedValue([
        { id: 'attr-1', name: 'Flower Strain' },
        { id: 'attr-2', name: 'Flower THC Content' },
      ]),
    };

    mockChannelService = {
      getChannelBySlug: vi.fn().mockImplementation((slug) => {
        if (slug === 'online-store') {
          return Promise.resolve({ id: 'channel-1', slug: 'online-store' });
        }
        if (slug === 'dispensary-pickup') {
          return Promise.resolve({ id: 'channel-2', slug: 'dispensary-pickup' });
        }
        return Promise.resolve(null);
      }),
    };

    productService = new ProductService(
      mockRepository,
      mockProductTypeService,
      mockCategoryService,
      mockAttributeService,
      mockChannelService
    );
  });

  describe('bootstrapProducts', () => {
    it('should process all products from input', async () => {
      // Mock repository response for createProduct
      mockRepository.createProduct.mockResolvedValue({
        id: 'product-1',
        name: 'Blue Dream',
        slug: 'blue-dream',
      });

      const products = [
        {
          name: 'Blue Dream',
          description: 'A popular hybrid strain',
          productType: 'Cannabis Flower',
          category: 'Hybrid',
          attributes: [
            { attribute: 'Flower Strain', values: ['Hybrid'] },
            { attribute: 'Flower THC Content', values: ['20-25%'] },
          ],
          channelListings: [
            { channelSlug: 'online-store', isPublished: true },
            { channelSlug: 'dispensary-pickup', isPublished: true },
          ],
          variants: [
            {
              sku: 'BD-3.5G',
              name: 'Blue Dream - 3.5g',
              channelListings: [
                { channelSlug: 'online-store', price: '45.00' },
                { channelSlug: 'dispensary-pickup', price: '40.00' },
              ],
            },
          ],
        },
      ];

      await productService.bootstrapProducts(products);

      expect(mockRepository.createProduct).toHaveBeenCalledWith({
        name: 'Blue Dream',
        description: 'A popular hybrid strain',
        productType: 'product-type-1',
        category: 'category-1',
        attributes: [
          { id: 'attr-1', values: ['Hybrid'] },
          { id: 'attr-2', values: ['20-25%'] },
        ],
      });

      expect(mockRepository.updateProductChannelListing).toHaveBeenCalledWith(
        'product-1',
        {
          updateChannels: [
            {
              channelId: 'channel-1',
              isPublished: true,
              visibleInListings: true,
              isAvailableForPurchase: true,
            },
            {
              channelId: 'channel-2',
              isPublished: true,
              visibleInListings: true,
              isAvailableForPurchase: true,
            },
          ],
        }
      );

      expect(mockRepository.createProductVariants).toHaveBeenCalled();
    });

    it('should handle errors during processing', async () => {
      // Mock an error for one product
      mockRepository.createProduct.mockRejectedValueOnce(new Error('Failed to create product'));

      const products = [
        {
          name: 'Failed Product',
          productType: 'Cannabis Flower',
        },
        {
          name: 'Success Product',
          productType: 'Cannabis Edibles',
        },
      ];

      // For the second product call
      mockRepository.createProduct.mockResolvedValueOnce({
        id: 'product-2',
        name: 'Success Product',
      });

      const result = await productService.bootstrapProducts(products);

      // Should have one successful product
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Success Product');
    });
  });
}); 