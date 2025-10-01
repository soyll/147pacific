import React from 'react';
import { UniversalProductItem } from '@/types';

export type ProductRowVariant = 'default' | 'builder' | 'cart';

interface ProductRowProps {
  product: UniversalProductItem;
  variant?: ProductRowVariant;
  onBuild?: (productId: string) => void;
  onAddToCart?: (productId: string, quantity?: number) => void;
  onRemoveFromCart?: (productId: string) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  quantity?: number;
  isSelected?: boolean;
  isDisabled?: boolean;
  onSelect?: (productId: string, selected: boolean) => void;
  onChange?: (productId: string) => void;
  showCompatibility?: boolean;
  showCheckbox?: boolean;
  showBuildButton?: boolean;
  compatibleWith?: string[];
}

export const ProductRow: React.FC<ProductRowProps> = ({
  product,
  variant = 'default',
  onBuild,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  quantity = 1,
  isSelected = false,
  isDisabled = false,
  onSelect,
  onChange,
  showCompatibility = false,
  showCheckbox = false,
  showBuildButton = true,
  compatibleWith = []
}) => {
  const handleBuildClick = () => {
    if (onBuild) {
      onBuild(product.id);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id, quantity);
    }
  };

  const handleRemoveFromCart = () => {
    if (onRemoveFromCart) {
      onRemoveFromCart(product.id);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (onUpdateQuantity && newQuantity > 0) {
      onUpdateQuantity(product.id, newQuantity);
    }
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(product.id, !isSelected);
    }
  };

  const handleChange = () => {
    if (onChange) {
      onChange(product.id);
    }
  };

  const renderDefaultVariant = () => (
    <div className="product-card">
      <div className="product-card__wrapper">
        <div className="product-card__img">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-card__row">
          <div className="product-card__block">
            <div className="product-card__content product-card__content--mobile--full">
              <p className="text text--middle text--semibold">
                {product.name}
                <span className="text text--grey--dark">
                  {" | "}{product.model}
                </span>
              </p>
              <p className="text text--base text--opacity">
                {product.description}
              </p>
            </div>
          </div>
          <div className="product-card__block">
            <div className="product-card__content">
              <p className="text text--middle text--semibold">
                Model:
              </p>
              <p className="text text--base text--grey--light">
                {product.model}
              </p>
            </div>
          </div>
          <div className="product-card__block product-card__block--mobile--clear">
            <div className="product-card__content">
              <p className="text text--middle">
                <span className="text text--grey--lighter">Starts With: </span>
                ${product.price.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="product-card__block">
            <button 
              className="button button--base button--accent"
              onClick={handleBuildClick}
            >
              Build{" "}
              <svg className="button__icon">
                <use xlinkHref="/assets/images/sprite.svg#shop"></use>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBuilderVariant = () => (
    <div className={`product-card product-card--builder ${isSelected ? 'product-card--selected' : ''} ${isDisabled ? 'product-card--disabled' : ''}`}>
      <div className="product-card__wrapper">
        {showCheckbox && (
          <div className="product-card__checkbox">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onChange ? handleChange : handleSelect}
              disabled={isDisabled}
              className="checkbox__input"
            />
          </div>
        )}
        <div className="product-card__img">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-card__row">
          <div className="product-card__block">
            <div className="product-card__content product-card__content--mobile--full">
              <p className="text text--middle text--semibold">
                {product.name}
                <span className="text text--grey--dark">
                  {" | "}{product.model}
                </span>
              </p>
              <p className="text text--base text--opacity">
                {product.description}
              </p>
              {showCompatibility && compatibleWith.length > 0 && (
                <p className="text text--small text--grey--light">
                  Compatible with: {compatibleWith.join(', ')}
                </p>
              )}
            </div>
          </div>
          <div className="product-card__block">
            <div className="product-card__content">
              <p className="text text--middle text--semibold">
                Model:
              </p>
              <p className="text text--base text--grey--light">
                {product.model}
              </p>
            </div>
          </div>
          <div className="product-card__block product-card__block--mobile--clear">
            <div className="product-card__content">
              <p className="text text--middle">
                <span className="text text--grey--lighter">Price: </span>
                ${product.price.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="product-card__block">
            {showBuildButton && (
              <button 
                className="button button--base button--accent"
                onClick={handleAddToCart}
                disabled={isDisabled}
              >
                Add to Cart{" "}
                <svg className="button__icon">
                  <use xlinkHref="/assets/images/sprite.svg#cart"></use>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCartVariant = () => (
    <div className="product-card product-card--cart">
      <div className="product-card__wrapper">
        <div className="product-card__img">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-card__row">
          <div className="product-card__block">
            <div className="product-card__content product-card__content--mobile--full">
              <p className="text text--middle text--semibold">
                {product.name}
                <span className="text text--grey--dark">
                  {" | "}{product.model}
                </span>
              </p>
              <p className="text text--base text--opacity">
                {product.description}
              </p>
            </div>
          </div>
          <div className="product-card__block">
            <div className="product-card__content">
              <p className="text text--middle text--semibold">
                Quantity:
              </p>
              <div className="quantity-controls">
                <button 
                  className="button button--small"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  -
                </button>
                <span className="text text--base">{quantity}</span>
                <button 
                  className="button button--small"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="product-card__block product-card__block--mobile--clear">
            <div className="product-card__content">
              <p className="text text--middle">
                <span className="text text--grey--lighter">Total: </span>
                ${(product.price * quantity).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="product-card__block">
            <button 
              className="button button--base button--danger"
              onClick={handleRemoveFromCart}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (variant) {
    case 'builder':
      return renderBuilderVariant();
    case 'cart':
      return renderCartVariant();
    default:
      return renderDefaultVariant();
  }
};

