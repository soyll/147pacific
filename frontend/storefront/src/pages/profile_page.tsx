import React, { useState } from 'react';
import { PaymentCards } from '@/components/features/payment_cards';
import { PaymentCard } from '@/types/payment';

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  amount: string;
  status: string;
  details: string;
}


export const ProfilePage: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState<'data' | 'payment' | 'orders'>('orders');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState({
    firstName: 'Ivan',
    lastName: 'Ivanov',
    country: 'United States',
    streetAddress: '13500 Lyndhurst Street',
    apartment: '2089',
    city: 'Austin',
    zipCode: '78717',
    state: 'Texas',
    phone: '(512) 444-4444',
    passwordChange: '',
    passwordConfirm: '',
    currentPassword: ''
  });

  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([
    {
      id: '1',
      type: 'visa',
      number: '4560',
      expiry: '12/25',
      cvv: '123',
      name: 'John Doe'
    },
    {
      id: '2',
      type: 'mastercard',
      number: '7890',
      expiry: '08/26',
      cvv: '456',
      name: 'John Doe'
    }
  ]);

  const [modals, setModals] = useState({
    addCard: false,
    editCard: false,
    removeCard: false
  });

  const [selectedCard, setSelectedCard] = useState<PaymentCard | null>(null);

  const handleClearField = (fieldName: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const handleAddCard = () => {
    setModals(prev => ({ ...prev, addCard: true }));
  };

  const handleEditCard = (card: PaymentCard) => {
    setSelectedCard(card);
    setModals(prev => ({ ...prev, editCard: true }));
  };

  const handleRemoveCard = (cardId: string) => {
    const card = paymentCards.find(c => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      setModals(prev => ({ ...prev, removeCard: true }));
    }
  };

  const handleSaveNewCard = (cardData: Omit<PaymentCard, 'id'>) => {
    const newCard: PaymentCard = {
      ...cardData,
      id: Date.now().toString()
    };
    setPaymentCards(prev => [...prev, newCard]);
    setModals(prev => ({ ...prev, addCard: false }));
  };

  const handleSaveEditedCard = (cardData: PaymentCard) => {
    setPaymentCards(prev => prev.map(card =>
      card.id === cardData.id ? cardData : card
    ));
    setModals(prev => ({ ...prev, editCard: false }));
    setSelectedCard(null);
  };

  void handleAddCard;
  void handleEditCard;
  void handleRemoveCard;
  void handleSaveNewCard;
  void handleSaveEditedCard;

  const handleConfirmRemoveCard = () => {
    if (selectedCard) {
      setPaymentCards(prev => prev.filter(card => card.id !== selectedCard.id));
      setModals(prev => ({ ...prev, removeCard: false }));
      setSelectedCard(null);
    }
  };

  const closeModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    setSelectedCard(null);
  };

  void handleConfirmRemoveCard;
  void closeModal;

  const orders: Order[] = [
    {
      id: 1,
      orderNumber: 'AMO25-123125',
      date: '12/31/2025',
      amount: '$1,850.00',
      status: 'Placed',
      details: '*4560'
    },
    {
      id: 2,
      orderNumber: 'AMO25-123125',
      date: '12/31/2025',
      amount: '$1,850.00',
      status: 'Placed',
      details: '*4560'
    },
    {
      id: 3,
      orderNumber: 'AMO25-123125',
      date: '12/31/2025',
      amount: '$1,850.00',
      status: 'Placed',
      details: '*4560'
    },
    {
      id: 4,
      orderNumber: 'AMO25-123125',
      date: '12/31/2025',
      amount: '$1,850.00',
      status: 'Placed',
      details: '*4560'
    },
    {
      id: 5,
      orderNumber: 'AMO25-123125',
      date: '12/31/2025',
      amount: '$1,850.00',
      status: 'Placed',
      details: '*4560'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'data':
        return (
          <div className="profile-content__main">
            <p className="text text--middle text--semibold">Personal Data</p>
            <form action="" className="form">
              <div className="form__wrapper">
                <div className="form__content form__content--gap--small">
                  <div className="form-block">
                    <div className="form-block__wrapper">
                      <div className="form-block__grid">
                        <div className="form-block__data">
                          <p className="text text--tiny text--grey--second">
                            First Name:
                          </p>
                          <p className="text text--base">
                            Ivan
                          </p>
                        </div>
                        <fieldset className="fieldset">
                          <legend className="fieldset__legend">
                            First Name
                          </legend>
                          <div className="input">
                            <input
                              type="text"
                              className="input__item"
                              placeholder="Ivan"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                            />
                          </div>
                        </fieldset>
                      </div>
                      <div className="form-block__grid">
                        <div className="form-block__data">
                          <p className="text text--tiny text--grey--second">
                            Last Name:
                          </p>
                          <p className="text text--base">
                            Ivanov
                          </p>
                        </div>
                        <fieldset className="fieldset">
                          <legend className="fieldset__legend">
                            Last Name
                          </legend>
                          <div className="input">
                            <input
                              type="text"
                              className="input__item"
                              placeholder="Ivanov"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                            />
                          </div>
                        </fieldset>
                      </div>
                      <div className="form-block__grid">
                        <div className="form-block__data form-block__data--start">
                          <p className="text text--tiny text--grey--second">
                            Address:
                          </p>
                          <p className="text text--base">
                            United States <br />
                            13500 Lyndhurst Street <br />
                            2089 <br />
                            Austin 78717 <br />
                            Texas
                          </p>
                        </div>
                        <div className="fieldset-box">
                          <fieldset className="fieldset">
                            <legend className="fieldset__legend">
                              Country
                            </legend>
                            <div className="input">
                              <select
                                name=""
                                id=""
                                className="input__item"
                                value={formData.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                              >
                                <option disabled value="">Choose 1</option>
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="Mexico">Mexico</option>
                              </select>
                              <svg className="icon icon--arrow">
                                <use xlinkHref="/assets/images/sprite.svg#down-chevron"></use>
                              </svg>
                            </div>
                          </fieldset>
                          <fieldset className="fieldset">
                            <div className="input">
                              <input
                                type="text"
                                className="input__item"
                                placeholder="13500 Lyndhurst Street"
                                value={formData.streetAddress}
                                onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                              />
                              <button
                                type="button"
                                className="fieldset-clear"
                                data-text="Clear"
                                onClick={() => handleClearField('streetAddress')}
                              ></button>
                            </div>
                          </fieldset>
                          <fieldset className="fieldset">
                            <div className="input">
                              <input
                                type="text"
                                className="input__item"
                                placeholder="2089"
                                value={formData.apartment}
                                onChange={(e) => handleInputChange('apartment', e.target.value)}
                              />
                            </div>
                          </fieldset>
                          <div className="fieldset-box__row">
                            <fieldset className="fieldset">
                              <div className="input">
                                <input
                                  type="text"
                                  className="input__item"
                                  placeholder="Austin"
                                  value={formData.city}
                                  onChange={(e) => handleInputChange('city', e.target.value)}
                                />
                              </div>
                            </fieldset>
                            <fieldset className="fieldset">
                              <div className="input">
                                <input
                                  type="text"
                                  className="input__item"
                                  placeholder="78717"
                                  value={formData.zipCode}
                                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                />
                              </div>
                            </fieldset>
                          </div>
                          <fieldset className="fieldset">
                            <div className="input">
                              <select
                                name=""
                                id=""
                                className="input__item"
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                              >
                                <option disabled value="">Choose 1</option>
                                <option value="Texas">Texas</option>
                                <option value="California">California</option>
                                <option value="New York">New York</option>
                              </select>
                              <svg className="icon icon--arrow">
                                <use xlinkHref="/assets/images/sprite.svg#down-chevron"></use>
                              </svg>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                      <div className="form-block__grid">
                        <div className="form-block__data">
                          <p className="text text--tiny text--grey--second">
                            Phone:
                          </p>
                          <p className="text text--base">
                            (512) 444-4444
                          </p>
                        </div>
                        <fieldset className="fieldset">
                          <div className="input">
                            <input
                              type="text"
                              className="input__item"
                              placeholder="(512) 444-4444"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                            <svg className="icon">
                              <use xlinkHref="/assets/images/sprite.svg#info"></use>
                            </svg>
                          </div>
                        </fieldset>
                      </div>
                      <div className="form-block__grid">
                        <div className="form-block__data">
                          <p className="text text--tiny text--grey--second">
                            Password:
                          </p>
                        </div>
                        <div className="form-block__wrapper">
                          <fieldset className="fieldset">
                            <legend className="fieldset__legend">
                              Password Change
                            </legend>
                            <div className="input">
                              <input
                                type={showPasswords['passwordChange'] ? 'text' : 'password'}
                                className="input__item"
                                placeholder="**********"
                                value={formData.passwordChange}
                                onChange={(e) => handleInputChange('passwordChange', e.target.value)}
                              />
                              <button
                                type="button"
                                className="icon"
                                onClick={() => togglePasswordVisibility('passwordChange')}
                              >
                                <svg className="icon" style={{ opacity: showPasswords['passwordChange'] ? '0.5' : '1' }}>
                                  <use xlinkHref="/assets/images/sprite.svg#eye"></use>
                                </svg>
                              </button>
                            </div>
                          </fieldset>
                          <fieldset className="fieldset">
                            <legend className="fieldset__legend">
                              Password Change Confirmation
                            </legend>
                            <div className="input">
                              <input
                                type={showPasswords['passwordConfirm'] ? 'text' : 'password'}
                                className="input__item"
                                placeholder="**********"
                                value={formData.passwordConfirm}
                                onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
                              />
                              <button
                                type="button"
                                className="icon"
                                onClick={() => togglePasswordVisibility('passwordConfirm')}
                              >
                                <svg className="icon" style={{ opacity: showPasswords['passwordConfirm'] ? '0.5' : '1' }}>
                                  <use xlinkHref="/assets/images/sprite.svg#eye"></use>
                                </svg>
                              </button>
                            </div>
                          </fieldset>
                          <fieldset className="fieldset">
                            <legend className="fieldset__legend">
                              Current Password
                            </legend>
                            <div className="input">
                              <input
                                type="password"
                                className="input__item"
                                placeholder=""
                                value={formData.currentPassword}
                                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                              />
                            </div>
                          </fieldset>
                        </div>
                      </div>
                      <div className="form-block__grid">
                        <div className="form-block__data">
                        </div>
                        <button type="submit" className="button button--center button--text">
                          <span className="button__text">CONFIRM CHANGES</span>
                          <svg className="button__icon">
                            <use xlinkHref="/assets/images/sprite.svg#arrow-right"></use>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        );
      case 'payment':
        return (
          <div className="profile-content__main">
            <p className="text text--middle text--semibold">Payment Information</p>
            <PaymentCards />
          </div>
        );
      case 'orders':
      default:
        return (
          <div className="profile-content__main">
            <p className="text text--middle text--semibold">Orders</p>
            <div className="profile-table">
              <div className="profile-table__scroll">
                <div className="profile-table__wrapper">
                  <div className="profile-table__row profile-table__row--title">
                    <div className="profile-table__block">
                      <p className="profile-table__title">
                        Order Number
                      </p>
                    </div>
                    <div className="profile-table__block">
                      <p className="profile-table__title">
                        Date
                      </p>
                    </div>
                    <div className="profile-table__block">
                      <p className="profile-table__title">
                        Amount
                      </p>
                    </div>
                    <div className="profile-table__block">
                      <p className="profile-table__title">
                        Status
                      </p>
                    </div>
                    <div className="profile-table__block">
                      <p className="profile-table__title">
                        Details
                      </p>
                    </div>
                    <div className="profile-table__block">
                    </div>
                  </div>
                  {orders.map((order) => (
                    <div key={order.id} className="profile-table__row">
                      <div className="profile-table__block">
                        <p className="profile-table__text">
                          {order.orderNumber}
                        </p>
                      </div>
                      <div className="profile-table__block">
                        <p className="profile-table__text">
                          {order.date}
                        </p>
                      </div>
                      <div className="profile-table__block">
                        <p className="profile-table__text">
                          {order.amount}
                        </p>
                      </div>
                      <div className="profile-table__block">
                        <p className="profile-table__text profile-table__text--bold">
                          {order.status}
                        </p>
                      </div>
                      <div className="profile-table__block">
                        <p className="profile-table__text">
                          {order.details}
                        </p>
                      </div>
                      <div className="profile-table__block">
                        <a href="#" className="profile-table__icon">
                          <svg className="icon">
                            <use xlinkHref="/assets/images/sprite.svg#pdf"></use>
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="profile-content__notice">
              Your last five orders are shown. For details, visit the Orders tab.
            </p>
          </div>
        );
    }
  };

  return (
    <>
      <main className="content" style={{ marginTop: '6rem' }}>
        <div className="content__wrapper">
          <section className="section">
            <div className="section__wrapper">
              <div className="container">
                <div className="profile">
                  <div className="profile__grid">
                    <div className="profile-aside">
                      <div className="profile-aside__wrapper">
                        <div className="profile-aside__header">
                          <div className="profile-card">
                            <div className="profile-card__icon">
                              <svg className="icon">
                                <use xlinkHref="/assets/images/sprite.svg#user"></use>
                              </svg>
                            </div>
                            <p className="profile-card__name text text--middle text--bold">
                              John Doe
                            </p>
                          </div>
                          <a href="#" data-popup=".popup-notification" className="profile-notification">
                            <svg className="profile-notification__icon">
                              <use xlinkHref="/assets/images/sprite.svg#bell"></use>
                            </svg>
                            <span className="profile-notification__count">13</span>
                          </a>
                        </div>
                        <ul className="profile-aside__list">
                          <li>
                            <button
                              onClick={() => setActiveTab('data')}
                              className={`profile-link ${activeTab === 'data' ? 'active' : ''}`}
                            >
                              <svg className="profile-link__icon">
                                <use xlinkHref="/assets/images/sprite.svg#data"></use>
                              </svg>
                              <span className="text text--base text--opacity">
                                Personal Data
                              </span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => setActiveTab('payment')}
                              className={`profile-link ${activeTab === 'payment' ? 'active' : ''}`}
                            >
                              <svg className="profile-link__icon">
                                <use xlinkHref="/assets/images/sprite.svg#payment"></use>
                              </svg>
                              <span className="text text--base text--opacity">
                                Payment
                              </span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => setActiveTab('orders')}
                              className={`profile-link ${activeTab === 'orders' ? 'active' : ''}`}
                            >
                              <svg className="profile-link__icon">
                                <use xlinkHref="/assets/images/sprite.svg#orders"></use>
                              </svg>
                              <span className="text text--base text--opacity">
                                Orders
                              </span>
                            </button>
                          </li>
                          <li className="profile-aside__list-exit">
                            <a href="#" className="profile-link">
                              <svg className="profile-link__icon">
                                <use xlinkHref="/assets/images/sprite.svg#exit"></use>
                              </svg>
                              <span className="text text--base text--opacity">
                                Exit
                              </span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="profile-content">
                      <div className="profile-content__wrapper">
                        {renderContent()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
});

ProfilePage.displayName = 'ProfilePage';