import React, { useState } from 'react';

export interface FeedbackProps {
  title?: string;
  showContactInfo?: boolean;
  showCustomerService?: boolean;
}

export const Feedback: React.FC<FeedbackProps> = React.memo(({
  title = "Contact us",
  showContactInfo = true,
  showCustomerService = true
}) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 3) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      alert('Thank you for your message! We will get back to you soon.');
      
      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        message: ''
      });
    }
  };

  return (
    <section className="section">
      <div className="section__wrapper">
        <div className="container">
          <div className="block">
            <div className="block__wrapper">
              <div className="block__grid block__grid--auto">
                {/* Left Column - Contact Information */}
                <div className="block-content block-content--gradient">
                  <div className="block-content__wrapper">
                    <div className="block-content__box">
                      <div className="block-content__text">
                        <div className="block-content__main">
                          {showContactInfo && (
                            <div className="block-item">
                              <div className="block-item__wrapper">
                                <h2 className="title title--base">Contact</h2>
                                <ul className="contact-list">
                                  <li className="contact-list__item">
                                    <a href="#" className="contact-link">
                                      <span className="contact-link__icon">
                                        <svg className="icon">
                                          <use xlinkHref="/assets/images/sprite.svg#pin"></use>
                                        </svg>
                                      </span>
                                      <span className="text text--opacity">
                                        1301 Blue Ridge Dr Georgetown, Texas 78626
                                      </span>
                                    </a>
                                  </li>
                                  <li className="contact-list__item">
                                    <a href="tel:(512) 636-8053" className="contact-link">
                                      <span className="contact-link__icon">
                                        <svg className="icon">
                                          <use xlinkHref="/assets/images/sprite.svg#phone"></use>
                                        </svg>
                                      </span>
                                      <span className="text text--opacity">
                                        (512) 636-8053
                                      </span>
                                    </a>
                                  </li>
                                  <li className="contact-list__item">
                                    <a href="mailto:info@147pacific.com" className="contact-link">
                                      <span className="contact-link__icon">
                                        <svg className="icon">
                                          <use xlinkHref="/assets/images/sprite.svg#email"></use>
                                        </svg>
                                      </span>
                                      <span className="text text--opacity text--underline">
                                        info@147pacific.com
                                      </span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          )}

                          {showCustomerService && (
                            <div className="block-item">
                              <div className="block-item__wrapper">
                                <h2 className="title title--base">Customer service</h2>
                                <ul className="contact-list">
                                  <li className="contact-list__item">
                                    <a href="mailto:customer@147pacific.com" className="contact-link">
                                      <span className="contact-link__icon">
                                        <svg className="icon">
                                          <use xlinkHref="/assets/images/sprite.svg#email"></use>
                                        </svg>
                                      </span>
                                      <span className="text text--opacity text--underline">
                                        customer@147pacific.com
                                      </span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          )}

                          <p className="text text--opacity">
                            All products are proudly designed, engineered, and manufactured in the USA using premium materials. Built to meet the highest standards of quality, durability, and performance for real-world American conditions. Family-owned and operated in Georgetown, Texas, the company is dedicated to American craftsmanship and customer-focused service.
                          </p>

                          <ul className="contact-list contact-list--row">
                            <li className="contact-list__item">
                              <a href="#" className="contact-link contact-link--big" aria-label="Instagram">
                                <span className="contact-link__icon">
                                  <svg className="icon">
                                    <use xlinkHref="/assets/images/sprite.svg#insta"></use>
                                  </svg>
                                </span>
                              </a>
                            </li>
                            <li className="contact-list__item">
                              <a href="#" className="contact-link contact-link--big" aria-label="YouTube">
                                <span className="contact-link__icon">
                                  <svg className="icon">
                                    <use xlinkHref="/assets/images/sprite.svg#yt"></use>
                                  </svg>
                                </span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Contact Form */}
                <div className="block-content block-content--gradient--light">
                  <div className="block-content__wrapper">
                    <div className="block-content__box">
                      <div className="block-content__text">
                        <div className="block-content__main">
                          <form onSubmit={handleSubmit} className="form feedback-form">
                            <div className="form__wrapper form__wrapper--small">
                              <div className="form__header">
                                <h2 className="title title--base title--center">{title}</h2>
                              </div>
                              <div className="form__content">
                                <fieldset className="fieldset">
                                  <legend className="fieldset__legend">Your email</legend>
                                  <div className="input">
                                    <input
                                      type="email"
                                      className="input__item"
                                      placeholder="Email@example.com"
                                      value={formData.email}
                                      onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                    {errors.email && <span className="text text--grey" style={{ fontSize: '0.75rem', color: '#ff4444' }}>{errors.email}</span>}
                                  </div>
                                </fieldset>

                                <div className="form__grid">
                                  <fieldset className="fieldset">
                                    <legend className="fieldset__legend">First Name</legend>
                                    <div className="input">
                                      <input
                                        type="text"
                                        className="input__item"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                      />
                                      {errors.firstName && <span className="text text--grey" style={{ fontSize: '0.75rem', color: '#ff4444' }}>{errors.firstName}</span>}
                                    </div>
                                  </fieldset>
                                  <fieldset className="fieldset">
                                    <legend className="fieldset__legend">Last Name</legend>
                                    <div className="input">
                                      <input
                                        type="text"
                                        className="input__item"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                      />
                                      {errors.lastName && <span className="text text--grey" style={{ fontSize: '0.75rem', color: '#ff4444' }}>{errors.lastName}</span>}
                                    </div>
                                  </fieldset>
                                </div>

                                <fieldset className="fieldset">
                                  <legend className="fieldset__legend">Phone number</legend>
                                  <div className="input">
                                    <input
                                      type="tel"
                                      className="input__item"
                                      placeholder="(512) 123-4567"
                                      value={formData.phone}
                                      onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                    {errors.phone && <span className="text text--grey" style={{ fontSize: '0.75rem', color: '#ff4444' }}>{errors.phone}</span>}
                                  </div>
                                </fieldset>

                                <fieldset className="fieldset">
                                  <legend className="fieldset__legend">Your message</legend>
                                  <div className="input input--textarea">
                                    <textarea
                                      className="input__item"
                                      placeholder="Message"
                                      value={formData.message}
                                      onChange={(e) => handleInputChange('message', e.target.value)}
                                      rows={4}
                                    />
                                    {errors.message && <span className="text text--grey" style={{ fontSize: '0.75rem', color: '#ff4444' }}>{errors.message}</span>}
                                  </div>
                                </fieldset>

                                <button type="submit" className="button button--center button--text">
                                  <span className="button__text">Send</span>
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
    </section>
  );
});

Feedback.displayName = 'Feedback';

