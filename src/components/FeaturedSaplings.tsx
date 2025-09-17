'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import Card from './ui/Card';
import Button from './ui/Button';
import Link from "next/link";

// Define the Plant type to match API response
interface Plant {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
  season: string[];
  availability: boolean;
  rating: number;
  reviews?: number;
}

export default function FeaturedSaplings() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  
  const { addToCart, isAuthenticated } = useCart();
  const router = useRouter();
  
  // Number of featured products to display
  const featuredCount = 4;

  // Fetch featured plants from API
  useEffect(() => {
    const fetchFeaturedPlants = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Option 1: Add featured parameter to fetch only featured products
        // const response = await fetch('/api/products?featured=true');
        
        // Option 2: Fetch all products but limit display to first few
        // Adding a limit parameter to reduce data transfer
        const response = await fetch(`/api/products?limit=${featuredCount}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured plants');
        }
        
        const data = await response.json();
        setPlants(data.slice(0, featuredCount)); // Ensure we only take the first few
      } catch (err) {
        console.error('Error fetching featured plants:', err);
        setError('Failed to load featured plants');
      } finally {
        // Add a small delay to show loading state for better UX
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    
    fetchFeaturedPlants();
  }, []);

  // Handle adding product to cart
  const handleAddToCart = async (plant: Plant) => {
    if (!plant.availability) {
      toast.error(`${plant.name} is currently out of stock.`);
      return;
    }
    
    if (!isAuthenticated) {
      // Redirect to login with return URL
      router.push(`/login?redirect=${encodeURIComponent('/')}`);
      return;
    }
    
    // Set loading state for this specific product
    setAddingToCart(plant.id);
    
    try {
      // Add to cart using the context function
      const success = await addToCart({
        id: plant.id.toString(),
        name: plant.name,
        price: plant.price,
        image: plant.image
      });
      
      if (success) {
        // Show success feedback
        toast.success(`${plant.name} added to cart!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    } finally {
      // Reset loading state after a short delay
      setTimeout(() => {
        setAddingToCart(null);
      }, 1000);
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-12">Featured Saplings</h2>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 max-w-md mx-auto text-center">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(featuredCount)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : plants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {plants.map((plant) => (
              <Card
                key={plant.id}
                title={plant.name}
                image={plant.image}
                price={formatPrice(plant.price)}
                description={plant.description || "A beautiful plant for your garden."}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          {i < Math.floor(plant.rating) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span className="ml-1 text-gray-600">({plant.reviews || 0})</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plant.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {plant.availability ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <Button 
                  variant={plant.availability ? "primary" : "secondary"} 
                  size="md" 
                  className="w-full"
                  disabled={!plant.availability || addingToCart === plant.id}
                  onClick={() => handleAddToCart(plant)}
                >
                  {addingToCart === plant.id ? 'Adding...' : 
                    plant.availability ? 'Add to Cart' : 'Notify Me'}
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No featured plants found</h3>
            <p className="text-gray-600 mb-6">Check back soon for our featured collection</p>
          </div>
        )}
        
        {/* View All Products Button */}
        <div className="mt-12 text-center">
          <Link href="/shop">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
