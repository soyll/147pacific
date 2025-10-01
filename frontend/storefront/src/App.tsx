import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@/providers/ApolloProvider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Announcer } from '@/components/common/announcer';
import { NotFound } from '@/components/common/not_found';
import { ErrorBoundary } from '@/components/common/error_boundary';
import '@/styles/global/index.scss';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('@/pages/home_page').then(module => ({ default: module.HomePage })));
const ProductsPage = React.lazy(() => import('@/pages/products_page').then(module => ({ default: module.default })));
const ShoppingPage = React.lazy(() => import('@/pages/shopping_page').then(module => ({ default: module.ShoppingPage })));
const CompanyPage = React.lazy(() => import('@/pages/company_page').then(module => ({ default: module.CompanyPage })));
const ContactPage = React.lazy(() => import('@/pages/contact_page').then(module => ({ default: module.ContactPage })));
const LoginPage = React.lazy(() => import('@/pages/login_page').then(module => ({ default: module.LoginPage })));
const CartPage = React.lazy(() => import('@/pages/cart_page').then(module => ({ default: module.CartPage })));
const ProfilePage = React.lazy(() => import('@/pages/profile_page').then(module => ({ default: module.ProfilePage })));
const BuilderPage = React.lazy(() => import('@/pages/builder_page').then(module => ({ default: module.BuilderPage })));
const MadeInUSAPage = React.lazy(() => import('@/pages/made_in_usa_page').then(module => ({ default: module.MadeInUSAPage })));
const PrivacyPage = React.lazy(() => import('@/pages/privacy_page').then(module => ({ default: module.PrivacyPage })));
const DisclaimerPage = React.lazy(() => import('@/pages/disclaimer_page').then(module => ({ default: module.DisclaimerPage })));
const CustomerServicePage = React.lazy(() => import('@/pages/customer_service_page').then(module => ({ default: module.CustomerServicePage })));

// Loading component
const PageLoader: React.FC = () => (
  <div className="content">
    <div className="content__wrapper">
      <div className="section">
        <div className="section__wrapper">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p className="text text--base">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ApolloProvider>
        <Router>
          <div className="page-wrapper">
            <Announcer message="" />
            <Header />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:slug" element={<ProductsPage />} />
                <Route path="/builder" element={<BuilderPage />} />
                <Route path="/made-in-usa" element={<MadeInUSAPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />
                <Route path="/customer-services" element={<CustomerServicePage />} />
                <Route path="/shopping" element={<ShoppingPage />} />
                <Route path="/company" element={<CompanyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Footer />
          </div>
        </Router>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

export default App;