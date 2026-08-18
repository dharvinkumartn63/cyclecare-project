import { AlertCircle, InboxIcon } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({ icon: Icon = InboxIcon, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
    <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-primary-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{title}</h3>
    {description && <p className="text-muted text-sm max-w-xs mb-6">{description}</p>}
    {actionLabel && onAction && (
      <Button onClick={onAction} size="sm">{actionLabel}</Button>
    )}
  </div>
);

export const ErrorMessage = ({ message }) => (
  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-fade-in">
    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
    <p className="text-sm text-red-700 dark:text-red-400">{message}</p>
  </div>
);

export const Disclaimer = ({ className = '' }) => (
  <p className={`text-xs text-gray-400 dark:text-gray-500 italic ${className}`}>
    ⚕️ This prediction is an estimate based on the cycle information you provide and may not always be accurate. It is not a medical diagnosis.
  </p>
);

export default EmptyState;
