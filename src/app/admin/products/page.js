'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import ProductForm from './components/ProductForm';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import BulkUploadModal from './components/BulkUploadModal';
import Image from 'next/image';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [showAll, setShowAll] = useState(false);
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };
  
  // Get current items
  const currentItems = useMemo(() => {
    if (showAll) return products;
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return products.slice(indexOfFirstItem, indexOfLastItem);
  }, [products, currentPage, itemsPerPage, showAll]);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Go to next page
  const nextPage = () => {
    if (currentPage < Math.ceil(products.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const pageNumbers = [];
    const maxPageButtons = 5; // Maximum number of page buttons to show
    
    if (totalPages <= maxPageButtons) {
      // Show all page numbers if total pages is less than max buttons
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Calculate start and end of page range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always include last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  const handleAddProduct = () => {
    setShowAddModal(true);
  };
  
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };
  
  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };
  
  const handleBulkUpload = () => {
    setShowBulkUploadModal(true);
  };
  
  const handleProductSuccess = () => {
    fetchProducts();
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedProduct(null);
    toast.success('Product saved successfully');
  };
  
  const handleDeleteSuccess = () => {
    fetchProducts();
    setShowDeleteModal(false);
    setSelectedProduct(null);
    toast.success('Product deleted successfully');
  };
  
  const handleBulkUploadSuccess = () => {
    fetchProducts();
    setShowBulkUploadModal(false);
    toast.success('Products uploaded successfully');
  };
  
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8 pt-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Products</h1>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8 pt-16">
      <div className="max-w-6xl mx-auto pt-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center">
            <Link 
              href="/admin" 
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Back to Dashboard"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/admin/categories"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Manage Categories
            </Link>
            <button
              onClick={handleBulkUpload}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Bulk Upload
            </button>
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Product
            </button>
          </div>
        </div>
        
        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-gray-500 mb-6">Get started by adding your first product</p>
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 relative">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.availability ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="ml-2 text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {products.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500">
                  Showing {showAll ? 'all' : `${Math.min((currentPage - 1) * itemsPerPage + 1, products.length)}-${Math.min(currentPage * itemsPerPage, products.length)}`} of {products.length} products
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center mr-4">
                    <label htmlFor="itemsPerPage" className="text-sm text-gray-500 mr-2">
                      Items per page:
                    </label>
                    <select
                      id="itemsPerPage"
                      value={showAll ? 'all' : itemsPerPage}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === 'all') {
                          setShowAll(true);
                        } else {
                          setShowAll(false);
                          setItemsPerPage(Number(value));
                          setCurrentPage(1); // Reset to first page when changing items per page
                        }
                      }}
                      className="px-2 py-1 border border-gray-200 rounded-md text-sm"
                      disabled={products.length <= 7}
                    >
                      <option value={7}>7</option>
                      <option value={15}>15</option>
                      <option value={30}>30</option>
                      <option value="all">Show All</option>
                    </select>
                  </div>
                  
                  {!showAll && Math.ceil(products.length / itemsPerPage) > 1 && (
                    <div className="flex items-center">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      {getPageNumbers().map((number, index) => (
                        <button
                          key={index}
                          onClick={() => typeof number === 'number' && paginate(number)}
                          className={`px-3 py-1 rounded-md ${
                            number === currentPage 
                              ? 'bg-gray-100 text-gray-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {number}
                        </button>
                      ))}
                      
                      <button
                        onClick={nextPage}
                        disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === Math.ceil(products.length / itemsPerPage) 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Modals */}
        {showAddModal && (
          <ProductForm
            onClose={() => setShowAddModal(false)}
            onSuccess={handleProductSuccess}
            isNew={true}
          />
        )}
        
        {showEditModal && selectedProduct && (
          <ProductForm
            product={selectedProduct}
            onClose={() => {
              setShowEditModal(false);
              setSelectedProduct(null);
            }}
            onSuccess={handleProductSuccess}
            isNew={false}
          />
        )}
        
        {showDeleteModal && selectedProduct && (
          <DeleteConfirmationModal
            product={selectedProduct}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedProduct(null);
            }}
            onSuccess={handleDeleteSuccess}
          />
        )}
        
        {showBulkUploadModal && (
          <BulkUploadModal
            onClose={() => setShowBulkUploadModal(false)}
            onSuccess={handleBulkUploadSuccess}
          />
        )}
      </div>
    </div>
  );
}




