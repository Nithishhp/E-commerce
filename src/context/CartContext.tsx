'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | undefined;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isAuthenticated: boolean;
  isLoading: boolean;
  userData: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  } | null;
  refreshAuthState: () => Promise<void>;
  addToCart: (product: Omit<CartItem, 'quantity'>) => Promise<boolean>;
  removeFromCart: (id: string) => Promise<boolean>;
  updateQuantity: (id: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<CartContextType['userData']>(null);
  const router = useRouter();

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Fetch cart data from API
  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        // Format items to ensure price is a number, not a string
        const formattedItems = data.items?.map((item: any) => ({
          ...item,
          price: typeof item.price === 'string' 
            ? parseFloat(item.price.replace(/[^\d.]/g, '')) 
            : item.price
        })) || [];
        setItems(formattedItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status
  const refreshAuthState = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/check');
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        // Store user data from the response
        if (data.user) {
          setUserData({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role
          });
        }
        fetchCart();
      } else {
        setIsAuthenticated(false);
        setUserData(null);
        // For non-authenticated users, try to load from localStorage
        const savedCart = localStorage.getItem('guest-cart');
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUserData(null);
      setIsLoading(false);
    }
  }, []);

  // Initial auth check
  useEffect(() => {
    refreshAuthState();
  }, [refreshAuthState]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      localStorage.setItem('guest-cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated, isLoading]);

  // Add item to cart
  const addToCart = async (product: Omit<CartItem, 'quantity'>): Promise<boolean> => {
    if (isAuthenticated) {
      try {
        const response = await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ saplingId: parseInt(product.id) }),
        });
        
        if (response.ok) {
          await fetchCart(); // Refresh cart from server
          return true;
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to add item to cart');
          return false;
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Network error. Please try again.');
        return false;
      }
    } else {
      // For guest users, handle cart locally
      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        
        if (existingItem) {
          return prevItems.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          );
        } else {
          return [...prevItems, { ...product, quantity: 1 }];
        }
      });
      return true;
    }
  };

  // Remove item from cart
  const removeFromCart = async (id: string): Promise<boolean> => {
    if (isAuthenticated) {
      try {
        const response = await fetch('/api/cart/remove', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ saplingId: parseInt(id) }),
        });
        
        if (response.ok) {
          await fetchCart(); // Refresh cart from server
          toast.success('Item removed from cart');
          return true;
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to remove item');
          return false;
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
        toast.error('Network error. Please try again.');
        return false;
      }
    } else {
      // For guest users, handle cart locally
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      return true;
    }
  };

  // Update item quantity
  const updateQuantity = async (id: string, quantity: number): Promise<boolean> => {
    if (quantity < 1) {
      return removeFromCart(id);
    }
    
    if (isAuthenticated) {
      try {
        const response = await fetch('/api/cart/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            saplingId: parseInt(id), 
            quantity 
          }),
        });
        
        if (response.ok) {
          await fetchCart(); // Refresh cart from server
          return true;
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to update quantity');
          return false;
        }
      } catch (error) {
        console.error('Error updating cart:', error);
        toast.error('Network error. Please try again.');
        return false;
      }
    } else {
      // For guest users, handle cart locally
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
      return true;
    }
  };

  // Clear cart
  const clearCart = async (): Promise<boolean> => {
    if (isAuthenticated) {
      try {
        const response = await fetch('/api/cart/clear', {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await fetchCart(); // Refresh cart from server
          toast.success('Cart cleared');
          return true;
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to clear cart');
          return false;
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error('Network error. Please try again.');
        return false;
      }
    } else {
      // For guest users, handle cart locally
      setItems([]);
      return true;
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      totalPrice,
      isAuthenticated,
      isLoading,
      userData,
      refreshAuthState,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 
