'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, SEASONS } from '@/constants/data';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiSearch, FiCheck } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Define the Plant type to match API response
interface Plant {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
  categoryId?: number; // Add categoryId field
  season: string[];
  availability: boolean;
  rating: number;
  reviews: number;
  createdAt?: string;
}

// Define Category type from API
interface Category {
  id: number;
  name: string;
}

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]); // Change to number[] for API category IDs
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  
  const { addToCart, isAuthenticated } = useCart();
  const router = useRouter();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch plants from API
  useEffect(() => {
    const fetchPlants = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        
        // Handle multiple categories by using comma-separated list of category IDs
        if (selectedCategories.length > 0) {
          params.append('categoryIds', selectedCategories.join(','));
        }
        
        if (priceRange[0] > 0) {
          params.append('minPrice', priceRange[0].toString());
        }
        
        if (priceRange[1] < 200) {
          params.append('maxPrice', priceRange[1].toString());
        }
        
        // Handle multiple seasons
        if (selectedSeasons.length > 0) {
          params.append('seasons', selectedSeasons.join(','));
        }
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const response = await fetch(`/api/products${queryString}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch plants');
        }
        
        const data = await response.json();
        setPlants(data);
      } catch (err) {
        console.error('Error fetching plants:', err);
        setError('Failed to load plants. Please try again later.');
      } finally {
        // Add a small delay to show loading state for better UX
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    
    fetchPlants();
  }, [searchQuery, selectedCategories, selectedSeasons, priceRange]);

  // Handle adding product to cart
  const handleAddToCart = async (plant: Plant) => {
    if (!plant.availability) {
      return; // Don't add out-of-stock items
    }
    
    if (!isAuthenticated) {
      // Redirect to login with return URL
      router.push(`/login?redirect=${encodeURIComponent('/shop')}`);
      return;
    }
    
    // Set loading state for this specific product
    setAddingToCart(plant.id);
    
    try {
      // Add to cart using the updated context function
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

  useEffect(() => {
    // Calculate applied filters count
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategories.length > 0) count++;
    if (selectedSeasons.length > 0) count++;
    if (priceRange[0] !== 0 || priceRange[1] !== 200) count++;
    setAppliedFiltersCount(count);
  }, [searchQuery, selectedCategories, selectedSeasons, priceRange]);

  // Client-side filtering for multi-category and multi-season filtering
  const filteredPlants = plants.filter(plant => {
    // Category filter (OR within category)
    // If no categories are selected, show all plants
    // If categories are selected, show plants that match ANY of the selected categories
    const matchesCategory = selectedCategories.length === 0 || 
                          (plant.categoryId && selectedCategories.includes(plant.categoryId));
    
    // Season filter (OR within season)
    // If no seasons are selected, show all plants
    // If seasons are selected, show plants that match ANY of the selected seasons
    const matchesSeason = selectedSeasons.length === 0 || 
                         selectedSeasons.some(season => plant.season.includes(season));
    
    return matchesCategory && matchesSeason;
  });

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSeason = (seasonId: string) => {
    setSelectedSeasons(prev =>
      prev.includes(seasonId)
        ? prev.filter(id => id !== seasonId)
        : [...prev, seasonId]
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setPriceRange([priceRange[0], newValue]);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedSeasons([]);
    setPriceRange([0, 200]);
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Price range options like Amazon/Flipkart
  const priceRanges = [
    { label: "Under ₹100", value: [0, 100] },
    { label: "₹100 - ₹200", value: [100, 200] },
    { label: "₹200 - ₹500", value: [200, 500] },
    { label: "₹500 & Above", value: [500, 1000] }
  ];

  return (
    <div className="pt-24 min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 text-gray-700">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700">
              Our Plant Collection
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover premium quality saplings for your home garden
          </p>
        </div>

        {/* Filters Bar - Sticky at top on scroll */}
        <div className="sticky top-24 z-10 bg-white py-4 border-b border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search plants..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Button with Counter - Only visible on mobile */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex md:hidden items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            >
              <FiFilter className="h-5 w-5" />
              <span>Filters</span>
              {appliedFiltersCount > 0 && (
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-600 text-white text-xs">
                  {appliedFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters Sidebar - Like Amazon */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-40">
              {/* Filter header with clear button */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Filters</h3>
                {appliedFiltersCount > 0 && (
                  <button 
                    onClick={resetFilters}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Categories Section */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <ul className="space-y-2">
                  {categories.map(category => (
                    <li key={category.id}>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-3 text-gray-600">
                          {category.name}
                        </span>
                        {selectedCategories.includes(category.id) && (
                          <FiCheck className="ml-auto h-4 w-4 text-green-600" />
                        )}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range Section */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  {priceRanges.map((range, index) => (
                    <div key={index}>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="price-range"
                          checked={priceRange[0] === range.value[0] && priceRange[1] === range.value[1]}
                          onChange={() => setPriceRange(range.value as [number, number])}
                          className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-3 text-gray-600">
                          {range.label}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seasons Section */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Growing Season</h4>
                <ul className="space-y-2">
                  {SEASONS.map(season => (
                    <li key={season.id}>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSeasons.includes(season.id)}
                          onChange={() => toggleSeason(season.id)}
                          className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-3 text-gray-600">
                          {season.name}
                        </span>
                        {selectedSeasons.includes(season.id) && (
                          <FiCheck className="ml-auto h-4 w-4 text-green-600" />
                        )}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Applied Filters Bar */}
            {(selectedCategories.length > 0 || selectedSeasons.length > 0 || priceRange[0] !== 0 || priceRange[1] !== 200) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedCategories.map(categoryId => {
                  const category = categories.find(c => c.id === categoryId);
                  return category ? (
                    <span key={categoryId} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {category.name}
                      <button 
                        onClick={() => toggleCategory(categoryId)}
                        className="ml-1.5 inline-flex items-center justify-center rounded-full h-4 w-4 text-green-600 hover:bg-green-200"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
                {selectedSeasons.map(seasonId => {
                  const season = SEASONS.find(s => s.id === seasonId);
                  return season ? (
                    <span key={seasonId} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {season.name}
                      <button 
                        onClick={() => toggleSeason(seasonId)}
                        className="ml-1.5 inline-flex items-center justify-center rounded-full h-4 w-4 text-blue-600 hover:bg-blue-200"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
                {(priceRange[0] !== 0 || priceRange[1] !== 200) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    <button 
                      onClick={() => setPriceRange([0, 200])}
                      className="ml-1.5 inline-flex items-center justify-center rounded-full h-4 w-4 text-yellow-600 hover:bg-yellow-200"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm font-medium text-red-700 hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Plant Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
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
            ) : (
              <AnimatePresence>
                {filteredPlants.length > 0 ? (
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {filteredPlants.map((plant, index) => (
                      <motion.div
                        key={plant.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        viewport={{ once: true, margin: "-50px" }}
                        layout
                      >
                        <Card
                          title={plant.name}
                          image={plant.image}
                          price={formatPrice(plant.price)}
                          description={plant.description}
                          className="hover:shadow-lg transition-shadow duration-300"
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
                              <span className="ml-1 text-gray-600">({plant.reviews})</span>
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
                            whileHover={{ scale: plant.availability ? 1.02 : 1 }}
                            whileTap={{ scale: plant.availability ? 0.98 : 1 }}
                            onClick={() => handleAddToCart(plant)}
                          >
                            {addingToCart === plant.id ? 'Adding...' : 
                              plant.availability ? 'Add to Cart' : 'Notify Me'}
                          </Button>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    className="col-span-full text-center py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No plants found</h3>
                    <p className="mt-2 text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay - Like Flipkart */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 shadow-xl overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Categories Section */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                    <ul className="space-y-3">
                      {categories.map(category => (
                        <li key={category.id}>
                          <label className="flex items-center cursor-pointer py-2">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category.id)}
                              onChange={() => toggleCategory(category.id)}
                              className="h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                            />
                            <span className="ml-3 text-gray-600">
                              {category.name}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price Range Section */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                    <div className="space-y-3">
                      {priceRanges.map((range, index) => (
                        <div key={index}>
                          <label className="flex items-center cursor-pointer py-2">
                            <input
                              type="radio"
                              name="price-range"
                              checked={priceRange[0] === range.value[0] && priceRange[1] === range.value[1]}
                              onChange={() => setPriceRange(range.value as [number, number])}
                              className="h-5 w-5 text-green-600 border-gray-300 focus:ring-green-500"
                            />
                            <span className="ml-3 text-gray-600">
                              {range.label}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seasons Section */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Growing Season</h4>
                    <ul className="space-y-3">
                      {SEASONS.map(season => (
                        <li key={season.id}>
                          <label className="flex items-center cursor-pointer py-2">
                            <input
                              type="checkbox"
                              checked={selectedSeasons.includes(season.id)}
                              onChange={() => toggleSeason(season.id)}
                              className="h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                            />
                            <span className="ml-3 text-gray-600">
                              {season.name}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Apply Button - Sticky at bottom */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Reset
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setMobileFiltersOpen(false)}
                      className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
