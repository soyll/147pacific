import React from 'react';

export const NotFound: React.FC = React.memo(() => {
  return (
    <div className="content">
      <div className="content__wrapper">
        <div className="section">
          <div className="section__wrapper">
            <div className="container">
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h1 className="title title--base">Page not found</h1>
                <p className="text text--base">The page you're looking for doesn't exist.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

NotFound.displayName = 'NotFound';

