// components/auth/form-helpers.tsx
'use client';

import { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export function Field({ label, error, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

type IconInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ElementType;
};

export const IconInput = forwardRef<HTMLInputElement, IconInputProps>(
  ({ icon: Icon, className, ...props }, ref) => (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        ref={ref}
        className={`w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition text-sm ${className ?? ''}`}
        {...props}
      />
    </div>
  ),
);
IconInput.displayName = 'IconInput';

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  show: boolean;
  onToggle: () => void;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ show, onToggle, ...props }, ref) => (
    <div className="relative">
      <input
        ref={ref}
        type={show ? 'text' : 'password'}
        className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition text-sm"
        {...props}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  ),
);
PasswordInput.displayName = 'PasswordInput';

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
      <p className="text-red-600 text-sm">{message}</p>
    </div>
  );
}
