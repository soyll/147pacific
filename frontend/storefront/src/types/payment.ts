export interface PaymentCard {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'jcb';
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}
