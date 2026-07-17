import { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-indigo-300',
  secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 disabled:text-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-500 disabled:bg-red-300',
  ghost: 'text-gray-600 hover:bg-gray-100 disabled:text-gray-300',
};

export const buttonBaseClasses =
  'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed';

export function buttonClassName(variant: ButtonVariant = 'primary', className = '') {
  return `${buttonBaseClasses} ${buttonVariantClasses[variant]} ${className}`;
}

export function Button({ variant = 'primary', className = '', disabled, ...props }: ButtonProps) {
  return <button disabled={disabled} className={buttonClassName(variant, className)} {...props} />;
}
