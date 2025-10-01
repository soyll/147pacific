import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = React.memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageSwitcherOpen, setIsLanguageSwitcherOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => {
      const newState = !prev;
      if (newState) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
      return newState;
    });
  };

  const toggleLanguageSwitcher = () => {
    setIsLanguageSwitcherOpen((prev) => !prev);
  };

  return (
    <>
      <header className="header">
        <div className="header__wrapper">
          <div className="nav">
            <div className="nav__row">
              <div className="nav-main nav-main--header">
                <div className="nav-main__wrapper nav-main__wrapper--header">
                  <a
                    href="#"
                    className={`burger ${isMobileMenuOpen ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMobileMenu();
                    }}
                    aria-label="Toggle mobile menu"
                    aria-expanded={isMobileMenuOpen}
                  >
                    <span className="burger__wrapper"></span>
                  </a>
                  
                  <Link to="/" className="nav__logo nav__logo--header logo">
                    <img
                      src="/assets/images/logo.webp"
                      alt="147 PACIFIC TRUCK ACCESSORIES"
                      className="logo__img"
                    />
                  </Link>

                  <ul className="nav-list nav-list--desktop">
                    <li className="nav-list__item">
                      <Link 
                        to="/products" 
                        className={`nav-list__link ${location.pathname === '/products' ? 'active' : ''}`}
                      >
                        Products
                      </Link>
                    </li>
                    <li className="nav-list__item">
                      <Link 
                        to="/shopping" 
                        className={`nav-list__link ${location.pathname === '/shopping' ? 'active' : ''}`}
                      >
                        Shopping
                      </Link>
                    </li>
                  </ul>

                  <Link to="/cart" className="nav-button nav-button--header nav-button--clear">
                    <svg className="nav-button__icon">
                      <use xlinkHref="/assets/images/sprite.svg#shop"></use>
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="nav-buttons nav-buttons--header">
                <div 
                  className={`nav-button nav-buttons__item language-switcher ${isLanguageSwitcherOpen ? 'language-switcher--active' : ''}`}
                  onClick={toggleLanguageSwitcher}
                >
                  <svg className="nav-button__icon">
                    <use xlinkHref="/assets/images/sprite.svg#language"></use>
                  </svg>
                  <div className="language-switcher__list">
                    <a href="#" className="nav-button language-switcher__item current">
                      <p className="text text--middle">En</p>
                    </a>
                    <a href="#" className="nav-button language-switcher__item">
                      <p className="text text--middle">Sp</p>
                    </a>
                  </div>
                </div>
                
                <Link to="/login" className={`nav-button nav-buttons__item ${location.pathname === '/login' ? 'active' : ''}`}>
                  <svg className="nav-button__icon">
                    <use xlinkHref="/assets/images/sprite.svg#profile"></use>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <footer className="menu">
          <div className="container">
            <div className="menu__wrapper menu__wrapper--footer">
              <div className="menu-content menu-content--mobile">
                <div className="menu-content__wrapper">
                  <div className="menu-content__grid">
                    <div className="menu-content__block">
                      <p className="title title--base title--opacity--big">Bed Rack</p>
                      <p className="text text--base text--opacity--big">
                        Pick-up truck bed racks built with 2.375" round stainless steel tubing with stainless sheet connections
                      </p>
                    </div>
                    <div className="menu-content__block">
                      <p className="title title--base title--opacity--big">Bull Bar</p>
                      <p className="text text--base text--opacity--big">
                        Protective front bar made from 2.375" round stainless steel tubing with stainless sheet reinforcements
                      </p>
                    </div>
                    <div className="menu-content__block">
                      <p className="title title--base title--opacity--big">Running Board</p>
                      <p className="text text--base text--opacity--big">
                        Designed to provide easy access to your vehicle while enhancing its rugged appearance
                      </p>
                    </div>
                    <div className="menu-content__block">
                      <p className="title title--base title--opacity--big">HD Grille Guard</p>
                      <p className="text text--base text--opacity--big">
                        Heavy-duty front-end protection for semi-trucks, built from high-strength stainless steel 2.375" or 2.875" tubing
                      </p>
                    </div>
                    <div className="menu-content__block">
                      <p className="title title--base title--opacity--big">Bed Rack</p>
                      <p className="text text--base text--opacity--big">
                        Pick-up truck bed racks built with 2.375" round stainless steel tubing with stainless sheet connections
                      </p>
                    </div>
                    <div className="menu-content__block">
                      <p className="title title--base title--opacity--big">Bull Bar</p>
                      <p className="text text--base text--opacity--big">
                        Protective front bar made from 2.375" round stainless steel tubing with stainless sheet reinforcements
                      </p>
                    </div>
                  </div>
                  <div className="menu-content__list">
                    <ul className="nav-list nav-list--column">
                      <li className="nav-list__item">
                        <Link to="/company" className="nav-list__link" onClick={toggleMobileMenu}>
                          Company
                        </Link>
                      </li>
                      <li className="nav-list__item">
                        <Link to="/made-in-usa" className="nav-list__link" onClick={toggleMobileMenu}>
                          Made in the USA
                        </Link>
                      </li>
                      <li className="nav-list__item">
                        <Link to="/contact" className="nav-list__link" onClick={toggleMobileMenu}>
                          Contact
                        </Link>
                      </li>
                      <li className="nav-list__item">
                        <Link to="/customer-service" className="nav-list__link" onClick={toggleMobileMenu}>
                          Customer Service
                        </Link>
                      </li>
                      <li className="nav-list__item">
                        <Link to="/disclaimer" className="nav-list__link" onClick={toggleMobileMenu}>
                          Disclaimer
                        </Link>
                      </li>
                      <li className="nav-list__item">
                        <Link to="/privacy" className="nav-list__link" onClick={toggleMobileMenu}>
                          Privacy & Cookie
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="menu-footer">
                <div className="menu-footer__row">
                  <div className="menu-footer__logos">
                    <img src="/assets/images/logo.webp" alt="" className="menu-footer__img" />
                    <img src="/assets/images/logo-second.webp" alt="" className="menu-footer__img" />
                  </div>
                  <div className="social">
                    <ul className="social-list">
                      <li className="social-list__item">
                        <a href="#" className="social-link">
                          <svg className="social-link__icon">
                            <use xlinkHref="/assets/images/sprite.svg#insta"></use>
                          </svg>
                        </a>
                      </li>
                      <li className="social-list__item">
                        <a href="#" className="social-link">
                          <svg className="social-link__icon">
                            <use xlinkHref="/assets/images/sprite.svg#yt"></use>
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
});

Header.displayName = 'Header';
