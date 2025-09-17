'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import LogoutButton from '@/components/LogoutButton';
import { FiUser, FiChevronDown, FiSettings, FiLogOut, FiShield } from 'react-icons/fi';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { totalItems, isAuthenticated, userData } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when changing routes
  useEffect(() => {
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Get user's first name for display
  const firstName = userData?.name?.split(' ')[0] || 'User';
  const isAdmin = userData?.role === 'admin';

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'} transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Animated Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mr-3 shadow-md"
              >
                <span className="text-xl animate-leaf-float">🌱</span>
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                GreenSprout
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="relative group px-2 py-1"
              >
                <motion.span
                  className={`block ${pathname === item.path ? 'text-green-600' : 'text-gray-700 hover:text-green-600'} transition-colors duration-200 font-medium`}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.name}
                </motion.span>
                {pathname === item.path && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute left-0 bottom-0 h-0.5 w-full bg-green-600"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth buttons and Cart */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/cart"
                  className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <motion.span 
                    className="text-xl block"
                    whileHover={{ scale: 1.1 }}
                  >
                    🛒
                  </motion.span>
                  {totalItems > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      whileTap={{ scale: 0.9 }}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </Link>
                
                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <span className="hidden md:block font-medium">{firstName}</span>
                    <motion.div
                      animate={{ rotate: profileDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="hidden md:block"
                    >
                      <FiChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {userData?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {userData?.email}
                          </p>
                        </div>
                        
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <FiUser className="mr-2 h-4 w-4" />
                            My Profile
                          </div>
                        </Link>
                        
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center">
                              <FiShield className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </div>
                          </Link>
                        )}
                        
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <LogoutButton 
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors flex items-center"
                            icon={<FiLogOut className="mr-2 h-4 w-4" />}
                            onClick={() => setProfileDropdownOpen(false)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:block text-gray-700 hover:text-green-600 transition-colors"
                >
                  <motion.span whileHover={{ scale: 1.05 }}>
                    Login
                  </motion.span>
                </Link>
                <Link
                  href="/signup"
                  className="hidden md:block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <motion.span whileHover={{ scale: 1.05 }}>
                    Signup
                  </motion.span>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-gray-700 hover:text-green-600 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                  className="text-2xl"
                >
                  ✕
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-2xl"
                >
                  ☰
                </motion.div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-sm overflow-hidden"
          >
            <div className="pt-2 pb-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 ${pathname === item.path ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-green-50'} font-medium transition-colors`}
                >
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="flex items-center"
                  >
                    {pathname === item.path && (
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    )}
                    {item.name}
                  </motion.span>
                </Link>
              ))}
              
              {/* Mobile Auth Links */}
              {isAuthenticated ? (
                <>
                  {/* User info in mobile menu */}
                  <div className="px-4 py-3 bg-green-50 mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mr-3">
                        <FiUser className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{userData?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 font-medium transition-colors"
                  >
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="flex items-center"
                    >
                      <FiUser className="mr-2 h-5 w-5" />
                      My Profile
                    </motion.span>
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-gray-700 hover:bg-green-50 font-medium transition-colors"
                    >
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="flex items-center"
                      >
                        <FiShield className="mr-2 h-5 w-5" />
                        Admin Dashboard
                      </motion.span>
                    </Link>
                  )}
                  
                  <LogoutButton 
                    mobile={true} 
                    onClick={() => setMobileMenuOpen(false)}
                    icon={<FiLogOut className="mr-2 h-5 w-5" />}
                  />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 font-medium transition-colors"
                  >
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="flex items-center"
                    >
                      Login
                    </motion.span>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 font-medium transition-colors"
                  >
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="flex items-center"
                    >
                      Signup
                    </motion.span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
