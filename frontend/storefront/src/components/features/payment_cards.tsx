import React from 'react';

export const PaymentCards: React.FC = React.memo(() => {
  return (
    <div className="payment-cards">
      <div className="payment-cards__wrapper">
        <div className="payment-cards__list">
          <div className="payment-card">
            <img src="/assets/images/cards/visa.webp" alt="Visa" />
          </div>
          <div className="payment-card">
            <img src="/assets/images/cards/mastercard.webp" alt="Mastercard" />
          </div>
          <div className="payment-card">
            <img src="/assets/images/cards/amex.webp" alt="American Express" />
          </div>
          <div className="payment-card">
            <img src="/assets/images/cards/jcb.webp" alt="JCB" />
          </div>
        </div>
      </div>
    </div>
  );
});

PaymentCards.displayName = 'PaymentCards';

