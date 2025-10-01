import React from 'react';

export interface ProductFiltersState {
  category?: string;
  brand?: string;
  model?: string;
  year?: string;
  material?: string;
  colorScheme?: string;
  productType?: string;
  isAvailable?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
}

interface ProductFiltersProps {
  filters: ProductFiltersState;
  onFiltersChange: (filters: ProductFiltersState) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ 
  filters, 
  onFiltersChange 
}) => {
  const handleFilterChange = (key: keyof ProductFiltersState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="product-filters">
      <div className="product-filters__header">
        <h3>Filters</h3>
        <button onClick={clearFilters} className="product-filters__clear">
          Clear All
        </button>
      </div>

      <div className="product-filters__content">
        {/* Category Filter */}
        <div className="product-filters__group">
          <label className="product-filters__label">Category</label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
            className="product-filters__select"
          >
            <option value="">All Categories</option>
            <option value="bed-rack">Bed Rack</option>
            <option value="bull-bar">Bull Bar</option>
            <option value="hd-grille-guard">HD Grille Guard</option>
            <option value="running-board">Running Board</option>
          </select>
        </div>

        {/* Product Type Filter */}
        <div className="product-filters__group">
          <label className="product-filters__label">Product Type</label>
          <select
            value={filters.productType || ''}
            onChange={(e) => handleFilterChange('productType', e.target.value || undefined)}
            className="product-filters__select"
          >
            <option value="">All Types</option>
            <option value="Accessory">Accessory</option>
            <option value="SubAccessory">SubAccessory</option>
          </select>
        </div>

        {/* Availability Filter */}
        <div className="product-filters__group">
          <label className="product-filters__checkbox">
            <input
              type="checkbox"
              checked={filters.isAvailable || false}
              onChange={(e) => handleFilterChange('isAvailable', e.target.checked || undefined)}
            />
            <span>In Stock Only</span>
          </label>
        </div>

        {/* Price Range Filter */}
        <div className="product-filters__group">
          <label className="product-filters__label">Price Range</label>
          <div className="product-filters__price-range">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange?.min || ''}
              onChange={(e) => handleFilterChange('priceRange', {
                ...filters.priceRange,
                min: e.target.value ? Number(e.target.value) : undefined
              })}
              className="product-filters__input"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange?.max || ''}
              onChange={(e) => handleFilterChange('priceRange', {
                ...filters.priceRange,
                max: e.target.value ? Number(e.target.value) : undefined
              })}
              className="product-filters__input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

