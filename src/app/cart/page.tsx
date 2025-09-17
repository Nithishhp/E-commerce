'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

// Default placeholder image for products without images
const DEFAULT_IMAGE = '/images/placeholder-product.jpg';

export default function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, isLoading, isAuthenticated } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login?redirect=/cart';
    }
  }, [isLoading, isAuthenticated]);

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      setUpdatingItem(id);
      try {
        await updateQuantity(id, newQuantity);
      } catch (error) {
        console.error('Error updating quantity:', error);
      } finally {
        setUpdatingItem(null);
      }
    }
  };

  const handleRemove = async (id: string, name: string) => {
    setUpdatingItem(id);
    try {
      const success = await removeFromCart(id);
      if (success) {
        toast.success(`${name} removed from cart`);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      // Redirect to checkout page
      window.location.href = '/checkout';
    }, 1000);
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                <div className="h-24 w-24 bg-gray-200 rounded-md"></div>
                <div className="ml-6 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <FiShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-2 text-gray-600 mb-6">Looks like you haven't added any plants to your cart yet.</p>
            <Link href="/shop">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <motion.li 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 flex flex-col sm:flex-row items-start sm:items-center"
                  >
                    <div className="flex-shrink-0 relative h-24 w-24 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={item.image || DEFAULT_IMAGE}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">Unit Price: {formatPrice(item.price)}</p>
                      
                      <div className="mt-4 flex items-center">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={updatingItem === item.id}
                          className="p-1 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
                        >
                          <FiMinus className="h-5 w-5" />
                        </button>
                        
                        <span className="mx-3 text-gray-700 w-8 text-center">
                          {updatingItem === item.id ? '...' : item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={updatingItem === item.id}
                          className="p-1 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
                        >
                          <FiPlus className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 flex flex-col items-end">
                      <p className="text-lg font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      
                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        disabled={updatingItem === item.id}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center"
                      >
                        <FiTrash2 className="h-4 w-4 mr-1" />
                        {updatingItem === item.id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="text-gray-900 font-medium">{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900 font-medium">₹50.00</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900 font-medium">{formatPrice(totalPrice * 0.05)}</span>
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(totalPrice + 50 + (totalPrice * 0.05))}
                </span>
              </div>
              
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isCheckingOut || items.length === 0}
                  onClick={handleCheckout}
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
