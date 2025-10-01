import React from 'react';
import { ProductRow } from '@/components/features/product_row';
import { UniversalProductItem } from '@/types';
import { useCart } from '@/hooks/useCart';
import { CartItem as CartItemType } from '@/types';

export const CartPage: React.FC = React.memo(() => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  
  const cartItems: (UniversalProductItem & { quantity: number })[] = cart.items.map((item: CartItemType) => ({
    id: item.product.id,
    name: item.product.name,
    model: item.product.model || 'N/A',
    description: item.product.description || 'No description',
    price: item.product.price,
    image: item.product.image,
    quantity: item.quantity
  }));

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <main className="content">
      <div className="content__wrapper">
        <section className="section">
          <div className="section__wrapper">
            <div className="container">
              <div className="section__header">
                <p className="title title--base">
                  Cart & Checkout
                </p>
              </div>
              <div className="cart">
                <div className="cart__wrapper">
                  <div className="cart__main">
                    <div className="product-list">
                      {cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                          <p className="text text--base">Your cart is empty</p>
                        </div>
                      ) : (
                        cartItems.map((item) => (
                          <ProductRow
                            key={item.id}
                            product={item}
                            variant="cart"
                            quantity={item.quantity}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveFromCart={handleRemoveItem}
                          />
                        ))
                      )}
                    </div>
                    
                    <div className="cart-checkout">
                      <div className="cart-checkout__wrapper">
                        <div className="cart-checkout__header">
                          <div className="cart-checkout__row">
                            <p className="cart-checkout__text text text--base">
                              Quantity:
                            </p>
                            <p className="cart-checkout__text text text--base">
                              {totalQuantity} products
                            </p>
                          </div>
                        </div>
                        <div className="cart-checkout__footer">
                          <div className="cart-checkout__row">
                            <p className="cart-checkout__text text text--middle">
                              Total cost:
                            </p>
                            <p className="cart-checkout__price">
                              {totalCost.toLocaleString()} $
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
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
        </section>
      </div>
    </main>
  );
});

CartPage.displayName = 'CartPage';