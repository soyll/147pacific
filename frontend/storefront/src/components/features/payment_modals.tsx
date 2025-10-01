import React, { useState } from 'react';
import { Modal } from '../common/modal';

export const PaymentModals: React.FC = React.memo(() => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handlePaymentSubmit = () => {
    setIsPaymentModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <>
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Payment Information"
        size="medium"
      >
        <div className="payment-modal">
          <form className="payment-form">
            <div className="form-group">
              <label>Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="text" placeholder="MM/YY" />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="text" placeholder="123" />
              </div>
            </div>
            <div className="form-group">
              <label>Cardholder Name</label>
              <input type="text" placeholder="John Doe" />
            </div>
            <button type="button" onClick={handlePaymentSubmit} className="button button--primary">
              Pay Now
            </button>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Payment Successful"
        size="small"
      >
        <div className="success-modal">
          <div className="success-icon">✓</div>
          <h3>Payment Successful!</h3>
          <p>Your order has been processed successfully.</p>
          <button onClick={() => setIsSuccessModalOpen(false)} className="button button--primary">
            Continue Shopping
          </button>
        </div>
      </Modal>
    </>
  );
});

PaymentModals.displayName = 'PaymentModals';

