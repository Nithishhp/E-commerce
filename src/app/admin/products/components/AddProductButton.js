'use client';

import { useState } from 'react';
import ProductForm from './ProductForm';

export default function AddProductButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
      >
        Add New Product
      </button>
      
      {isModalOpen && (
        <ProductForm
          onClose={() => setIsModalOpen(false)}
          isNew={true}
        />
      )}
    </>
  );
}