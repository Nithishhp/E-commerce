'use client';

import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default function ProfileClient({ user }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pt-16 ">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-600">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-gray-200 mt-1">{user.email}</p>
                <div className="mt-2 inline-flex items-center px-4 py-1 bg-white bg-opacity-20 rounded-full">
                  <span className="text-sm font-medium text-white">
                    {user.role === 'admin' ? 'Administrator' : 'Premium Member'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h2>
                <nav className="space-y-3">
                  <Link
                    href="/orders"
                    className="flex items-center gap-3 p-3 hover:bg-white rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-gray-700">My Orders</span>
                  </Link>
                  
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 p-3 hover:bg-white rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <span className="text-gray-700">Admin Dashboard</span>
                    </Link>
                  )}
                  
                  <LogoutButton className="w-full flex items-center gap-3 p-3 hover:bg-white rounded-lg transition-colors text-red-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </LogoutButton>
                </nav>
              </div>
            </div>

            {/* Account Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Account Overview</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-900">January 2023</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="font-medium text-gray-900">15</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Account Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">Active</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Security Level</p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Strong</span>
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order #1234 Completed</p>
                        <p className="text-sm text-gray-600">July 15, 2023</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">Completed</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Password Updated</p>
                        <p className="text-sm text-gray-600">July 10, 2023</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Security</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}