import React, { useState } from 'react';

export const LoginPage: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'phone') {
      processedValue = formatPhoneNumber(value);
    } else if (name === 'zipCode') {
      processedValue = formatZipCode(value);
    }

    setSignUpData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 3) return `(${phoneNumber}`;
    if (phoneNumberLength < 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const formatZipCode = (value: string) => {
    if (!value) return value;
    return value.slice(0, 11);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign In submitted:', signInData);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign Up submitted:', signUpData);
  };

  return (
    <main className="content">
      <div className="content__wrapper">
        <section className="section">
          <div className="section__wrapper">
            <div className="container" style={{ marginTop: '6rem' }}>
              <div className="block login">
                <div className="block__wrapper">
                  <div className="login__nav">
                    <button 
                      className={`login__title ${activeTab === 'signin' ? 'active' : ''}`}
                      onClick={() => setActiveTab('signin')}
                    >
                      Sign In
                    </button>
                    <button 
                      className={`login__title ${activeTab === 'signup' ? 'active' : ''}`}
                      onClick={() => setActiveTab('signup')}
                    >
                      Sign Up
                    </button>
                  </div>
                  
                  <div className="block__grid block__grid--login block__grid--auto">
                    <div className={`login-block ${activeTab === 'signin' ? 'active' : ''}`}>
                      <div className="block-content block-content--bg--desktop block-content--gradient">
                        <div className="block-content__wrapper">
                          <div className="block-content__box">
                            <div className="block-content__text">
                              <div className="block-content__main">
                                <form action="" className="form" onSubmit={handleSignInSubmit}>
                                  <div className="form__wrapper">
                                    <div className="form__header form__header--desktop">
                                      <p className="title title--base title--center">
                                        Sign In
                                      </p>
                                    </div>
                                    <div className="form__column">
                                      <fieldset className="fieldset">
                                        <legend className="fieldset__legend">
                                          Your email (login)
                                        </legend>
                                        <div className="input">
                                          <input
                                            type="email"
                                            name="email"
                                            value={signInData.email}
                                            onChange={handleSignInChange}
                                            className="input__item"
                                            placeholder=""
                                            required
                                          />
                                        </div>
                                      </fieldset>
                                      <fieldset className="fieldset">
                                        <legend className="fieldset__legend">
                                          Password
                                        </legend>
                                        <div className="input">
                                          <input
                                            type="password"
                                            name="password"
                                            value={signInData.password}
                                            onChange={handleSignInChange}
                                            className="input__item"
                                            placeholder=""
                                            required
                                          />
                                        </div>
                                      </fieldset>
                                    </div>
                                    <button type="submit" className="button button--center button--text" style={{ marginTop: '2rem' }}>
                                      <span className="button__text">SIGN IN</span>
                                      <svg className="button__icon">
                                        <use xlinkHref="/assets/images/sprite.svg#arrow-right"></use>
                                      </svg>
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`login-block ${activeTab === 'signup' ? 'active' : ''}`}>
                      <div className="block-content block-content--bg--desktop block-content--gradient--light">
                        <div className="block-content__wrapper">
                          <div className="block-content__box">
                            <div className="block-content__text">
                              <div className="block-content__main">
                                <form action="" className="form" onSubmit={handleSignUpSubmit}>
                                  <div className="form__wrapper">
                                    <div className="form__header form__header--desktop">
                                      <p className="title title--base title--center">
                                        Sign Up
                                      </p>
                                    </div>
                                    <div className="form__content">
                                      <fieldset className="fieldset">
                                        <legend className="fieldset__legend">
                                          Your email
                                        </legend>
                                        <div className="input">
                                          <input
                                            type="email"
                                            name="email"
                                            value={signUpData.email}
                                            onChange={handleSignUpChange}
                                            className="input__item"
                                            placeholder="Email@example.com"
                                            required
                                          />
                                        </div>
                                      </fieldset>

                                      <div className="form__row">
                                        <fieldset className="fieldset">
                                          <legend className="fieldset__legend">
                                            First Name
                                          </legend>
                                          <div className="input">
                                            <input
                                              type="text"
                                              name="firstName"
                                              value={signUpData.firstName}
                                              onChange={handleSignUpChange}
                                              className="input__item"
                                              placeholder="First Name"
                                              required
                                            />
                                          </div>
                                        </fieldset>
                                        <fieldset className="fieldset">
                                          <legend className="fieldset__legend">
                                            Last Name
                                          </legend>
                                          <div className="input">
                                            <input
                                              type="text"
                                              name="lastName"
                                              value={signUpData.lastName}
                                              onChange={handleSignUpChange}
                                              className="input__item"
                                              placeholder="Last Name"
                                              required
                                            />
                                          </div>
                                        </fieldset>
                                      </div>

                                      <div className="form__column">
                                        <fieldset className="fieldset">
                                          <legend className="fieldset__legend">
                                            Your Address
                                          </legend>
                                          <div className="input">
                                            <input
                                              type="text"
                                              name="address1"
                                              value={signUpData.address1}
                                              onChange={handleSignUpChange}
                                              className="input__item"
                                              placeholder="Address 1"
                                              required
                                            />
                                          </div>
                                        </fieldset>
                                        <fieldset className="fieldset">
                                          <div className="input">
                                            <input
                                              type="text"
                                              name="address2"
                                              value={signUpData.address2}
                                              onChange={handleSignUpChange}
                                              className="input__item"
                                              placeholder="Address 2"
                                            />
                                          </div>
                                        </fieldset>
                                      </div>

                                      <div className="form__row">
                                        <fieldset className="fieldset">
                                          <legend className="fieldset__legend">
                                            City
                                          </legend>
                                          <div className="input">
                                            <input
                                              type="text"
                                              name="city"
                                              value={signUpData.city}
                                              onChange={handleSignUpChange}
                                              className="input__item"
                                              placeholder="City"
                                              required
                                            />
                                          </div>
                                        </fieldset>
                                        <fieldset className="fieldset">
                                          <legend className="fieldset__legend">
                                            State
                                          </legend>
                                          <div className="input">
                                            <input
                                              type="text"
                                              name="state"
                                              value={signUpData.state}
                                              onChange={handleSignUpChange}
                                              className="input__item"
                                              placeholder="State"
                                              required
                                            />
                                          </div>
                                        </fieldset>
                                      </div>

                                      <fieldset className="fieldset">
                                        <legend className="fieldset__legend">
                                          ZIP code
                                        </legend>
                                        <div className="input">
                                          <input
                                            type="text"
                                            name="zipCode"
                                            value={signUpData.zipCode}
                                            onChange={handleSignUpChange}
                                            className="input__item"
                                            placeholder="***********"
                                            style={{ letterSpacing: '0.25rem' }}
                                            required
                                          />
                                        </div>
                                      </fieldset>

                                      <fieldset className="fieldset">
                                        <legend className="fieldset__legend">
                                          Phone number
                                        </legend>
                                        <div className="input">
                                          <input
                                            type="tel"
                                            name="phone"
                                            value={signUpData.phone}
                                            onChange={handleSignUpChange}
                                            className="input__item"
                                            placeholder="(___) ___-____"
                                          />
                                        </div>
                                      </fieldset>

                                      <button type="submit" className="button button--center button--text">
                                        <span className="button__text">SIGN UP</span>
                                        <svg className="button__icon">
                                          <use xlinkHref="/assets/images/sprite.svg#arrow-right"></use>
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
});

LoginPage.displayName = 'LoginPage';