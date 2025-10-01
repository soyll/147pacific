import React, { useEffect, useState } from 'react';

interface AnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

export const Announcer: React.FC<AnnouncerProps> = React.memo(({ 
  message, 
  priority = 'polite' 
}) => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (message) {
      setAnnouncement(message);
      // Clear the announcement after a short delay
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      className="announcer"
      aria-live={priority}
      aria-atomic="true"
      role="status"
    >
      {announcement}
    </div>
  );
});

Announcer.displayName = 'Announcer';

