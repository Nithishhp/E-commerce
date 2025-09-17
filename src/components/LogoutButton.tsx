'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

type LogoutButtonProps = {
  className?: string;
  onClick?: () => void;
  mobile?: boolean;
  icon?: React.ReactNode;
};

export default function LogoutButton({ className, onClick, mobile = false, icon }: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { refreshAuthState } = useCart();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      // Call the logout API
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      // Update auth state in context immediately
      await refreshAuthState();
      
      // Close mobile menu if provided
      if (onClick) {
        onClick();
      }
      
      // Navigate to home page
      router.push('/');
      router.refresh(); // Force a router refresh to update all components
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (mobile) {
    return (
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 font-medium transition-colors"
      >
        <motion.span
          whileHover={{ x: 5 }}
          className="flex items-center"
        >
          {icon}
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </motion.span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className={`bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors ${className}`}
      disabled={isLoggingOut}
    >
      <motion.span whileHover={{ scale: 1.05 }}>
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </motion.span>
    </button>
  );
}


