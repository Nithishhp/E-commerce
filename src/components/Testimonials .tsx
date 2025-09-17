'use client';

import { motion } from 'framer-motion';
import Image, { StaticImageData } from "next/image";
import profile1 from "../Images/profile 1.jpg";
import profile2 from "../Images/profile 2.jpg";

interface Testimonial {
  id: string;
  name: string;
  avatar: string | StaticImageData;
  location: string;
  rating: number;
  comment: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    avatar: profile2,
    location: 'Bangalore',
    rating: 5,
    comment: 'My tomato plants from GreenSprout yielded twice as much as last year! The saplings were healthy and the growing guide was incredibly helpful.',
    date: '2 weeks ago'
  },
  {
    id: '2',
    name: 'Rahul Patel',
    avatar: profile1,
    location: 'Mumbai',
    rating: 4,
    comment: 'Excellent quality spinach saplings. They adapted well to my balcony garden and we\'ve been harvesting fresh leaves every week!',
    date: '1 month ago'
  },
  {
    id: '3',
    name: 'Sneha Gupta',
    avatar: profile2,
    location: 'Delhi',
    rating: 5,
    comment: 'The basil plants have such a wonderful aroma. Customer service helped me choose the right fertilizer. Highly recommended!',
    date: '3 weeks ago'
  },
  {
    id: '4',
    name: 'Vikram Singh',
    avatar: profile1,
    location: 'Hyderabad',
    rating: 5,
    comment: 'First-time gardener here. The step-by-step instructions made it so easy. My bell peppers are thriving!',
    date: '2 months ago'
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700">
              Happy Gardeners
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            What our community says about their growing experience
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group"
            >
              <div className="h-full bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Comment */}
                <blockquote className="flex-grow mb-6">
                  <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                </blockquote>

                {/* Author */}
                <div className="flex items-center mt-auto">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-green-100">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.location} • {testimonial.date}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors">
            Read More Success Stories
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}