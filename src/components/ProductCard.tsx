'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

// Default placeholder image
const DEFAULT_IMAGE = '/images/placeholder-product.jpg';

type ProductCardProps = {
  id: string;
  name: string;
  image?: string;
  price: number;
  rating: number;
};

export default function ProductCard({ id, name, image, price, rating }: ProductCardProps) {
  const { addToCart, isAuthenticated } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated, with return URL
      router.push(`/login?redirect=${encodeURIComponent('/shop')}`);
      return;
    }

    setIsAdding(true);
    addToCart({ id, name, image, price });
    
    // Reset button state after animation
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image || DEFAULT_IMAGE}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-green-600 font-bold">${price.toFixed(2)}</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">
                {i < rating ? '★' : '☆'}
              </span>
            ))}
          </div>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className={`w-full py-2 rounded-md text-white font-medium transition-colors ${
            isAdding 
              ? 'bg-green-700' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isAdding ? 'Added! ✓' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  );
}


