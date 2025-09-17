'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

const benefits: Benefit[] = [
  {
    title: "Fresh & Organic",
    description: "Grow your own pesticide-free vegetables and enjoy the freshest produce right from your garden.",
    icon: "🌱"
  },
  {
    title: "Cost Effective",
    description: "Save money on groceries by growing your own vegetables at home.",
    icon: "💰"
  },
  {
    title: "Therapeutic",
    description: "Gardening is a great stress reliever and provides a sense of accomplishment.",
    icon: "🧘"
  }
];

const brandTags = [
  "100% Organic",
  "Home Grown",
  "Sustainable Living",
  "Eco Friendly",
  "Fresh Produce",
  "Healthy Lifestyle"
];

export default function Benefits() {
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation to prevent memory leaks with infinite animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prevKey => prevKey + 1);
    }, 20000); // Reset every 20 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Animated Branding Marquee */}
        <motion.div 
          key={animationKey}
          initial={{ x: '100%' }}
          animate={{ x: '-100%' }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
          className="flex whitespace-nowrap py-4 mb-12 text-2xl font-bold text-green-600/20"
        >
          {[...brandTags, ...brandTags].map((tag, i) => (
            <span key={i} className="mx-8 flex items-center">
              {tag}
              <span className="mx-2 text-xl">•</span>
            </span>
          ))}
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700">
              Benefits of Home Gardening
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how growing your own vegetables can transform your lifestyle and wellbeing
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              
              <div className="h-full text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="text-5xl mb-6 inline-block"
                >
                  {benefit.icon}
                </motion.div>
                
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {benefit.description}
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-6 py-2 bg-green-600 text-white rounded-full text-sm font-medium cursor-pointer"
                >
                  Learn more
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="hidden lg:block">
          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/4 top-1/3 w-8 h-8 bg-green-300 rounded-full opacity-20 blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute right-1/4 bottom-1/4 w-12 h-12 bg-emerald-300 rounded-full opacity-15 blur-xl"
          />
        </div>
      </div>
    </section>
  );
}