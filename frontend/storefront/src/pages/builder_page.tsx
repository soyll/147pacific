import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HeroSection, type HeroSlide } from '@/components/features/hero_section';
import { BlockSection, type BlockSectionText, type BlockSectionImage } from '@/components/features/block_section';
import { Builder, type AccessoryItem, type SubAccessoryItem } from '@/components/features/builder';
import { UniversalProductItem } from '@/types';
import { ProductRow } from '@/components/features/product_row';
import { useAutoAccessoryProduct, useCompatibleSubAccessories } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';

const heroSlides: HeroSlide[] = [
    {
        id: 1,
        image: '/assets/images/hero/main.webp',
        title: 'Bed Rack',
        description: 'Custom automotive accessories built to your specifications'
    },
    {
        id: 2,
        image: '/assets/images/hero/main.webp',
        title: 'Bull Bar',
        description: 'Professional-grade protection systems'
    },
    {
        id: 3,
        image: '/assets/images/hero/main.webp',
        title: 'Running Board',
        description: 'Enhanced accessibility solutions'
    },
    {
        id: 4,
        image: '/assets/images/hero/main.webp',
        title: 'Made in USA',
        description: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials'
    }
];

const leftTextBlock: BlockSectionText[] = [
    {
        type: 'title',
        content: 'Bed Rack'
    },
    {
        type: 'paragraph',
        content: 'Pick-up truck roll cage built from 2.375" round stainless steel tubing with stainless sheet connections and anodized aluminum inserts. Designed for durability and style, with numerous customization options available. The combination of lightweight materials and corrosion-resistant stainless.'
    }
];

const rightTextBlock: BlockSectionText[] = [
    {
        type: 'title',
        content: 'Bed Rack'
    },
    {
        type: 'paragraph',
        content: 'Pick-up truck bed racks built with 2.375" round stainless steel tubing with stainless sheet connections. The rack is constructed with a series of telescoping crossbars suited for flush or top mounting orientations, while also features a series of T-channels. The rack comes in several sizes to support four to six bikes, depending on needs, and features an all-aluminum construction with welded seams to ensure it can handle even the most demanding scenarios. The unit features stainless steel and automotive-grade hardware.'
    },
    {
        type: 'paragraph',
        content: 'The rack is constructed with a series of telescoping crossbars suited for flush or top mounting orientations, while also features a series of T-channels. The rack comes in several sizes to support four to six bikes, depending on needs, and features an all-aluminum construction with welded seams to ensure it can handle even the most demanding scenarios. The unit features stainless steel and automotive-grade hardware.'
    },
    {
        type: 'paragraph',
        content: 'Pick-up truck bed racks built with 2.375" round stainless steel tubing with stainless sheet connections. The rack is constructed with a series of telescoping crossbars suited for flush or top mounting orientations, while also features a series of T-channels. The rack comes in several sizes to support four to six bikes, depending on needs, and features an all-aluminum construction with welded seams to ensure it can handle even the most demanding scenarios. The unit features stainless steel and automotive-grade hardware.'
    },
    {
        type: 'paragraph',
        content: 'The rack is constructed with a series of telescoping crossbars suited for flush or top mounting orientations, while also features a series of T-channels. The rack comes in several sizes to support four to six bikes, depending on needs, and features an all-aluminum construction with welded seams to ensure it can handle even the most demanding scenarios. The unit features stainless steel and automotive-grade hardware.'
    }
];

const secondSectionImages: BlockSectionImage[] = [
    { src: '/assets/images/slider/1.webp', alt: 'Bed Rack installed on pickup truck' },
    { src: '/assets/images/slider/2.webp', alt: 'Bed Rack detail view' },
    { src: '/assets/images/slider/4.webp', alt: 'Bed Rack detail view' },
    { src: '/assets/images/slider/3.webp', alt: 'Bed Rack detail view' }
];

const secondSectionText: BlockSectionText[] = [
    {
        type: 'title',
        content: 'Built to meet the highest standards of durability and performance'
    },
    {
        type: 'paragraph',
        content: 'The rise of rugged and versatile storage solutions for pickup trucks opens up opportunities for innovation in the automobile accessories industry.'
    },
    {
        type: 'paragraph',
        content: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials. Built to meet the highest standards of quality, durability, and performance for real-world American conditions.'
    },
    {
        type: 'paragraph',
        content: 'The rise of rugged and versatile storage solutions for pickup trucks opens up opportunities for innovation in the automobile accessories industry.'
    },
    {
        type: 'paragraph',
        content: 'The rise of rugged and versatile storage solutions for pickup trucks opens up opportunities for innovation in the automobile accessories industry.'
    },
    {
        type: 'paragraph',
        content: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials. Built to meet the highest standards of quality, durability, and performance for real-world American conditions.'
    },
    {
        type: 'paragraph',
        content: 'The rise of rugged and versatile storage solutions for pickup trucks opens up opportunities for innovation in the automobile accessories industry.'
     }
];

const builderColors = [
  { name: 'Dark grey metal', value: '#6d6d6d' },
  { name: 'Light grey', value: '#d2d2d2' },
  { name: 'Blue', value: '#12407c' },
  { name: 'Green', value: '#0f5c24' },
  { name: 'Brown', value: '#824c3f' }
];

const builderAccessories: AccessoryItem[] = [
  {
    id: 'molle-panel-1',
    name: 'Molle panel kit',
    model: 'R G822-PXXX',
    price: 12547,
    image: '/assets/images/shop/1.webp',
    description: 'Producing adventure-specific accessories for pickup truck racks shows potential for innovative solutions in the overland and travel equipment industry.',
    type: 'accessory'
  },
  {
    id: 'panel-1',
    name: 'Panel',
    model: 'R G822-PXXX',
    price: 12547,
    image: '/assets/images/shop/2.webp',
    description: 'Producing adventure-specific accessories for pickup truck racks shows potential for innovative solutions in the overland and travel equipment industry.',
    type: 'accessory'
  }
];

const builderSubAccessories: SubAccessoryItem[] = [
  {
    id: 'molle-panel-2',
    name: 'Molle panel kit',
    model: 'R G822-PXXX',
    price: 12547,
    image: '/assets/images/shop/1.webp',
    description: 'Producing adventure-specific accessories for pickup truck racks shows potential for innovative solutions in the overland and travel equipment industry.',
    type: 'subAccessory',
    compatibleWith: ['molle-panel-1']
  },
  {
    id: 'panel-2',
    name: 'Panel',
    model: 'R G822-PXXX',
    price: 12547,
    image: '/assets/images/shop/2.webp',
    description: 'Producing adventure-specific accessories for pickup truck racks shows potential for innovative solutions in the overland and travel equipment industry.',
    type: 'subAccessory',
    compatibleWith: ['panel-1', 'molle-panel-1']
  }
];

export const BuilderPage: React.FC = React.memo(() => {
  const [searchParams] = useSearchParams();
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(null);
  const [selectedSubAccessories, setSelectedSubAccessories] = useState<string[]>([]);
  const { addToCart } = useCart();
  
  const productId = searchParams.get('product');
  
  const { data: accessoryData, loading: accessoryLoading } = useAutoAccessoryProduct({
    id: productId || undefined,
    channel: 'online-store'
  });
  
  const { data: subAccessoriesData, loading: subAccessoriesLoading } = useCompatibleSubAccessories(
    selectedAccessory || productId || ''
  );
  
  useEffect(() => {
    if (accessoryData?.autoAccessoryProduct && !selectedAccessory) {
      setSelectedAccessory(accessoryData.autoAccessoryProduct.id);
    }
  }, [accessoryData, selectedAccessory]);
  
  const handleSubAccessorySelect = (subAccessoryId: string, selected: boolean) => {
    setSelectedSubAccessories(prev => 
      selected 
        ? [...prev, subAccessoryId]
        : prev.filter(id => id !== subAccessoryId)
    );
  };
  
  const handleAddToCart = (productId: string, quantity: number = 1) => {
    const product = mainAccessory || compatibleSubAccessories.find((p: UniversalProductItem) => p.id === productId);
    if (product) {
      const cartProduct = {
        id: product.id,
        name: product.name,
        model: product.model,
        description: product.description,
        price: product.price,
        image: product.image
      };
      addToCart(cartProduct, quantity);
    }
  };
  
  const convertToProductItem = (product: any): UniversalProductItem => ({
    id: product.id,
    name: product.name,
    model: product.variants?.[0]?.sku || 'N/A',
    description: product.description || 'No description',
    price: product.pricing?.priceRange?.start?.gross?.amount || 0,
    image: product.thumbnail?.url || '/assets/images/shop/1.webp'
  });
  
  const mainAccessory = accessoryData?.autoAccessoryProduct ? 
    convertToProductItem(accessoryData.autoAccessoryProduct) : null;
    
  const compatibleSubAccessories = subAccessoriesData?.autoAccessoryProducts?.edges?.map((edge: any) => 
    convertToProductItem(edge.node)
  ) || [];

  return (
    <main className="content">
      <HeroSection slides={heroSlides} />

      <div className="content__wrapper">
        <BlockSection
          direction="rtl"
          images={[]}
          caption="Bed Rack"
          text={leftTextBlock}
          secondText={rightTextBlock}
          useTextVariation={true}
          showArrow={false}
        />

        <BlockSection
          direction="ltr"
          images={secondSectionImages}
          caption="Built to meet standards"
          text={secondSectionText}
          showArrow={false}
        />

        <div className="section">
          <div className="section__wrapper">
            <div className="container">
              <div className="section__header">
                <p className="title title--base">
                  Product Builder
                </p>
              </div>
              
              {accessoryLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p className="text text--base">Loading product...</p>
                </div>
              ) : mainAccessory ? (
                <div className="builder-content">
                  <div className="builder-main-accessory">
                    <h3 className="title title--small">Selected Accessory</h3>
                    <ProductRow
                      product={mainAccessory}
                      variant="builder"
                      isSelected={true}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                  
                  <div className="builder-3d">
                    <Builder
                      accessories={builderAccessories}
                      subAccessories={builderSubAccessories}
                      colors={builderColors}
                    />
                  </div>
                  
                  {subAccessoriesLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <p className="text text--base">Loading compatible accessories...</p>
                    </div>
                  ) : compatibleSubAccessories.length > 0 ? (
                    <div className="builder-sub-accessories">
                      <h3 className="title title--small">Compatible Sub-Accessories</h3>
                      <div className="product-list">
                        {compatibleSubAccessories.map((subAccessory: UniversalProductItem) => (
                          <ProductRow
                            key={subAccessory.id}
                            product={subAccessory}
                            variant="builder"
                            isSelected={selectedSubAccessories.includes(subAccessory.id)}
                            onSelect={handleSubAccessorySelect}
                            onAddToCart={handleAddToCart}
                            showCompatibility={true}
                            compatibleWith={[mainAccessory.name]}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <p className="text text--base">No compatible sub-accessories found</p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p className="text text--base">Product not found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
});
