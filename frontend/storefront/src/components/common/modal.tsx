import React, { useEffect } from 'react';
import { ModalProps } from '@/types';
import { cn } from '@/utils';

export const Modal: React.FC<ModalProps> = React.memo(({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  className,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.classList.add('no-scroll');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalClasses = cn(
    'modal',
    isOpen && 'modal--active'
  );

  const containerClasses = cn(
    'modal__container',
    `modal__container--${size}`,
    className
  );

  return (
    <div
      className={modalClasses}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className="modal__wrapper">
        <div className={containerClasses}>
          {title && (
            <div className="modal__header">
              <h2 id="modal-title" className="modal__title">
                {title}
              </h2>
              <button
                className="modal__close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <span className="modal__closeIcon"></span>
              </button>
            </div>
          )}
          <div className="modal__content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

