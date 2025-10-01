import React from 'react';
import { Feedback } from '@/components/features/feedback';

export const ContactPage: React.FC = React.memo(() => {
  return (
    <main className="content" style={{ marginTop: '100px' }}>
      <div className="content__wrapper">
        <Feedback 
          title="Contact us"
          showContactInfo={true}
          showCustomerService={true}
        />
      </div>
    </main>
  );
});

ContactPage.displayName = 'ContactPage';