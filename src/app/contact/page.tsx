'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaLeaf } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className=" pt-24 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto">
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700">
              Contact Us
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're here to help your garden thrive
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <FaLeaf className="text-green-600 mr-3" />
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600">
                Have questions about our plants or need gardening advice? Our team is ready to assist you!
              </p>
            </div>

            <div className="space-y-6">
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-start"
              >
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FaMapMarkerAlt className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Our Nursery</h3>
                  <p className="text-gray-600">123 Garden Street, Green Valley, India</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-start"
              >
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FaEnvelope className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Email Us</h3>
                  <p className="text-gray-600">info@greengarden.com</p>
                  <p className="text-gray-600">support@greengarden.com</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-start"
              >
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FaPhoneAlt className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Call Us</h3>
                  <p className="text-gray-600">+91 1234567890</p>
                  <p className="text-gray-600">Mon-Fri: 9AM - 6PM</p>
                </div>
              </motion.div>
            </div>

            <div className="pt-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                {['Facebook', 'Instagram', 'Twitter', 'YouTube'].map((social) => (
                  <motion.button
                    key={social}
                    whileHover={{ y: -3 }}
                    className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Send Us a Message
              </h2>
              
              <form className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="space-y-1"
                >
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter your name"
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="space-y-1"
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="space-y-1"
                >
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="advice">Gardening Advice</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="space-y-1"
                >
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="How can we help you today?"
                  ></textarea>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    className="w-full text-lg"
                  >
                    Send Message
                    {/* <svg className="ml-2 -mr-1 w-5 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg> */}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}