'use client';

import { useState } from 'react';
import BulkUploadModal from './BulkUploadModal';

export default function BulkUploadButton({ onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 ml-2"
      >
        Bulk Upload
      </button>
      
      {isModalOpen && (
        <BulkUploadModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}