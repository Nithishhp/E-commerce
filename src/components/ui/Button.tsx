import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  whileHover?: import('framer-motion').TargetAndTransition | import('framer-motion').VariantLabels;
  whileTap?: import('framer-motion').TargetAndTransition | import('framer-motion').VariantLabels;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  whileHover,
  whileTap,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-full font-semibold transition-colors';
  
  const variantStyles = {
    primary: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-white text-green-800 hover:bg-green-100',
    outline: 'border border-green-600 text-green-600 hover:bg-green-50'
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      whileHover={whileHover}
      whileTap={whileTap}
      {...props}
    >
      {children}
    </motion.button>
  );
}