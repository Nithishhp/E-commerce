'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Image, { StaticImageData } from "next/image";

import tomatoImg from "../Images/tomato.jpg";
import Brinjal from "../Images/Brinjal.jpg";
import Chili from "../Images/Chilli.jpg";
import basil from "../Images/tulsi-leaves.avif";
import Spinach from "../Images/Spinach.avif";
import mint from "../Images/mint.avif";
import strawberry from "../Images/strawberry.avif";

interface Sapling {
  id: string;
  name: string;
  image: string | StaticImageData;
  price: string;
  rating: number;
  category: string;
  isTopRated?: boolean;
  isSeasonal?: boolean;
}

const bestSellers: Sapling[] = [
  {
    id: '1',
    name: 'Cherry Tomato',
    image: tomatoImg,
    price: '₹129',
    rating: 4.8,
    category: 'Climbers',
    isTopRated: true
  },
  {
    id: '2',
    name: 'Organic Spinach',
    image: Spinach,
    price: '₹89',
    rating: 4.5,
    category: 'Leafy Greens',
    isSeasonal: true
  },
  {
    id: '3',
    name: 'Bell Pepper',
    image: Chili,
    price: '₹149',
    rating: 4.7,
    category: 'Vegetables'
  },
  {
    id: '4',
    name: 'Sweet Basil',
    image:basil,
    price: '₹79',
    rating: 4.6,
    category: 'Herbs',
    isSeasonal: true
  },
  {
    id: '5',
    name: 'Strawberry',
    image: strawberry,
    price: '₹199',
    rating: 4.9,
    category: 'Fruits',
    isTopRated: true
  },
  {
    id: '6',
    name: 'Mint',
    image: mint,
    price: '₹69',
    rating: 4.4,
    category: 'Herbs'
  },
];

export default function BestSellerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesToShow = 4;

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev + 1 > bestSellers.length - slidesToShow ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev - 1 < 0 ? bestSellers.length - slidesToShow : prev - 1
    );
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700">
              Our Best Sellers
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Most popular saplings chosen by our gardening community
          </p>
        </div>

        {/* Slider Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button 
              onClick={prevSlide}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="hidden md:flex space-x-1">
            {bestSellers.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-green-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden">
          <motion.div 
            className="flex transition-transform duration-300"
            animate={{ 
              x: `-${currentSlide * (100 / slidesToShow)}%`,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {bestSellers.map((sapling) => (
              <div 
                key={sapling.id}
                className="px-3 min-w-[25%] flex-shrink-0" // 4 items per view
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative h-64">
                    <Image
                      src={sapling.image}
                      alt={sapling.name}
                      fill
                      className="object-cover"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex space-x-2">
                      {sapling.isTopRated && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Top Rated
                        </span>
                      )}
                      {sapling.isSeasonal && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Seasonal
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">{sapling.name}</h3>
                      <span className="text-green-600 font-medium">{sapling.price}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{sapling.category}</p>
                    
                    <div className="flex items-center mt-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(sapling.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-500">{sapling.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}