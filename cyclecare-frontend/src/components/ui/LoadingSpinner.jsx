import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-10 h-10' }[size];
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <Loader2 className={`${sizes} text-primary-500 animate-spin`} />
      {text && <p className="text-muted text-sm">{text}</p>}
    </div>
  );
};

export const PageLoader = ({ text = 'Loading...' }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <div className="relative">
      <div className="w-14 h-14 rounded-full border-4 border-primary-100 dark:border-primary-900/30" />
      <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
    </div>
    <p className="text-muted font-medium">{text}</p>
  </div>
);

export default LoadingSpinner;
