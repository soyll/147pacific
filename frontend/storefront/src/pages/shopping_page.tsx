import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductRow } from '@/components/features/product_row';
import { HeroSection } from '@/components/features/hero_section';
import { HeroSlide } from '@/components/features/hero_section';
import { useAutoAccessoryProducts } from '@/hooks/useProducts';
import { Checkbox } from '@/components/common/checkbox';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: '/assets/images/hero/main.webp',
    title: 'Bed Rack',
    description: 'for accommodation and transportation of things and equipment'
  },
  {
    id: 2,
    image: '/assets/images/hero/main.webp',
    title: 'Bull Bar',
    description: 'to protect the front of the car'
  },
  {
    id: 3,
    image: '/assets/images/hero/main.webp',
    title: 'Running Board',
    description: 'for the convenience of landing'
  },
  {
    id: 4,
    image: '/assets/images/hero/main.webp',
    title: 'Made in USA',
    description: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials'
  },
  {
    id: 5,
    image: '/assets/images/hero/main.webp',
    title: 'Made in USA',
    description: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials'
  },
  {
    id: 6,
    image: '/assets/images/hero/main.webp',
    title: 'Made in USA',
    description: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials'
  }
];

export const ShoppingPage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked 
        ? [...prev, category]
        : prev.filter(cat => cat !== category)
    );
  };

  const handleBuildClick = (productId: string) => {
    navigate(`/builder?product=${productId}`);
  };

  const { data, loading, error } = useAutoAccessoryProducts({
    first: 20,
    channel: 'online-store',
  });

  const products = data?.autoAccessoryProducts?.edges?.map((edge: any) => ({
    id: edge.node.id,
    name: edge.node.name,
    model: edge.node.variants?.[0]?.sku || 'N/A',
    description: edge.node.description || 'No description available',
    price: edge.node.pricing?.priceRange?.start?.gross?.amount || 0,
    image: edge.node.thumbnail?.url || '/assets/images/shop/1.webp',
    models: edge.node.variants?.map((variant: any) => variant.sku) || []
  })) || [];

  return (
    <main className="content">
      <div className="content__wrapper">
        <HeroSection 
          slides={heroSlides}
        />
        <div className="section">
          <div className="section__wrapper">
            <div className="container">
              <div className="shopping">
                <div className="shopping__wrapper">
                  <form className={`shopping-filter ${isFilterOpen ? 'active' : ''}`} id="shopping-filter">
                    <div className="shopping-filter__mobile">
                      <button 
                        type="button"
                        className="shopping-filter__header"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                      >
                        <svg className="icon icon--arrow">
                          <use xlinkHref="/assets/images/sprite.svg#arrow-back"></use>
                        </svg>
                        <p className="text text--base">
                          Filter
                        </p>
                        <svg className="icon icon--filter">
                          <use xlinkHref="/assets/images/sprite.svg#filter"></use>
                        </svg>
                      </button>
                      <div className="input-row input-row--mobile--default">
                        <p className="input-row__title">
                          Sort by
                        </p>
                        <div className="input-row__item fieldset fieldset--sort">
                          <div className="input input--small">
                            <a href="#" className="icon">
                              <svg className="icon">
                                <use xlinkHref="/assets/images/sprite.svg#sort"></use>
                              </svg>
                            </a>
                            <select name="" id="" className="input__item">
                              <option disabled value="">Choose 1</option>
                              <option value="">Choose 1</option>
                              <option value="">Choose 1</option>
                              <option value="">Choose 1</option>
                            </select>
                            <svg className="icon icon--arrow">
                              <use xlinkHref="/assets/images/sprite.svg#down-chevron"></use>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="shopping-filter__wrapper">
                      <div className="shopping-filter__main">
                        <div className="shopping-filter__grid">
                          <div className="input-row">
                            <p className="input-row__title">
                              Car Manufacturer
                            </p>
                            <div className="input-row__item fieldset">
                              <div className="input input--small">
                                <select name="" id="" className="input__item">
                                  <option disabled selected>Choose 1</option>
                                  <option value="">Choose 1</option>
                                  <option value="">Choose 1</option>
                                  <option value="">Choose 1</option>
                                </select>
                                <svg className="icon icon--arrow">
                                  <use xlinkHref="/assets/images/sprite.svg#down-chevron"></use>
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          <div className="input-row">
                            <p className="input-row__title">
                              Car model
                            </p>
                            <div className="input-row__item fieldset">
                              <div className="input input--small">
                                <select name="" id="" className="input__item">
                                  <option disabled selected>Choose 1</option>
                                  <option value="">Choose 1</option>
                                  <option value="">Choose 1</option>
                                  <option value="">Choose 1</option>
                                </select>
                                <svg className="icon icon--arrow">
                                  <use xlinkHref="/assets/images/sprite.svg#down-chevron"></use>
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          <div className="input-row">
                            <p className="input-row__title">
                              Car release year
                            </p>
                            <div className="input-row__item fieldset">
                              <div className="input input--small">
                                <select name="" id="" className="input__item">
                                  <option disabled selected>Choose 1</option>
                                  <option value="">Choose 1</option>
                                  <option value="">Choose 1</option>
                                  <option value="">Choose 1</option>
                                </select>
                                <svg className="icon icon--arrow">
                                  <use xlinkHref="/assets/images/sprite.svg#down-chevron"></use>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="shopping-filter__row">
                          <div className="shopping-filter__checkbox">
                            <Checkbox
                              checked={selectedCategories.includes('bed-rack')}
                              onChange={(checked) => handleCategoryChange('bed-rack', checked)}
                            >
                              Bed Rack
                            </Checkbox>
                            <Checkbox
                              checked={selectedCategories.includes('bull-bar')}
                              onChange={(checked) => handleCategoryChange('bull-bar', checked)}
                            >
                              Bull Bar
                            </Checkbox>
                            <Checkbox
                              checked={selectedCategories.includes('running-board')}
                              onChange={(checked) => handleCategoryChange('running-board', checked)}
                            >
                              Running Board
                            </Checkbox>
                            <Checkbox
                              checked={selectedCategories.includes('hd-grille-guard')}
                              onChange={(checked) => handleCategoryChange('hd-grille-guard', checked)}
                            >
                              HD Grille Guard
                            </Checkbox>
                          </div>
                          
                          <div className="shopping-filter__sort">
                            <div className="input-row">
                              <p className="input-row__title">
                                Sort by
                              </p>
                              <div className="input-row__item fieldset fieldset--sort">
                                <div className="input input--small">
                                  <a href="#" className="icon">
                                    <svg className="icon">
                                      <use xlinkHref="/assets/images/sprite.svg#sort"></use>
                                    </svg>
                                  </a>
                                  <select name="" id="" className="input__item">
                                    <option value="">Name</option>
                                    <option value="">Price</option>
                                  </select>
                                  <svg className="icon icon--arrow">
                                    <use xlinkHref="/assets/images/sprite.svg#down-chevron"></use>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <button type="submit" className="shopping-filter__button button button--center button--text">
                            <span className="button__text">apply</span>
                            <svg className="button__icon">
                              <use xlinkHref="/assets/images/sprite.svg#arrow-right"></use>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  
                  <div className="product-list">
                    {loading ? (
                      <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p className="text text--base">Loading products...</p>
                      </div>
                    ) : error ? (
                      <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p className="text text--base">Error loading products: {error.message}</p>
                      </div>
                            ) : (
                              products.map((product: any) => (
                                <ProductRow
                                  key={product.id}
                                  product={product}
                                  variant="default"
                                  onBuild={handleBuildClick}
                                />
                              ))
                            )}
                  </div>
                  
                  <a href="#" className="button button--text button--center">
                    <span className="button__text">more products</span>
                    <svg className="button__icon">
                      <use xlinkHref="/assets/images/sprite.svg#arrow-right"></use>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
});

ShoppingPage.displayName = 'ShoppingPage';