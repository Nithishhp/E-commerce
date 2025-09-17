'use client';

import { motion } from 'framer-motion';
import { BENEFITS } from '@/constants/data';
import Image from 'next/image';
import our_mission from "@/Images/our_mission.avif";

export default function About() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700">
              About GreenGarden
            </span>
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-xl text-gray-600 mb-8">
              Cultivating green spaces and nurturing communities through sustainable gardening
            </p>
          </motion.div>
        </motion.div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <div className="space-y-6 text-gray-600">
              <p className="text-lg">
                At GreenGarden, we're on a mission to transform urban spaces into thriving green havens.
              </p>
              <p className="text-lg">
                We believe every balcony, terrace, and backyard holds the potential to grow fresh, organic produce.
              </p>
              <p className="text-lg">
                Our team of horticulturists carefully selects and nurtures each sapling to ensure your gardening success.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg"
          >
            <Image
              src= {our_mission}
              alt="Our mission"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 mb-12"
          >
            Why Choose GreenGarden?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="h-full bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="text-5xl mb-6 text-green-600"
                  >
                    {benefit.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Green Thumbs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Head Horticulturist",
                image: "/team-priya.jpg",
                bio: "10+ years experience in organic farming"
              },
              {
                name: "Rahul Patel",
                role: "Plant Specialist",
                image: "/team-rahul.jpg",
                bio: "Expert in urban gardening solutions"
              },
              {
                name: "Ananya Gupta",
                role: "Customer Care",
                image: "/team-ananya.jpg",
                bio: "Your gardening questions answered"
              },
              {
                name: "Vikram Singh",
                role: "Logistics Head",
                image: "/team-vikram.jpg",
                bio: "Ensures your plants arrive safely"
              }
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="relative h-64">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-green-600 font-medium mb-2">{member.role}</p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Gardening Journey?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy gardeners growing with GreenGarden
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-green-700 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Shop Our Collection
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}