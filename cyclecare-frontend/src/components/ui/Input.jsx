import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  required = false,
  hint,
  icon: Icon,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-primary-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" style={{ left: '14px' }} />
        )}
        <input
          ref={ref}
          type={inputType}
          className={`input-field ${isPassword ? 'pr-10' : ''} ${
            error ? 'border-red-400 focus:ring-red-400 dark:border-red-500' : ''
          } ${className}`}
          style={Icon ? { paddingLeft: '2.75rem' } : {}}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
