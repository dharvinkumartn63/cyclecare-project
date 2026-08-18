import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }[size];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onClose?.(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`card w-full ${sizes} animate-slide-up`}>
        <div className="flex items-center justify-between mb-5">
          <h2 id="modal-title" className="section-title">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{children}</div>
        {footer && <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800 pt-4">{footer}</div>}
      </div>
    </div>
  );
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading = false }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title || 'Confirm Action'}
    footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </>
    }
  >
    <p>{message}</p>
  </Modal>
);

export default Modal;
