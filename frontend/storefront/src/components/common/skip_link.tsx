import React from 'react';
import { Link } from 'react-router-dom';

interface SkipLinkProps {
  to: string;
  children: React.ReactNode;
}

export const SkipLink: React.FC<SkipLinkProps> = React.memo(({ to, children }) => {
  return (
    <Link to={to} className="skip-link">
      {children}
    </Link>
  );
});

SkipLink.displayName = 'SkipLink';

