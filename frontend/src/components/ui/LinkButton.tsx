import { Link, LinkProps } from 'react-router-dom';
import { ButtonVariant, buttonClassName } from './Button';

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
}

export function LinkButton({ variant = 'primary', className = '', ...props }: LinkButtonProps) {
  return <Link className={buttonClassName(variant, className)} {...props} />;
}
