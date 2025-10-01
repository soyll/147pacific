import React from 'react';
import { Feedback } from '@/components/features/feedback';

export const CustomerServicePage: React.FC = React.memo(() => {
  return (
    <main className="content" style={{ marginTop: '100px' }}>
      <div className="content__wrapper">
        <Feedback 
          title="Customer service"
          showContactInfo={true}
          showCustomerService={true}
        />
      </div>
    </main>
  );
});

CustomerServicePage.displayName = 'CustomerServicePage';
